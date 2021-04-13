'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const common = require('../common');

const model = 'CellLinePurification';

const getListCriteria = {
    where: { isDeleted: false },
    attributes: {
        include: [
            // [db.Sequelize.literal('`CLDHarvest->experiment`.experimentType'), 'experimentType'],
            [db.Sequelize.literal('`CLDHarvest`.wellName'), 'wellName'],
            [db.Sequelize.literal('`CLDHarvest`.FedbatchID'), 'FedbatchID'],
            [db.Sequelize.literal('`CLDHarvest->experiment->minipool`.wellName'), 'minipool'],
            [db.Sequelize.literal('`CLDHarvest`.titer'), 'titer'],
            [db.Sequelize.literal('`CLDHarvest->experiment->StableCellLine`.name'), 'stableCellLine'],
            [db.Sequelize.literal('`CLDHarvest->experiment->StableCellLine->Protein`.name'), 'protein']
        ]
    },
    include: [{
        model: db.CLDHarvest,
        attributes: [],
        include: [{
            model: db.CellLineExperiment,
            as: 'experiment',
            attributes: [],
            include: [
                {
                    model: db.StableCellLine,
                    attributes: [],
                    include: [{
                        model: db.Protein,
                        attributes: []
                    }]
                },
                {
                    model: db.CLDHarvest,
                    as: 'minipool',
                    attributes: []
                }
            ]
        }]
    }],
    group: 'id'
};

const getCriteria = {
    // attributes: {
    //     include: [
    //         [db.Sequelize.literal('`CellLinePurificationData->CLDHarvest->experiment`.experimentType'), 'experimentType'],
    //         [db.Sequelize.literal('`CellLinePurificationData->CLDHarvest->experiment->StableCellLine`.name'), 'stableCellLine'],
    //         [db.Sequelize.literal('`CellLinePurificationData->CLDHarvest->experiment->StableCellLine`.id'), 'stableCellLineId'],
    //         [db.Sequelize.literal('`CellLinePurificationData->CLDHarvest->experiment->minipool`.wellName'), 'minipool'],
    //         [db.Sequelize.literal('`CellLinePurificationData->CLDHarvest->experiment->minipool`.id'), 'minipoolId'],
    //         [db.Sequelize.literal('`CellLinePurificationData->CLDHarvest->experiment->StableCellLine->Protein`.name'), 'protein'],
    //         [db.Sequelize.literal('`CellLinePurificationData->CLDHarvest->experiment->StableCellLine->Protein`.id'), 'proteinId'],
    //         [db.Sequelize.literal('`CellLinePurificationData->CLDHarvest->experiment->StableCellLine->Protein->Project`.name'), 'project'],
    //         [db.Sequelize.literal('`CellLinePurificationData->CLDHarvest->experiment->StableCellLine->Protein->Project`.id'), 'projectId']
    //     ]
    // },
    include: [{
        model: db.CLDHarvest,
        attributes: ['id', 'wellName', 'FedbatchID', 'titer', 'harvestDayVCD', 'harvestDayViability', 'ENUM_titerMethod', 'harvestDate'],
        include: [{
            model: db.CellLineExperiment,
            as: 'experiment',
            attributes: ['name', 'id', 'experimentType'],
            include: [
                {
                    model: db.StableCellLine,
                    attributes: ['id', 'name'],
                    include: [{
                        model: db.Protein,
                        attributes: ['id', 'name'],
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
};

const getMappingAttrs = ['id',
    [db.Sequelize.literal('CONCAT_WS(" - ", `CellLinePurification`.name, `CLDHarvest->experiment`.experimentType, `CLDHarvest`.`wellName`, `CLDHarvest`.`FedbatchID`, `CLDHarvest->experiment->StableCellLine`.name, `CLDHarvest->experiment->StableCellLine->Protein`.name)'), 'name']
];
const getMappingInclude = {
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
};

router.post('/get', common.getEntry(model, getCriteria));
router.post('/create', common.createEntry(model, 'CLP'));
router.post('/update', updatePurification);
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'cellLinePurifications', getListCriteria));
router.get('/getmapping', common.getNameMapping(model, getMappingAttrs, getMappingInclude));
router.post('/searchByColumn', searchByColumn);

// function createPurification (req, res) {
//     if (!req.body) {
//         res.status(400).json({ error: 'Empty payload when createCLPurification' });
//         return;
//     }
//     const reqBody = req.body;
//     reqBody.createdBy = reqBody.userId;
//     reqBody.updatedBy = reqBody.userId;

//     if (!reqBody.dataToAdd) {
//         res.status(400).json({ error: 'Empty raw data payload when createCLPackage' });
//         return;
//     }
//     db.CellLinePurification.create(reqBody).then(function (result) {
//         const dataTypes = ['ColumnPurificationData', 'AcidTreatmentData'];
//         for (let i = 0; i < dataTypes.length; i++) {
//             const dataToAdd = reqBody[dataTypes[i]].map(o => {
//                 o.updatedBy = reqBody.updatedBy;
//                 o.createdBy = reqBody.updatedBy;
//                 o.cellLinePurificationId = result.id;
//                 return o;
//             });
//             db[dataTypes[i]].bulkCreate(dataToAdd);
//         }
//         const nameToUpdate = {
//             name: 'CLP' + result.id
//         };
//         result.name = nameToUpdate.name;
//         db.CellLinePurification.update(nameToUpdate, { where: { id: result.id } }).then(function (updateResult) {
//             res.status(200).json(result);
//         }, function (rejectedPromiseError) { // Fail to update.
//             res.status(500).json({ error: rejectedPromiseError });
//             winston.error('update after create Failed: ', rejectedPromiseError);
//         });
//     }, function (rejectedPromiseError) {
//         winston.error('createPackage Failed: ', rejectedPromiseError);
//         if (rejectedPromiseError.name === 'SequelizeForeignKeyConstraintError') {
//             res.status(403).json({ error: rejectedPromiseError.index + ' value out of range' });
//             return;
//         }
//         res.status(500).json({ error: rejectedPromiseError });
//     });
// }

function updatePurification (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when update CellLinePurification' });
        return;
    }
    const reqBody = req.body;

    db.CellLinePurification.update(reqBody, { where: { id: reqBody.id } }).then(function () {
        // Loop through associated data tables
        const dataTypes = ['ColumnPurificationData', 'AcidTreatmentData'];
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
                        currEntry.cellLinePurificationId = reqBody.id;
                        currEntry.createdBy = reqBody.updatedBy;
                        db[dataTypes[i]].create(currEntry);
                    }
                }
            }
        }
        res.status(200).json({ message: 'updated' });
    }, function (err) {
        winston.error('updateCLP Failed: ', err);
        res.status(500).json({ error: err });
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
            attributes: ['id', 'wellName', 'FedbatchID',
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
