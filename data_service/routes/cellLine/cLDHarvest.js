'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const common = require('../common');

const model = 'CLDHarvest';

const getListCriteria = {
    where: { isDeleted: false },
    include: [
        {
            model: db.CellLineExperiment,
            attributes: ['name', 'inoculationDate', 'experimentType', 'minipoolReference',
                [db.Sequelize.literal('datediff(`CLDHarvest`.harvestDate, `experiment`.inoculationDate)'), 'lengthOfCulture']
            ],
            as: 'experiment',
            include: [
                {
                    model: db.StableCellLine,
                    attributes: ['name'],
                    include: [{
                        model: db.Protein,
                        attributes: ['name']
                    }]
                },
                {
                    model: db.CLDHarvest,
                    attributes: ['wellName'],
                    as: 'minipool'
                }
            ]
        }
    ],
    raw: true
};

router.post('/get', common.getEntry(model));
router.post('/create', common.createEntry(model));
router.post('/update', common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'cellLineHarvests', getListCriteria));
router.get('/getmapping', getNameMapping);
router.post('/searchByProject', searchByProject);
router.post('/searchByColumn', searchByColumn);

function getNameMapping (req, res) {
    db.CLDHarvest.findAll({
        attributes: ['id', 'name', 'wellName', 'FedbatchID'],
        where: { isDeleted: false },
        include: [{
            model: db.CellLineExperiment,
            attributes: ['name'],
            as: 'experiment',
            include: [{
                model: db.StableCellLine,
                attributes: ['name']
            }]
        }],
        raw: true
    }).then(function (CLDHarvest) {
        res.status(200).json(CLDHarvest);
    }, function (rejectedPromiseError) {
        winston.error('update Failed: ', rejectedPromiseError);
        res.status(500).json({ error: 'getNameMapping Failed. Please check db' });
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
    for (const i in colNames) {
        if (i === 'stableCellLineId') {
            criteria.include = [{
                model: db.CellLineExperiment,
                attributes: [],
                as: 'experiment',
                include: [{
                    model: db.StableCellLine,
                    attributes: []
                }]
            }];
            criteria.attributes = ['id', 'wellName'];
            criteria.raw = true;
            if (colNames.type && colNames.type === 'all') {
                criteria.attributes = ['id', 'wellName',
                    [db.Sequelize.literal('`experiment`.experimentType'), 'experimentType']
                ];
                criteria.where = { '$experiment.StableCellLine.id$': colNames[i], isDeleted: false };
            } else {
                criteria.where = {
                    '$experiment.StableCellLine.id$': colNames[i],
                    '$experiment.experimentType$': 'Minipool',
                    isDeleted: false
                };
            }
        } else if (i === 'newPurification' && colNames[i]) {
            criteria.include = [
                {
                    model: db.CellLinePurification,
                    required: false
                }, {
                    model: db.CellLineExperiment,
                    as: 'experiment',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: db.CLDHarvest,
                            as: 'minipool',
                            attributes: ['id', 'wellName']
                        }, {
                            model: db.StableCellLine,
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ];
            criteria.attributes = ['id', 'wellName', 'harvestDate',
                [db.Sequelize.literal('CONCAT_WS(" - ", `CLDHarvest`.wellName, `experiment->StableCellLine`.name, DATE(`CLDHarvest`.harvestDate))'), 'name']
            ];
            criteria.where['$`CellLinePurification`.id$'] = null;
            criteria.where.approveForPurification = 'Yes';
        } else if (colNames[i] != null) {
            criteria.where[i] = colNames[i];
        }
    }

    db.CLDHarvest.findAll(criteria).then(function (CLDHarvest) {
        res.json(CLDHarvest);
    }, function (rejectedPromiseError) {
        winston.error('search Failed: ', rejectedPromiseError);
        res.status(500).json({ error: rejectedPromiseError });
    });
}

function searchByProject (req, res) {
    const body = req.body;

    const criteria = {
        where: {
            isDeleted: false
        },
        attributes: ['id', 'name', 'wellName', 'harvestDate',
            [db.Sequelize.col('`experiment`.experimentType'), 'experimentType'],
            [db.Sequelize.col('`experiment->minipool`.wellName'), 'minipoolReference'],
            [db.Sequelize.col('`experiment->StableCellLine`.name'), 'stableCellLine'],
            [db.Sequelize.col('`experiment->StableCellLine->Protein`.name'), 'protein'],
            [db.Sequelize.col('`CellLinePurification`.purificationDate'), 'purificationDate']
        ],
        group: 'id',
        include: [
            {
                model: db.CellLineExperiment,
                attributes: [],
                where: { isDeleted: false },
                as: 'experiment',
                include: [
                    {
                        model: db.StableCellLine,
                        attributes: [],
                        where: { isDeleted: false },
                        include: [{
                            model: db.Protein,
                            required: true,
                            attributes: [],
                            include: [{
                                model: db.Project,
                                attributes: [],
                                where: { id: body.projectId }
                            }]
                        }]
                    }, {
                        model: db.CLDHarvest,
                        attributes: [],
                        as: 'minipool'
                    }
                ]
            },
            {
                model: db.CellLinePurification,
                attributes: [],
                where: { isDeleted: false },
                required: false,
                include: [{
                    model: db.ColumnPurificationData,
                    attributes: [],
                    where: { isDeleted: false },
                    required: false
                }]
            }
        ]
    };

    db.CLDHarvest.findAll(criteria).then(function (CLDHarvest) {
        res.json(CLDHarvest);
    }, function (rejectedPromiseError) {
        winston.error('search Failed: ', rejectedPromiseError);
        res.status(500).json({ error: 'error' });
    });
}

module.exports = router;
