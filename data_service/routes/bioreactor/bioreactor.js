'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const common = require('../common');

const model = 'Bioreactor';

const getListCriteria = {
    where: { isDeleted: false },
    include: [
        {
            model: db.BioreactorExperiment,
            attributes: [],
            include: [{
                model: db.StableCellLine,
                attributes: ['name'],
                include: [{
                    model: db.Protein,
                    attributes: [],
                    include: [{
                        model: db.Project,
                        attributes: ['name']
                    }]
                }]
            }]
        },
        {
            model: db.CLDHarvest,
            attributes: ['wellName']
        }
    ],
    raw: true
};

const getCriteria = {
    include: [
        {
            model: db.BioreactorCondition
        },
        {
            model: db.BioreactorPurification,
            attributes: ['id', 'name', 'purifiedBy'],
            include: [{
                model: db.BioreactorAnalytics,
                attributes: ['id'],
                where: {
                    isDeleted: false
                },
                required: false
            }],
            where: {
                isDeleted: false
            },
            required: false
        },
        {
            model: db.BioreactorExperiment
        },
        {
            model: db.BioreactorChemData,
            attributes: [
                [db.Sequelize.literal('ROUND(TIMESTAMPDIFF(SECOND, `BioreactorExperiment`.inoculationDate, `BioreactorChemData`.sampleTime)/60/60/24, 1)'), 'day'],
                'sampleTime', 'pH', 'pO2', 'pCO2', 'gln', 'glu', 'gluc', 'lac', 'NH4', 'k', 'osmolality', 'vesselTemp', 'spargingO2', 'pHTemp', 'pO2Temp', 'pCO2Temp', 'o2Saturation', 'cO2Saturation', 'hCO3'
            ],
            where: {
                isDeleted: false
            },
            required: false
        },
        {
            model: db.BioreactorVCDData,
            attributes: [
                [db.Sequelize.literal('ROUND(TIMESTAMPDIFF(SECOND, `BioreactorExperiment`.inoculationDate, `BioreactorVCDData`.sampleTime)/60/60/24, 1)'), 'day'],
                'sampleTime', 'totalDensity', 'viableDensity', 'viability', 'titer'
            ],
            where: {
                isDeleted: false
            },
            required: false
        }
    ]
};

router.post('/get', common.getEntry(model, getCriteria));
router.post('/create', common.createEntry(model, 'R'));
router.post('/update', common.updateEntry(model));
router.get('/getlist', common.getList(model, 'bioreactors', getListCriteria));
router.get('/getmapping', common.getNameMapping(model));
router.post('/searchByColumn', searchByColumn);

function searchByColumn (req, res) {
    const result = {};
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
    for (const i in colNames) {
        if (i === 'bioreactorExperimentId') {
            criteria.include = [
                {
                    model: db.BioreactorCondition,
                    attributes: {
                        include: [
                            [db.Sequelize.literal("CONCAT (`BioreactorCondition`.`tempShift1Hour`, ',',`BioreactorCondition`.`tempShift1Value`)"), 'tempShift1'],
                            [db.Sequelize.literal("CONCAT (`BioreactorCondition`.`tempShift2Hour`, ',',`BioreactorCondition`.`tempShift2Value`)"), 'tempShift2']
                        ]
                    }
                },
                {
                    model: db.CLDHarvest,
                    attributes: ['wellName']
                }
            ];
            criteria.where = {
                bioreactorExperimentId: colNames[i],
                isDeleted: false
            };
        } else if (colNames[i] != null && i !== 'conditions') {
            criteria.where[i] = colNames[i];
        }
    }
    db.Bioreactor.findAll(criteria).then(function (Bioreactor) {
        result.records = Bioreactor;
        const results = JSON.parse(JSON.stringify(Bioreactor));
        if (colNames.conditions) {
            const len = results.length;
            const conditions = {};
            for (let i = 0; i < len; i++) {
                const currBioreactor = results[i];
                for (const condition in currBioreactor.BioreactorCondition) {
                    if (i === 0) {
                        conditions[condition] = [{
                            data: currBioreactor.BioreactorCondition[condition],
                            colspan: 1
                        }];
                    } else if (conditions[condition][conditions[condition].length - 1].data !== currBioreactor.BioreactorCondition[condition]) {
                        conditions[condition].push({
                            data: currBioreactor.BioreactorCondition[condition],
                            colspan: 1
                        });
                    } else {
                        conditions[condition][conditions[condition].length - 1].colspan++;
                    }
                }
            }
            result.conditions = conditions;
        }
        res.json(result);
    }, function (rejectedPromiseError) {
        res.status(500).json({ error: rejectedPromiseError });
        winston.error('searchByColumn Failed: ', rejectedPromiseError);
    });
}

module.exports = router;
