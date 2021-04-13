'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const asyncRequest = require('request');
const config = require(global.__base + 'config/config');
const winston = require(global.__base + 'config/winston');
const common = require('../common');

const model = 'TransfectionRequest';

const getCriteria = {
    include: [{
        model: db.Protein,
        attributes: ['id', 'name', 'description'],
        include: [{
            model: db.Plasmid,
            attributes: ['id', 'name'],
            through: { attributes: [] }
        }]
    }]
};

router.post('/get', common.getEntry(model, getCriteria));
router.post('/create', createTransfectionRequest);
router.post('/update', updateTransfectionRequest);
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'transfectionRequest'));
router.get('/getmapping', getNameMapping);
router.post('/searchByColumn', searchByColumn);

function getNameMapping (req, res) {
    db.TransfectionRequest.findAll({
        attributes: ['id', 'name', 'requestStatus', 'requestedDate', 'requestedHarvestDate', 'purifyOrNot', 'updatedAt',
            [db.Sequelize.literal('CONCAT(Protein.name, " - ", Protein.description)'), 'protein']
        ],
        where: { isDeleted: false },
        include: [{
            model: db.Protein,
            attributes: []
        }]
    }).then(function (TransfectionRequest) {
        res.status(200).json(TransfectionRequest);
    }, function (rejectedPromiseError) {
        winston.error('getNameMapping Failed: ', rejectedPromiseError);
        res.status(500).json({ error: 'getNameMapping Failed. Please check db' });
    });
}

function createTransfectionRequest (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when createTransfection' });
        return;
    }
    const rb = req.body;

    if (!rb.userId) {
        res.status(400).json({ error: 'invalid userId when createTransfection' });
        return;
    }

    rb.requesterId = rb.userId;
    rb.createdBy = rb.userId;
    rb.updatedBy = rb.userId;
    rb.requestStatus = 'Pending';

    db.EnumConfig.find({ where: { tableName: 'transfectionRequests' }, raw: true }).then(function (enumConfig) {
        const currProp = JSON.parse(enumConfig.properties);
        for (const fieldName in rb) {
            if (rb.hasOwnProperty(fieldName)) {
                if (fieldName.startsWith('ENUM_')) {
                    const value = rb[fieldName];
                    if (value) {
                        const enumList = currProp[fieldName];
                        if (enumList.indexOf(value) < 0) {
                            res.status(403).json({ error: fieldName + ' value out of range : ' + enumList.join(';') });
                            return;
                        }
                    }
                }
            }
        }

        db.TransfectionRequest.create(rb).then(function (result) {
            const slackDetails = {
                type: 'TR',
                id: result.id,
                requestor: rb.requesterId,
                scale: rb.ENUM_transfectionScale,
                cellLine: rb.ENUM_transfectionCellLine,
                transfectionType: rb.ENUM_transfectionType,
                proteinId: rb.proteinId
            };
            const postOptions = {
                method: 'post',
                body: slackDetails,
                json: true,
                url: config.slackUrl
            };
            asyncRequest(postOptions);

            const nameToUpdate = {
                name: 'TR' + result.id
            };
            db.TransfectionRequest.update(nameToUpdate, { where: { id: result.id } }).then(function () {
                result.name = nameToUpdate.name;
                res.status(200).json(result);
            }, function (rejectedPromiseError) { // Fail to update.
                res.status(500).json({ error: rejectedPromiseError });
            });
        }, function (rejectedPromiseError) {
            if (rejectedPromiseError.name === 'SequelizeForeignKeyConstraintError') {
                res.status(403).json({ error: rejectedPromiseError.index + ' value out of range' });
                return;
            }
            res.status(500).json({ error: rejectedPromiseError });
        });
    }, function (rejectedPromiseError) {
        res.status(500).json({ error: 'db', yousend: rb, dbsays: rejectedPromiseError });
    });
}

function updateTransfectionRequest (req, res) {
    let postOptions;
    let slackDetails;
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when updateTransfection' });
        return;
    }
    const reqBody = req.body;
    if (!reqBody.userId) {
        res.status(400).json({ error: 'invalid userId when updateTransfection' });
        return;
    }
    if (!reqBody.id) {
        res.status(400).json({ error: 'empty transfection id when updateTransfection' });
        return;
    }

    if (!reqBody.updatedAt) {
        res.status(400).json({ error: 'empty updatedAt when updateTransfection' });
        return;
    }

    db.TransfectionRequest.findOne({ where: { id: reqBody.id } }).then(function (transfectionRequest) {
        if (!transfectionRequest) {
            res.status(404).json({ error: 'the transfectionRequest is not found' });
            return;
        }
        if (new Date(transfectionRequest.updatedAt).valueOf() !== new Date(reqBody.updatedAt).valueOf()) {
            res.status(403).json({ error: 'conflict' });
            return;
        }
        delete reqBody.updatedAt;

        db.TransfectionRequest.update(reqBody, { where: { id: reqBody.id } }).then(function () {
            res.status(200).json({ message: 'ok' });
        }, function (err) {
            if (err) {
                res.status(500).json({ error: 'update TransfectionRequest Failed. Please check db' });
            }
        });
    }, function (err) {
        console.log('find err:', err);
        res.status(500).json({ error: 'get transfectionRequest failed. Find id error.' });
    });

    if (reqBody.requestStatus === 'In Purification') {
        slackDetails = {
            type: 'PR', // Ready for Purification
            id: reqBody.id
        };
        postOptions = {
            method: 'post',
            body: slackDetails,
            json: true,
            url: config.slackUrl
        };
        asyncRequest(postOptions);
    }

    if (reqBody.requestStatus === 'Completed' || reqBody.requestStatus === 'Failed') {
        slackDetails = {
            type: 'T',
            id: reqBody.id,
            requestStatus: reqBody.requestStatus
        };
        postOptions = {
            method: 'post',
            body: slackDetails,
            json: true,
            url: config.slackUrl
        };
        asyncRequest(postOptions);
    }
}

function searchByColumn (req, res) {
    const result = {
        tableName: 'TransfectionRequest'
    };
    const body = req.body;
    const colNames = body.columns;

    if (!colNames) {
        res.status(400).json({ error: 'Empty column name.' });
        return;
    }

    const criteria = {
        where: {
            isDeleted: false
        }
    };

    for (let i in colNames) {
        if (i === 'bulkEdit' && colNames[i]) {
            criteria.include = [{
                model: db.Protein,
                attributes: [],
                include: [{
                    model: db.Plasmid,
                    attributes: [],
                    through: { attributes: [] }
                }]
            }];
            criteria.attributes = ['id', 'name', 'requestStatus', 'proteinId', 'requesterId', 'dnaReady', 'notes', 'updatedAt',
                [db.Sequelize.literal("GROUP_CONCAT(`Protein->Plasmids`.name SEPARATOR ', ')"), 'plasmids']
            ];
            criteria.group = 'id';
        } else if (colNames[i] != null) {
            criteria.where[i] = colNames[i];
        }
    }

    db.TransfectionRequest.findAll(criteria).then(function (TransfectionRequest) {
        result.records = TransfectionRequest;
        db.EnumConfig.find({ where: { tableName: 'transfectionRequests' }, raw: true }).then(function (enumConfig) {
            result.enums = enumConfig ? enumConfig.properties : null;
            res.json(result);
        }, function (rejectedPromiseError) {
            res.status(500).json({ error: rejectedPromiseError });
        });
    }, function (rejectedPromiseError) {
        winston.error('getTRList Failed: ', rejectedPromiseError);
        res.status(500).json({ error: rejectedPromiseError });
    });
}

module.exports = router;
