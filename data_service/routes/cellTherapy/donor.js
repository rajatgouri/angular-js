'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const common = require('../common');

const model = 'Donor';

const getListCriteria = {
    where: { isDeleted: false },
    attributes: {
        include: [
            [db.Sequelize.literal('`CellSource`.orderType'), 'orderType'],
            [db.Sequelize.literal('`CellSource`.vendor'), 'vendor'],
            [db.Sequelize.literal('`CellSource`.name'), 'sourceName']
        ]
    },
    include: [{
        model: db.CellSource,
        attributes: []
    }]
};

router.post('/get', common.getEntry(model));
router.post('/create', common.createEntry(model, 'D'));
router.post('/update', common.updateEntry(model));
router.get('/getlist', common.getList(model, 'donors', getListCriteria));
router.get('/getmapping', common.getNameMapping(model));

module.exports = router;
