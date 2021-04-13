'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const common = require('../common');

const model = 'CellLineExperiment';

const getListCriteria = {
    where: { isDeleted: false },
    include: [
        {
            model: db.StableCellLine,
            attributes: [],
            include: [{
                model: db.Protein,
                attributes: ['id', 'name', 'ENUM_moleculeType',
                    [db.Sequelize.literal('ROUND(((`StableCellLine->Protein`.molarExtCoefficient / `StableCellLine->Protein`.molecularWeight) * 10), 2)'), 'nanoDrop']
                ],
                include: [{
                    model: db.Project,
                    attributes: ['name']
                }]
            }]
        }, {
            model: db.CLDHarvest,
            attributes: ['wellName'],
            as: 'minipool'
        }
    ],
    raw: true
};

router.post('/get', common.getEntry(model));
router.post('/create', common.createEntry(model, 'CLE'));
router.post('/update', common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'cellLineExperiments', getListCriteria));
router.get('/getmapping', common.getNameMapping(model));

module.exports = router;
