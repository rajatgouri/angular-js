'use strict';

const express = require('express');
const router = express.Router();
const winston = require(global.__base + 'config/winston');
const db = require(global.__base + 'config/sequelize');
const asyncRequest = require('request');
const common = require('../common');
const config = require(global.__base + 'config/config');

const model = 'ProteinRequest';

const getListCriteria = {
    where: { isDeleted: false },
    attributes: {
        include: [
            [db.Sequelize.literal('`ProteinPurification`.`name`'), 'purificationName'],
            [db.Sequelize.literal('`ProteinPurification.Transfection.TransfectionRequest.Protein`.`name`'), 'proteinName']
        ]
    },
    include: [
        {
            model: db.ProteinPurification,
            attributes: ['id', 'name', 'finalConcentration', 'finalVolume'],
            include: [{
                model: db.Transfection,
                attributes: [],
                include: [{
                    model: db.TransfectionRequest,
                    attributes: [],
                    include: [{
                        model: db.Protein,
                        attributes: []
                    }]
                }]
            }]
        }
    ]
};

router.post('/get', common.getEntry(model));
router.post('/create', create);
router.post('/update', update);
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'proteinRequests', getListCriteria));
router.get('/getmapping', common.getNameMapping(model));
router.post('/searchByColumn', searchByColumn);

function create (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when createProteinRequest' });
        return;
    }
    const reqBody = req.body;

    if (!reqBody.userId) {
        res.status(400).json({ error: 'invalid userId when createProteinRequest' });
        return;
    }

    db.ProteinRequest.create(reqBody).then(function (result) {
        const nameToUpdate = 'PR' + result.id;
        db.ProteinRequest.update({ name: nameToUpdate }, { where: { id: result.id } }).then(function (ProteinPurification) {
            result.name = nameToUpdate;
            sendNotification(result.id, 'PROR');
            res.status(200).json(result);
        }, function (err) {
            winston.error('create protein request Failed: ', err);
            res.status(500).json({ error: 'create ProteinRequest fail, check db.' });
        });
    }, function (rejectedPromiseError) {
        winston.error('create protein request Failed: ', rejectedPromiseError);
        if (rejectedPromiseError.name === 'SequelizeForeignKeyConstraintError') {
            res.status(403).json({ error: rejectedPromiseError.index + ' value out of range' });
            return;
        }
        res.status(500).json({ error: 'create ProteinRequest Failed. Please check db' });
    });
}

function update (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when update' });
        return;
    }
    const reqBody = req.body;
    if (!reqBody.userId) {
        res.status(400).json({ error: 'invalid userId when update' });
        return;
    }
    if (!reqBody.id) {
        res.status(400).json({ error: 'empty request id when update' });
        return;
    }

    if (!reqBody.updatedAt) {
        res.status(400).json({ error: 'empty updatedAt when update' });
        return;
    }
    db.ProteinRequest.findOne({ where: { id: reqBody.id } }).then(function (proteinRequest) {
        if (!proteinRequest) {
            res.status(404).json({ error: 'the proteinRequest is not found' });
            return;
        }
        if (new Date(proteinRequest.updatedAt).valueOf() !== new Date(reqBody.updatedAt).valueOf()) {
            res.status(403).json({ error: 'conflict' });
            return;
        }
        delete reqBody.updatedAt;

        db.ProteinRequest.update(reqBody, { where: { id: reqBody.id } }).then(function (ProteinRequest) {
            // If it's on fulfillment form, update purification volume remaining
            if (reqBody.fulfillment) {
                if (!reqBody.proteinPurificationId || !reqBody.volumeUsed) {
                    res.status(403).json({ error: 'volumeUsed and proteinPurificationId is required to update volume' });
                    return;
                }
                db.ProteinPurification.findOne({ where: { id: reqBody.proteinPurificationId } }).then(function (purification) {
                    if (!purification) {
                        res.status(403).json({ error: 'the purification is not found' });
                    }
                    const newVolume = Math.round(1000 * (purification.volumeRemaining - (reqBody.volumeUsed / 1000))) / 1000;
                    db.ProteinPurification.update({ volumeRemaining: newVolume }, { where: { id: reqBody.proteinPurificationId } }).then(function (result) {
                        // Send notification on completion
                        sendNotification(reqBody.id, 'PROF');
                        res.status(200).json({ message: 'updated' });
                    });
                });
            } else if (reqBody.denied) {
                // Notify user that it's been denied
                sendNotification(reqBody.id, 'PROF');
                res.status(200).json({ message: 'updated' });
            } else {
                res.status(200).json({ message: 'updated' });
            }
        }, function (err) {
            winston.error('update Protein Request Failed: ', err);
            res.status(500).json({ error: 'update ProteinRequest Failed. Please check db' });
        });
    }, function (err) {
        winston.error('update Protein Request Failed: ', err);
        res.status(500).json({ error: 'get ProteinRequest failed. Find id error.' });
    });
}

function sendNotification (id, type) {
    const url = config.slackUrl;
    if (config.NODE_ENV !== 'development') {
        db.ProteinRequest.findOne({
            where: { id: id },
            include: [
                { model: db.Protein },
                { model: db.ProteinPurification }
            ],
            raw: true
        }).then(request => {
            request.type = type;
            asyncRequest({
                method: 'post',
                body: request,
                json: true,
                url: url
            });
        });
    }
}

function searchByColumn (req, res) {
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

    if (colNames.proteins) {
        db.Protein.findAll({
            include: [{
                model: db.TransfectionRequest,
                where: { requestStatus: 'Completed', isDeleted: false },
                attributes: [],
                include: [{
                    model: db.Transfection,
                    attributes: [],
                    include: [{
                        model: db.ProteinPurification,
                        attributes: [],
                        where: { isDeleted: false },
                        required: true
                    }]
                }]
            }]
        }).then(function (Protein) {
            res.json(Protein);
        }, function (rejectedPromiseError) {
            res.status(500).json({ error: rejectedPromiseError });
        });
    } else if (colNames.proteinId) {
        criteria.include = [{
            model: db.Transfection,
            attributes: [],
            include: [{
                model: db.TransfectionRequest,
                where: { isDeleted: false },
                attributes: [],
                include: [{
                    model: db.Protein,
                    attributes: []
                }]
            }]
        }];
        criteria.attributes = ['id', 'name', 'finalConcentration', 'finalVolume', 'volumeRemaining'];
        criteria.where['$`Transfection.TransfectionRequest.Protein`.id$'] = colNames.proteinId;
        db.ProteinPurification.findAll(criteria).then(function (ProteinPurification) {
            res.json(ProteinPurification);
        }, function (rejectedPromiseError) {
            winston.error('search Protein Request Failed: ', rejectedPromiseError);
            res.status(500).json({ error: rejectedPromiseError });
        });
    } else if (colNames.purifications) {
        criteria.include = [{
            model: db.Transfection,
            attributes: ['name'],
            include: [{
                model: db.TransfectionRequest,
                attributes: ['name'],
                where: { isDeleted: false, requestStatus: 'Completed' },
                include: [{
                    model: db.Protein,
                    attributes: ['id']
                }]
            }]
        }];
        criteria.attributes = ['id', 'name', 'finalConcentration', 'volumeRemaining'];
        db.ProteinPurification.findAll(criteria).then(function (ProteinPurification) {
            res.json(ProteinPurification);
        }, function (rejectedPromiseError) {
            winston.error('search Protein Request Failed: ', rejectedPromiseError);
            res.status(500).json({ error: rejectedPromiseError });
        });
    } else {
        for (const i in colNames) {
            if (colNames[i] != null) {
                criteria.where[i] = colNames[i];
            }
        }

        criteria.include = [
            {
                model: db.ProteinPurification,
                attributes: ['id', 'name', 'finalConcentration', 'finalVolume', 'volumeRemaining']
            },
            {
                model: db.Protein,
                attributes: ['id', 'name']
            }
        ];
        criteria.attributes = {
            include: [
                [db.Sequelize.literal('`ProteinPurification`.name'), 'purification'],
                [db.Sequelize.literal('`Protein`.name'), 'protein'],
                [db.Sequelize.literal("CONCAT_WS(' - ',`ProteinRequest`.name, `ProteinPurification`.name, DATE(`ProteinRequest`.createdAt))"), 'friendlyName'],
                [db.Sequelize.literal('CASE ' +
                    'When `ProteinRequest`.volumeAmount is not null then volumeAmount ' +
                    'ELSE ROUND(`ProteinRequest`.massAmount / `ProteinPurification`.finalConcentration, 1) ' +
                    'END'), 'volumeRequested']
            ]
        };

        db.ProteinRequest.findAll(criteria).then(function (ProteinRequest) {
            res.json(ProteinRequest);
        }, function (rejectedPromiseError) {
            winston.error('search Protein Request Failed: ', rejectedPromiseError);
            res.status(500).json({ error: rejectedPromiseError });
        });
    }
}

module.exports = router;
