'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const asyncRequest = require('request');
const config = require(global.__base + 'config/config');
const winston = require(global.__base + 'config/winston');
const common = require('../common');

const model = 'Plasmid';

const getCriteria = {
    include: [
        {
            model: db.Protein,
            attributes: ['id', 'name', 'description'],
            through: { attributes: [] },
            where: { isDeleted: false },
            required: false
        },
        {
            model: db.PlasmidLot,
            attributes: ['id', 'concentration', 'orderRef', 'notes', 'volume', 'prepDate', 'createdBy', 'operator'],
            where: { isDeleted: false },
            required: false
        },
        {
            model: db.PlasmidData,
            attributes: ['urn', 'dnaSequence', 'aaSequence']
        },
        {
            model: db.PlasmidAnnotation,
            attributes: ['description', 'type', 'start', 'end']
        },
        {
            model: db.ConstructStatus,
            attributes: ['id', 'name', 'status']
        }
    ],
    order: [
        [{ model: db.PlasmidAnnotation }, 'start', 'ASC']
    ]
};

const getListCriteria = {
    attributes: {
        include: [
            [db.Sequelize.literal('IFNULL(`ConstructStatus`.completed, `Plasmid`.completed)'), 'completed']
        ]
    },
    include: [{
        model: db.ConstructStatus,
        attributes: []
    }]
}

const getMappingAttrs = ['id', 'name', 'description', 'concentration'];

router.post('/get', common.getEntry(model, getCriteria));
router.post('/create', checkConstructStatus, common.createEntry(model, 'SIP'));
router.post('/update', updatePlasmid);
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'plasmids', getListCriteria));
router.get('/getmapping', common.getNameMapping(model, getMappingAttrs));
router.post('/searchByColumn', searchByColumn);
router.post('/searchByProject', searchByProject);

function checkConstructStatus (req, res, next) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when createPlasmid' });
        return;
    }
    const reqBody = req.body;
    if (!reqBody.constructStatusId) {
        req.body.description = reqBody.description ? reqBody.description : null;
        req.body.sequenceReviewed = true;
        req.body.requesterId = req.body.userId;
        db.ConstructStatus.create(reqBody).then(resp => {
            db.ConstructStatus.update({ name: 'CS' + resp.id }, { where: { id: resp.id } });
            req.body.constructStatusId = resp.id;
            next();
        });
    } else {
        next();
    }
}

// function createPlasmid (req, res) {
//     if (!req.body) {
//         res.status(400).json({ error: 'Empty payload when createPlasmid' });
//         return;
//     }
//     const reqBody = req.body;
//
//     if (!reqBody.userId) {
//         res.status(400).json({ error: 'invalid userId when createPlasmid' });
//         return;
//     }
//
//     reqBody.createdBy = reqBody.userId;
//     reqBody.updatedBy = reqBody.userId;
//
//     db.Plasmid.create(reqBody).then(function (result) {
//         const plasmidToUpdate = {
//             name: 'SIP' + result.id
//         };
//         db.Plasmid.update(plasmidToUpdate, { where: { id: result.id } }).then(() => {
//             result.name = plasmidToUpdate.name;
//             if (reqBody.createRequest) {
//                 reqBody.plasmidId = result.id;
//                 db.ConstructRequest.create(reqBody).then(() => {
//                     res.status(200).json(result);
//                 });
//             } else {
//                 res.status(200).json(result);
//             }
//         }, function (rejectedPromiseError) {
//             winston.error('update from create Failed: ', rejectedPromiseError);
//             res.status(500).json({ error: rejectedPromiseError });
//         });
//     }, function (rejectedPromiseError) {
//         winston.error('create Failed: ', rejectedPromiseError);
//         if (rejectedPromiseError.name === 'SequelizeForeignKeyConstraintError') {
//             res.status(403).json({ error: rejectedPromiseError.index + ' value out of range' });
//         }
//         res.status(500).json({ error: rejectedPromiseError });
//     });
// }

function updatePlasmid (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when updateEntry' });
        return;
    }
    const reqBody = req.body;

    db.Plasmid.findOne({ where: { id: reqBody.id } }).then(function (entry) {
        if (entry) {
            if (reqBody.lots) {
                for (let i = 0; i < reqBody.lots.length; i++) {
                    const currEntry = reqBody.lots[i];
                    currEntry.updatedBy = reqBody.updatedBy;
                    if (currEntry.id) {
                        db.PlasmidLot.update(currEntry, { where: { id: currEntry.id } });
                    } else {
                        currEntry.plasmidId = reqBody.id;
                        currEntry.originalVolume = currEntry.volume;
                        currEntry.createdBy = reqBody.updatedBy;
                        db.PlasmidLot.create(currEntry, { where: { id: currEntry.id } });
                    }
                }
            }
            if (!entry.reprep && reqBody.reprep) {
                sendReprepNotification({ name: entry.name, id: entry.id, updatedBy: reqBody.updatedBy });
            }
            db.Plasmid.update(reqBody, { where: { id: reqBody.id } }).then(function (result) {
                res.status(200).json({ message: 'updated', data: result });
            }, function (err) {
                winston.error('update Failed: ', err);
                res.status(500).json({ error: err });
            });
        } else {
            res.status(400).json({ error: 'no entry exists' });
        }
    }, function (err) {
        winston.error('update Failed: ', err);
        res.status(500).json({ error: 'find id error.' });
    });
}

function searchByColumn (req, res) {
    let criteria = {};
    const result = {};
    const body = req.body;
    let colName = body.columnName;

    if (!colName) {
        res.status(400).json({ error: 'Empty column name.' });
        return;
    }

    let searchTerm = body.term;
    if (!searchTerm) {
        res.status(400).json({ error: 'Empty search term.' });
        return;
    }

    const flag = body.flag;

    if (flag === 'contains') {
        criteria.where = {};
        criteria.where.isDeleted = false;
        criteria.where[colName] = {
            $like: '%' + searchTerm + '%'
        };

        db.Plasmid.findAll(criteria).then(function (plasmids) {
            result.records = plasmids;
            res.json(result);
        }, function (rejectedPromiseError) {
            res.status(500).json({ error: rejectedPromiseError });
        });
    } else { // Assume exact search.
        criteria.where = {};
        criteria.where.isDeleted = false;
        criteria.where[colName] = searchTerm;

        db.Plasmid.findAll(criteria).then(function (plasmids) {
            result.records = plasmids;
            res.json(result);
        }, function (rejectedPromiseError) {
            winston.error('searchByColumn Failed: ', rejectedPromiseError);
            res.status(500).json({ error: rejectedPromiseError });
        });
    }
}

function searchByProject (req, res) {
    const body = req.body;

    const criteria = {
        where: {
            isDeleted: false,
            projectId: body.projectId
        },
        attributes: ['id', 'name', 'description', 'ENUM_vector', 'ENUM_bacteria', 'ENUM_plasmidTag', 'ENUM_mammalian', 'createdBy']
    };

    db.Plasmid.findAll(criteria).then(function (plasmids) {
        res.json(plasmids);
    }, function (rejectedPromiseError) {
        winston.error('searchByProject Failed: ', rejectedPromiseError);
        res.status(500).json({ error: rejectedPromiseError });
    });
}

function sendReprepNotification (entry) {
    entry.type = 'PREP';
    const postOptions = {
        method: 'post',
        body: entry,
        json: true,
        url: config.slackUrl
    };
    asyncRequest(postOptions);
}

module.exports = router;
