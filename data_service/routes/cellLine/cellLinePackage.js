'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const common = require('../common');

const model = 'CellLinePackage';

const getListCriteria = {
    where: { isDeleted: false },
    attributes: {
        include: [
            [db.Sequelize.literal('`CellLinePurificationData->CLDHarvest->experiment`.experimentType'), 'experimentType'],
            [db.Sequelize.literal('`CellLinePurificationData->CLDHarvest->experiment->StableCellLine`.name'), 'stableCellLine'],
            [db.Sequelize.literal('`CellLinePurificationData->CLDHarvest->experiment->StableCellLine->Protein`.name'), 'protein']
        ]
    },
    include: [{
        model: db.CellLinePurificationData,
        attributes: [],
        include: [{
            model: db.CLDHarvest,
            attributes: [],
            include: [{
                model: db.CellLineExperiment,
                as: 'experiment',
                attributes: [],
                include: [{
                    model: db.StableCellLine,
                    attributes: [],
                    include: [{
                        model: db.Protein,
                        attributes: []
                    }]
                }]
            }]
        }]
    }],
    group: 'id'
};

const getCriteria = {
    attributes: {
        include: [
            [db.Sequelize.literal('`CellLinePurificationData->CLDHarvest->experiment`.experimentType'), 'experimentType'],
            [db.Sequelize.literal('`CellLinePurificationData->CLDHarvest->experiment->StableCellLine`.name'), 'stableCellLine'],
            [db.Sequelize.literal('`CellLinePurificationData->CLDHarvest->experiment->StableCellLine`.id'), 'stableCellLineId'],
            [db.Sequelize.literal('`CellLinePurificationData->CLDHarvest->experiment->minipool`.wellName'), 'minipool'],
            [db.Sequelize.literal('`CellLinePurificationData->CLDHarvest->experiment->minipool`.id'), 'minipoolId'],
            [db.Sequelize.literal('`CellLinePurificationData->CLDHarvest->experiment->StableCellLine->Protein`.name'), 'protein'],
            [db.Sequelize.literal('`CellLinePurificationData->CLDHarvest->experiment->StableCellLine->Protein`.id'), 'proteinId'],
            [db.Sequelize.literal('`CellLinePurificationData->CLDHarvest->experiment->StableCellLine->Protein->Project`.name'), 'project'],
            [db.Sequelize.literal('`CellLinePurificationData->CLDHarvest->experiment->StableCellLine->Protein->Project`.id'), 'projectId']
        ]
    },
    include: [{
        model: db.CellLinePurificationData,
        attributes: ['yield', 'proAHMW', 'nPrAHMW', 'nrCELMW', 'rCELMW', 'cIEF', 'nglycan'],
        include: [{
            model: db.CLDHarvest,
            attributes: ['id', 'wellName', 'titer', 'harvestDayVCD', 'harvestDayViability', 'ENUM_titerMethod', 'harvestDate'],
            include: [{
                model: db.CellLineExperiment,
                as: 'experiment',
                attributes: ['name', 'id'],
                include: [
                    {
                        model: db.StableCellLine,
                        attributes: [],
                        include: [{
                            model: db.Protein,
                            attributes: [],
                            include: [{
                                model: db.Project,
                                attributes: ['name']
                            }]
                        }]
                    },
                    {
                        model: db.CLDHarvest,
                        as: 'minipool',
                        attributes: ['id', 'wellName']
                    }
                ]
            }]
        }]
    }]
};

router.post('/get', common.getEntry(model, getCriteria));
router.post('/create', createPackage);
router.post('/update', updateCLPackage);
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'cellLinePackages', getListCriteria));
router.get('/getmapping', common.getNameMapping(model));
router.post('/searchByColumn', searchByColumn);

function createPackage (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when createCLPackage' });
        return;
    }
    const reqBody = req.body;
    reqBody.createdBy = reqBody.userId;
    reqBody.updatedBy = reqBody.userId;

    if (!reqBody.dataToAdd) {
        res.status(400).json({ error: 'Empty raw data payload when createCLPackage' });
        return;
    }
    db.CellLinePackage.create(reqBody).then(function (result) {
        const packageId = result.id;
        const recordsToCreate = [];
        let curr;
        for (let i = 0; i < reqBody.dataToAdd.length; i++) {
            curr = reqBody.dataToAdd[i];
            curr.cellLinePackageId = packageId;
            recordsToCreate.push(curr);
        }
        db.CellLinePurificationData.bulkCreate(recordsToCreate).then(resp => {
            res.status(200).json({ name: result.name, resp: resp });
        }, err => {
            res.status(403).json({ msg: 'Unable to create data entries', error: err });
            winston.error('createPurificationData Failed: ', err);
        });
    }, function (rejectedPromiseError) {
        winston.error('createPackage Failed: ', rejectedPromiseError);
        if (rejectedPromiseError.name === 'SequelizeForeignKeyConstraintError') {
            res.status(403).json({ error: rejectedPromiseError.index + ' value out of range' });
            return;
        }
        res.status(500).json({ error: rejectedPromiseError });
    });
}

function updateCLPackage (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when updateCLPackage' });
        return;
    }
    const reqBody = req.body;
    db.CellLinePackage.update(reqBody, { where: { id: reqBody.id } }).then(function (CLPackage) {
        for (let i = 0; i < reqBody.dataToAdd.length; i++) {
            let curr = reqBody.dataToAdd[i];
            curr.updatedBy = reqBody.updatedBy;
            // Update condition
            if (curr.id) {
                db.CellLinePurificationData.update(curr, { where: { id: curr.id } });
                // Create condition
            } else {
                curr.cellLinePackageId = reqBody.id;
                db.CellLinePurificationData.create(curr, { where: { id: curr.id } });
            }
        }
        res.status(200).json({ message: 'updated', data: CLPackage });
    }, function (err) {
        winston.error('updatePackage Failed: ', err);
        res.status(500).json({ message: 'error in update', error: err });
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
    if (colNames.getProteins && colNames.expType) {
        db.Protein.findAll({
            where: { isDeleted: false },
            attributes: ['id', 'name'],
            include: [{
                model: db.StableCellLine,
                where: { isDeleted: false },
                attributes: [],
                include: [{
                    model: db.CellLineExperiment,
                    attributes: [],
                    where: {
                        isDeleted: false,
                        experimentType: colNames.expType
                    }
                }]
            }]
        }).then(function (result) {
            res.json(result);
        });
    } else if (colNames.getCLExp && colNames.proteinId && colNames.expType) {
        db.CLDHarvest.findAll({
            where: {
                isDeleted: false
            },
            attributes: ['id', 'wellName',
                [db.Sequelize.literal("CONCAT_WS(' - ', `CLDHarvest`.wellName, `experiment`.name, `experiment->StableCellLine`.name, Date(`experiment`.inoculationDate))"), 'name']
            ],
            include: [{
                model: db.CellLineExperiment,
                as: 'experiment',
                where: { experimentType: colNames.expType },
                attributes: [],
                include: [{
                    model: db.StableCellLine,
                    where: { isDeleted: false },
                    attributes: [],
                    include: [{
                        model: db.Protein,
                        where: { id: colNames.proteinId },
                        attributes: []
                    }]
                }]
            }]
        }).then(result => {
            res.json(result);
        });
    } else {
        for (const i in colNames) {
            if (colNames[i] != null) {
                criteria.where[i] = colNames[i];
            }
        }

        db.CellLinePackage.findAll(criteria).then(function (CLPackage) {
            res.json(CLPackage);
        }, function (rejectedPromiseError) {
            res.status(500).json({ error: rejectedPromiseError });
        });
    }
}

module.exports = router;
