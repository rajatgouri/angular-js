'use strict';

const express = require('express');
const router = express.Router();
const winston = require(global.__base + 'config/winston');
const db = require(global.__base + 'config/sequelize');
const common = require('../common');

const model = 'ProteinPurification';

const getListCriteria = {
    where: { isDeleted: false },
    include: [{
        model: db.Transfection,
        attributes: ['octetTiter', 'name'],
        include: [{
            model: db.TransfectionRequest,
            attributes: ['requestStatus', 'name', 'id', 'updatedAt'],
            include: [{
                model: db.Protein,
                attributes: ['id', 'name', 'ENUM_moleculeType', 'molecularWeight']
            }]
        }]
    }],
    raw: true
};

const getCriteria = {
    include: [
        {
            model: db.Transfection,
            attributes: ['id', 'name', 'octetTiter'],
            include: [{
                model: db.TransfectionRequest,
                attributes: ['name'],
                include: [{
                    model: db.Protein,
                    attributes: ['id', 'name', 'description', 'pI',
                        [db.Sequelize.literal('ROUND(((`Transfection->TransfectionRequest->Protein`.molarExtCoefficient / `Transfection->TransfectionRequest->Protein`.molecularWeight) * 10), 2)'), 'nanoDrop']
                    ]
                }]
            }]
        },
        {
            model: db.ColumnPurificationData,
            attributes: {
                include: [
                    [db.Sequelize.literal('CASE ' +
                        'When `ColumnPurificationData`.notes LIKE "First Step" then (octetTiter / 1000) * loadVolume ' +
                        'ELSE loadConcentration * loadVolume ' +
                        'END'), 'loadMass'],
                    [db.Sequelize.literal('elutionVolume  * elutionConcentration'), 'elutionMass']
                ]
            },
            where: {
                isDeleted: false
            },
            required: false
        }, {
            model: db.SECData,
            attributes: ['id', 'proteinPurificationId', 'type', 'date', 'mp', 'hmw', 'lmw', 'analyzedBy', 'isDeleted'],
            where: { isDeleted: false },
            required: false
        }, {
            model: db.DLSData,
            attributes: ['id', 'proteinPurificationId', 'diameter', 'pd', 'molecularWeight', 'aggregate', 'meltingTemp', 'analyzedBy', 'date', 'isDeleted'],
            where: { isDeleted: false },
            required: false
        }, {
            model: db.MALSData,
            attributes: ['id', 'peakNum', 'molecularWeight', 'massFraction', 'uncertainty', 'analyzedBy', 'date', 'isDeleted'],
            where: { isDeleted: false },
            required: false
        }, {
            model: db.cIEFData,
            attributes: ['id', 'mp', 'rangeLow', 'rangeHigh', 'sharp', 'analyzedBy', 'date', 'isDeleted'],
            where: { isDeleted: false },
            required: false
        }, {
            model: db.BindingData,
            attributes: ['startDate', 'createdBy', 'sensorType', 'sensorId', 'loadingSensorId', 'response', 'kd', 'kon', 'kdis', 'fullR2'],
            where: { isDeleted: false },
            required: false
        }
    ]
};

const getMappingAttrs = ['id', 'name', [db.Sequelize.col('`Transfection->TransfectionRequest->Protein`.name'), 'protein']];
const getMappingInclude = [{
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
}];

router.post('/get', common.getEntry(model, getCriteria));
router.post('/create', createProteinPurification);
router.post('/update', updateProteinPurification);
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'proteinpurifications', getListCriteria));
router.get('/getmapping', common.getNameMapping(model, getMappingAttrs, getMappingInclude));
router.post('/searchByColumn', searchByColumn);

function createProteinPurification (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when createProteinPurification' });
        return;
    }
    const reqBody = req.body;

    if (!reqBody.userId) {
        res.status(400).json({ error: 'invalid userId when createProteinPurification' });
        return;
    }

    db.ProteinPurification.create(reqBody).then(function (result) {
        const nameToUpdate = 'P' + result.id;
        const dataTypes = ['ColumnPurificationData', 'SECData'];
        for (let i = 0; i < dataTypes.length; i++) {
            for (let j = 0; j < reqBody[dataTypes[i]].length; j++) {
                const currEntry = reqBody[dataTypes[i]][j];
                currEntry.updatedBy = reqBody.updatedBy;
                currEntry.createdBy = reqBody.updatedBy;
                currEntry.proteinPurificationId = result.id;
                db[dataTypes[i]].create(currEntry);
            }
        }
        db.ProteinPurification.update({ name: nameToUpdate }, { where: { id: result.id } }).then(function (ProteinPurification) {
            result.name = nameToUpdate;
            res.status(200).json(result);
        }, function (err) {
            winston.error('createProteinPurification Failed: ', err);
            res.status(500).json({ error: 'create ProteinPurification fail, check db.' });
        });
    }, function (rejectedPromiseError) {
        winston.error('createProteinPurification Failed: ', rejectedPromiseError);
        if (rejectedPromiseError.name === 'SequelizeForeignKeyConstraintError') {
            res.status(403).json({ error: rejectedPromiseError.index + ' value out of range' });
            return;
        }
        res.status(500).json({ error: 'create ProteinPurification Failed. Please check db' });
    });
}

function updateProteinPurification (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when updateProteinPurification' });
        return;
    }
    const reqBody = req.body;
    if (!reqBody.userId) {
        res.status(400).json({ error: 'invalid userId when updateProteinPurification' });
        return;
    }
    if (!reqBody.id) {
        res.status(400).json({ error: 'empty ProteinPurification id when updateProteinPurification' });
        return;
    }

    if (!reqBody.updatedAt) {
        res.status(400).json({ error: 'empty updatedAt when updateProteinPurification' });
        return;
    }

    db.ProteinPurification.findOne({ where: { id: reqBody.id } }).then(function (proteinPurification) {
        if (!proteinPurification) {
            res.status(404).json({ error: 'the proteinPurification is not found' });
            return;
        }
        if (new Date(proteinPurification.updatedAt).valueOf() !== new Date(reqBody.updatedAt).valueOf()) {
            res.status(403).json({ error: 'conflict' });
            return;
        }
        delete reqBody.updatedAt;

        db.ProteinPurification.update(reqBody, { where: { id: reqBody.id } }).then(function () {
            const dataTypes = ['ColumnPurificationData', 'SECData', 'MALSData', 'DLSData', 'cIEFData'];
            for (let i = 0; i < dataTypes.length; i++) {
                if (reqBody[dataTypes[i]]) {
                    for (let j = 0; j < reqBody[dataTypes[i]].length; j++) {
                        const currEntry = reqBody[dataTypes[i]][j];
                        currEntry.updatedBy = reqBody.updatedBy;
                        // Update condition
                        if (currEntry.id) {
                            db[dataTypes[i]].update(currEntry, { where: { id: currEntry.id } });
                            // New entry to create
                        } else {
                            currEntry.proteinPurificationId = reqBody.id;
                            currEntry.createdBy = reqBody.updatedBy;
                            db[dataTypes[i]].create(currEntry);
                        }
                    }
                }
            }
            res.status(200).json({ message: 'updated' });
        }, function (err) {
            winston.error('update Failed: ', err);
            res.status(500).json({ error: 'update Plasmid Failed. Please check db' });
        });
    }, function (err) {
        winston.error('update Failed: ', err);
        res.status(500).json({ error: 'get proteinPurification failed. Find id error.' });
    });
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

    if (colNames.summary && colNames.startDate && colNames.endDate) {
        const startDate = new Date(colNames.startDate).toISOString().substr(0, 19).replace('T', ' ');
        const endDate = new Date(colNames.endDate).toISOString().substr(0, 19).replace('T', ' ');
        db.sequelize.query('CALL PurificationWeeklySummary (:startDate, :endDate)',
            { replacements: { startDate: startDate, endDate: endDate } })
            .then(function (Summary) {
                res.json(Summary);
            }, function (rejectedPromiseError) {
                res.status(500).json({ error: rejectedPromiseError });
                winston.error('searchbycolumn Failed: ', rejectedPromiseError);
            });
    } else {
        for (const i in colNames) {
            if (colNames[i] != null) {
                criteria.where[i] = colNames[i];
            }
        }

        db.ProteinPurification.findAll(criteria).then(function (ProteinPurification) {
            res.json(ProteinPurification);
        }, function (rejectedPromiseError) {
            res.status(500).json({ error: rejectedPromiseError });
            winston.error('searchbycolumn Failed: ', rejectedPromiseError);
        });
    }
}

module.exports = router;
