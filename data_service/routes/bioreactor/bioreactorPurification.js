'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const common = require('../common');

const model = 'BioreactorPurification';

const getListCriteria = {
    where: { isDeleted: false },
    attributes: {
        include: [
            [db.Sequelize.fn('GROUP_CONCAT', db.Sequelize.literal('DISTINCT `Bioreactors`.`name` SEPARATOR ", "')), 'bioreactors'],
            [db.Sequelize.fn('GROUP_CONCAT', db.Sequelize.literal('DISTINCT `Bioreactors->BioreactorExperiment->StableCellLine->Protein->Project`.`name` SEPARATOR ", "')), 'project'],
            [db.Sequelize.fn('GROUP_CONCAT', db.Sequelize.literal('DISTINCT `Bioreactors->BioreactorExperiment->StableCellLine->Protein->Project`.`id` SEPARATOR ", "')), 'projectId'],
            [db.Sequelize.fn('GROUP_CONCAT', db.Sequelize.literal('DISTINCT `Bioreactors->BioreactorExperiment`.`name` SEPARATOR ", "')), 'bioreactorExperiment'],
            [db.Sequelize.fn('GROUP_CONCAT', db.Sequelize.literal('DISTINCT `Bioreactors->BioreactorExperiment`.`id` SEPARATOR ", "')), 'bioreactorExperimentId']
        ]
    },
    include: [
        {
            model: db.Bioreactor,
            attributes: [],
            through: { attributes: [] },
            include: [{
                model: db.BioreactorExperiment,
                attributes: [],
                include: [{
                    model: db.StableCellLine,
                    attributes: [],
                    include: [{
                        model: db.Protein,
                        attributes: [],
                        include: [{
                            model: db.Project,
                            attributes: []
                        }]
                    }]
                }]
            }]
        },
        {
            model: db.AcidTreatmentData,
            attributes: ['id'],
            where: { isDeleted: false },
            required: false
        },
        {
            model: db.MembranePurificationData,
            attributes: ['id'],
            where: { isDeleted: false },
            required: false
        },
        {
            model: db.ColumnPurificationData,
            attributes: ['id'
                // [sequelize.fn('GROUP_CONCAT', sequelize.literal('ROUND(100 * (`ColumnPurificationData`.elutionVolume * `ColumnPurificationData`.elutionConcentration) / (`ColumnPurificationData`.loadVolume * `CLDHarvest`.titer), 2) SEPARATOR ", "')), 'yield']
            ],
            where: { isDeleted: false },
            required: false
        },
        {
            model: db.UFDFData,
            attributes: ['id'],
            where: { isDeleted: false },
            required: false
        }
    ],
    group: 'id',
    raw: false
};

const getCriteria = {
    include: [
        {
            model: db.Bioreactor,
            attributes: ['name', 'id', 'hcfTiter'],
            through: { attributes: [] },
            include: [
                {
                    model: db.BioreactorExperiment,
                    attributes: ['name', 'id'],
                    include: [{
                        model: db.StableCellLine,
                        attributes: ['name', 'id'],
                        include: [{
                            model: db.Protein,
                            attributes: ['name', 'id'],
                            include: [{
                                model: db.Project,
                                attributes: ['name', 'id']
                            }]
                        }]
                    }]
                }, {
                    model: db.CLDHarvest,
                    attributes: ['id', 'wellName']
                }
            ]
        },
        {
            model: db.ColumnPurificationData,
            attributes: {
                include: [
                    [db.Sequelize.literal('CASE ' +
                                    'WHEN columnType LIKE "ProA" Then (`ColumnPurificationData->Bioreactor`.hcfTiter / 1000) * `ColumnPurificationData`.loadVolume ' +
                                    'ELSE (`ColumnPurificationData`.loadConcentration) * `ColumnPurificationData`.loadVolume ' +
                                    'END'), 'loadMass'],
                    [db.Sequelize.literal('elutionVolume / columnVolume'), 'elutionVolumeCV'],
                    [db.Sequelize.literal('elutionVolume * elutionConcentration'), 'elutionMass'],
                    [db.Sequelize.literal('(Select `ColumnPurificationData.loadMass`) / columnVolume'), 'resinLoading'],
                    [db.Sequelize.literal('100 * (elutionVolume * elutionConcentration) / (Select `ColumnPurificationData.loadMass`)'), 'yield']
                ]
            },
            include: [{
                model: db.Bioreactor,
                attributes: ['hcfTiter']
            }],
            where: { isDeleted: false },
            required: false
        },
        {
            model: db.AcidTreatmentData,
            attributes: {
                include: [
                    [db.Sequelize.literal('sampleVolume * sampleConcentration'), 'sampleMass'],
                    [db.Sequelize.literal('acidAdded + sampleVolume'), 'acidVolume'],
                    [db.Sequelize.literal('(acidAdded + sampleVolume) * acidTreatmentConcentration'), 'acidMass'],
                    [db.Sequelize.literal('(sampleVolume * sampleConcentration) / ((acidAdded + sampleVolume) * acidTreatmentConcentration)'), 'acidRecovery'],
                    [db.Sequelize.literal('(acidAdded / sampleVolume) * 100'), 'spikedAcidVolume'],
                    [db.Sequelize.literal('spikedBaseVolume / sampleVolume * 100'), 'spikedBasePercent'],
                    [db.Sequelize.literal('pavinVol * pavinConcentration'), 'pavinMass'],
                    [db.Sequelize.literal('100 * (pavinVol * pavinConcentration) / (sampleVolume * sampleConcentration)'), 'yield']
                ]
            },
            where: { isDeleted: false },
            required: false
        },
        {
            model: db.MembranePurificationData,
            attributes: {
                include: [
                    [db.Sequelize.literal('`MembranePurificationData`.`loadConcentration` * `MembranePurificationData`.`loadVolume`'), 'loadMass'],
                    [db.Sequelize.literal('1000 * (`MembranePurificationData`.`loadConcentration` * `MembranePurificationData`.`loadVolume`) / 75'), 'loading'],
                    [db.Sequelize.literal('`MembranePurificationData`.`eluateConcentration` * `MembranePurificationData`.`eluateVolume`'), 'eluateMass'],
                    [db.Sequelize.literal('100 * (`MembranePurificationData`.`eluateConcentration` * `MembranePurificationData`.`eluateVolume`) / (`MembranePurificationData`.`loadConcentration` * `MembranePurificationData`.`loadVolume`)'), 'yield']
                ]
            },
            where: { isDeleted: false },
            required: false
        },
        {
            model: db.UFDFData,
            attributes: {
                include: [
                    [db.Sequelize.literal('`UFDFData`.`loadConcentration` * `UFDFData`.`loadVolume`'), 'loadMass'],
                    [db.Sequelize.literal('productConcentration * productVolume'), 'productMass'],
                    [db.Sequelize.literal('10000 * (`UFDFData`.`loadConcentration` * `UFDFData`.`loadVolume`) / `UFDFData`.`membraneSize`'), 'loading'],
                    [db.Sequelize.literal('100 * (productConcentration * productVolume) / (`UFDFData`.`loadConcentration` * `UFDFData`.`loadVolume`)'), 'yield']
                ]
            },
            where: { isDeleted: false },
            required: false
        },
        {
            model: db.BioreactorAnalytics,
            attributes: ['id', 'analysisDate'],
            where: { isDeleted: false },
            required: false
        }
    ]
};

const getMappingAttrs = ['id',
    [db.Sequelize.literal('CONCAT_WS(" - ", `BioreactorPurification`.name, GROUP_CONCAT(DISTINCT `Bioreactors`.`name` SEPARATOR ", "), GROUP_CONCAT(DISTINCT `Bioreactors->BioreactorExperiment->StableCellLine->Protein`.name SEPARATOR ", "))'), 'name']
];
const getMappingInclude = {
    model: db.Bioreactor,
    attributes: [],
    through: { attributes: [] },
    include: [{
        model: db.BioreactorExperiment,
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
router.post('/create', createBioreactorPurification);
router.post('/update', updateBioreactorPurification);
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'bioreactorPurifications', getListCriteria));
router.get('/getmapping', common.getNameMapping(model, getMappingAttrs, getMappingInclude, 'id'));

function createBioreactorPurification (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when createBioreactorPurification' });
        return;
    }
    const reqBody = req.body;
    reqBody.createdBy = reqBody.userId;
    reqBody.updatedBy = reqBody.userId;

    db.BioreactorPurification.create(reqBody).then(function (bioreactorPurification) {
        bioreactorPurification.addBioreactors(reqBody.bioreactors);
        // Loop through associated data tables
        const dataTypes = ['ColumnPurificationData', 'AcidTreatmentData', 'MembranePurificationData', 'UFDFData'];
        for (let i = 0; i < dataTypes.length; i++) {
            const dataToAdd = reqBody[dataTypes[i]].map(o => {
                o.updatedBy = reqBody.updatedBy;
                o.createdBy = reqBody.updatedBy;
                o.bioreactorPurificationId = bioreactorPurification.id;
                return o;
            });
            db[dataTypes[i]].bulkCreate(dataToAdd);
        }
        const nameToUpdate = {
            name: 'BP' + bioreactorPurification.id
        };
        bioreactorPurification.name = nameToUpdate.name;
        db.BioreactorPurification.update(nameToUpdate, { where: { id: bioreactorPurification.id } }).then(function (updateResult) {
            res.status(200).json(bioreactorPurification);
        }, function (rejectedPromiseError) { // Fail to update.
            res.status(500).json({ error: rejectedPromiseError });
            winston.error('update after create Failed: ', rejectedPromiseError);
        });
    }, function (rejectedPromiseError) {
        winston.error('searchByProject Failed: ', rejectedPromiseError);
        if (rejectedPromiseError.name === 'SequelizeForeignKeyConstraintError') {
            res.status(403).json({ error: rejectedPromiseError.index + ' value out of range' });
            return;
        }
        res.status(500).json({ error: 'create BioreactorPurification Failed. Please check db' });
    });
}

function updateBioreactorPurification (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when updateBioreactorPurification' });
        return;
    }
    const reqBody = req.body;

    db.BioreactorPurification.update(reqBody, { where: { id: reqBody.id } }).then(function () {
        // Loop through associated data tables
        const dataTypes = ['ColumnPurificationData', 'AcidTreatmentData', 'MembranePurificationData', 'UFDFData'];
        for (let i = 0; i < dataTypes.length; i++) {
            for (let j = 0; j < reqBody[dataTypes[i]].length; j++) {
                const currEntry = reqBody[dataTypes[i]][j];
                currEntry.updatedBy = reqBody.updatedBy;
                // Update condition
                if (currEntry.id) {
                    db[dataTypes[i]].update(currEntry, { where: { id: currEntry.id } });
                    // New entry to create
                } else {
                    currEntry.bioreactorPurificationId = reqBody.id;
                    currEntry.createdBy = reqBody.updatedBy;
                    db[dataTypes[i]].create(currEntry);
                }
            }
        }
        res.status(200).json({ message: 'updated' });
    }, function (err) {
        winston.error('updateBioreactor Failed: ', err);
        res.status(500).json({ error: err });
    });
}

module.exports = router;
