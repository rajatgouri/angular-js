'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const common = require('../common');

const model = 'PlasmidLot';

const getListCriteria = {
    where: { isDeleted: false },
    attributes: {
        include: [[db.Sequelize.col('`Plasmid`.name'), 'plasmid']]
    },
    include: [{
        model: db.Plasmid,
        attributes: []
    }]
};

router.post('/get', common.getEntry(model));
router.get('/getlist', common.getList(model, 'plasmidLots', getListCriteria));
router.post('/create', common.createEntry(model));
router.post('/update', common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getmapping', common.getNameMapping(model));

module.exports = router;
