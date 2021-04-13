'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const common = require('../common');

const model = 'CTVessel';

const getListCriteria = {
    attributes: {
        include: [
            [db.Sequelize.literal('CONCAT(`CTVessel`.wellColumn, `CTVessel`.wellRow)'), 'well'],
            [db.Sequelize.col('`CTExperiment`.name'), 'experiment'],
            [db.Sequelize.col('`CTVesselType`.name'), 'vesselType']
        ]
    },
    include: [
        {
            model: db.CTExperiment,
            attributes: []
        }, {
            model: db.CTVesselType,
            attributes: []
        }
    ]
};

router.post('/get', common.getEntry(model));
router.post('/create', common.createEntry(model, 'V'));
router.post('/update', common.updateEntry(model));
router.get('/getlist', common.getList(model, 'ctVessels', getListCriteria));
router.get('/getmapping', common.getNameMapping(model));

module.exports = router;
