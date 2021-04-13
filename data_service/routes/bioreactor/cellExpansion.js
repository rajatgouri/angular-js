'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const common = require('../common');

const model = 'CellExpansion';

const getListCriteria = {
    where: { isDeleted: false },
    include: [{
        model: db.CLDHarvest,
        attributes: ['wellName'],
        include: [{
            model: db.CellLineExperiment,
            attributes: [],
            as: 'experiment',
            include: [
                {
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
                },
                {
                    model: db.CLDHarvest,
                    attributes: ['wellName'],
                    as: 'minipool'
                }
            ]
        }]
    }],
    raw: true
};

router.post('/get', common.getEntry(model));
router.post('/create', common.createEntry(model));
router.post('/update', common.updateEntry(model));
router.get('/getlist', common.getList(model, 'cellExpansions', getListCriteria));
router.get('/getmapping', common.getNameMapping(model));

module.exports = router;
