'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const common = require('../common');

const model = 'KineticRequest';

// const getListCriteria = {};

const getCriteria = {
    include: [
        {
            model: db.AntigenReagent,
            attributes: ['name', 'catalogId', 'vendor'],
            include: [{
                model: db.Protein,
                attributes: ['id', 'name']
            }],
            through: { attributes: [] }
        },
        {
            model: db.Transfection,
            attributes: ['id', 'name'],
            include: [{
                model: db.TransfectionRequest,
                attributes: ['id'],
                include: [{
                    model: db.Protein,
                    attributes: ['id', 'name']
                }]
            }],
            through: { attributes: [] }
        },
        {
            model: db.ProteinPurification,
            attributes: ['id', 'name'],
            include: [{
                model: db.Transfection,
                attributes: ['id'],
                include: [{
                    model: db.TransfectionRequest,
                    attributes: ['id'],
                    include: [{
                        model: db.Protein,
                        attributes: ['id', 'name', 'description']
                    }]
                }]
            }],
            through: { attributes: [] }
        },
        {
            model: db.BioreactorPurification,
            attributes: ['id', 'name'],
            include: [{
                model: db.Bioreactor,
                attributes: ['id', 'name'],
                include: [{
                    model: db.CLDHarvest,
                    attributes: ['id', 'name'],
                    include: [{
                        model: db.CellLineExperiment,
                        as: 'experiment',
                        attributes: ['id'],
                        include: [{
                            model: db.StableCellLine,
                            attributes: ['id', 'name'],
                            include: [{
                                model: db.Protein,
                                attributes: ['id', 'name']
                            }]
                        }]
                    }]
                }]
            }],
            through: { attributes: [] }
        },
        {
            model: db.CellLinePurification,
            attributes: ['id', 'name'],
            include: [{
                model: db.CLDHarvest,
                attributes: ['id', 'name', 'wellName'],
                include: [{
                    model: db.CellLineExperiment,
                    as: 'experiment',
                    attributes: ['id'],
                    include: [{
                        model: db.StableCellLine,
                        attributes: ['id', 'name'],
                        include: [{
                            model: db.Protein,
                            attributes: ['id', 'name']
                        }]
                    }]
                }]
            }],
            through: { attributes: [] }
        }
    ]
};

router.post('/get', common.getEntry(model, getCriteria));
router.post('/create', createEntry);
router.post('/update', common.updateEntry(model));
router.get('/getlist', common.getList(model, 'kineticRequests'));
router.get('/getmapping', common.getNameMapping(model));
router.post('/searchByColumn', searchByColumn);

function createEntry (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when createEntry' });
        return;
    }
    const reqBody = req.body;

    if (!reqBody.userId) {
        res.status(400).json({ error: 'invalid userId when createEntry' });
        return;
    }
    reqBody.createdBy = reqBody.userId;
    reqBody.updatedBy = reqBody.userId;

    db.KineticRequest.create(reqBody).then(function (result) {
        const nameToUpdate = {
            name: 'OR' + result.id
        };
        // Add links
        if (reqBody.testAntigens && reqBody.testAntigens.length) {
            result.addAntigenReagents(reqBody.testAntigens);
        }
        if (reqBody.purificationsToAdd && reqBody.purificationsToAdd.length) {
            result.addProteinPurifications(reqBody.purificationsToAdd);
        }
        if (reqBody.transfectionsToAdd && reqBody.transfectionsToAdd.length) {
            result.addTransfections(reqBody.transfectionsToAdd);
        }
        if (reqBody.bioreactorsToAdd && reqBody.bioreactorsToAdd.length) {
            result.addBioreactorPurifications(reqBody.bioreactorsToAdd);
        }
        if (reqBody.cellLinesToAdd && reqBody.cellLinesToAdd.length) {
            result.addCellLinePurifications(reqBody.cellLinesToAdd);
        }
        result.name = nameToUpdate.name;
        db.KineticRequest.update(nameToUpdate, { where: { id: result.id } }).then(() => {
            res.status(200).json(result);
        }, function (rejectedPromiseError) {
            res.status(500).json({ error: rejectedPromiseError });
            winston.error('update after create Failed: ', rejectedPromiseError);
        });
    }, function (rejectedPromiseError) {
        if (rejectedPromiseError.name === 'SequelizeForeignKeyConstraintError') {
            res.status(403).json({ error: rejectedPromiseError.index + ' value out of range' });
            return;
        }
        res.status(500).json({ error: rejectedPromiseError });
        winston.error('create Failed: ', rejectedPromiseError);
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
        },
        attributes: {
            include: [
                [db.Sequelize.literal('GROUP_CONCAT(DISTINCT `AntigenReagents`.name SEPARATOR ", ")'), 'antigens'],
                [db.Sequelize.literal(
                    'CONCAT_WS(", ", ' +
                    'GROUP_CONCAT(DISTINCT `ProteinPurifications`.name SEPARATOR ", "),' +
                    'GROUP_CONCAT(DISTINCT `Transfections`.name SEPARATOR ", "),' +
                    'GROUP_CONCAT(DISTINCT `BioreactorPurifications`.name SEPARATOR ", "),' +
                    'GROUP_CONCAT(DISTINCT `CellLinePurifications`.name SEPARATOR ", "),' +
                    '`KineticRequest`.otherSample' +
                    ')'
                ), 'antibodies']
            ]
        },
        include: [
            {
                model: db.AntigenReagent,
                attributes: []
            },
            {
                model: db.Transfection,
                attributes: []
            },
            {
                model: db.ProteinPurification,
                attributes: []
            },
            {
                model: db.CellLinePurification,
                attributes: []
            },
            {
                model: db.BioreactorPurification,
                attributes: []
            }
        ],
        group: 'id'
    };
    for (let i in colNames) {
        criteria.where[i] = colNames[i];
    }

    db.KineticRequest.findAll(criteria).then(function (KineticRequest) {
        res.json(KineticRequest);
    }, function (rejectedPromiseError) {
        winston.error('searchByProject Failed: ', rejectedPromiseError);
        res.status(500).json({ error: rejectedPromiseError });
    });
}

module.exports = router;
