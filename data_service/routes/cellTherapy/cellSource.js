'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const common = require('../common');

const model = 'CellSource';

const getListCriteria = {
    where: { isDeleted: false },
    attributes: {
        include: [
            [db.Sequelize.literal('COUNT(*)'), 'donorCount']
        ]
    },
    include: [{
        model: db.Donor,
        attributes: [],
        where: { isDeleted: false },
        required: false
    }],
    group: 'id'
};

const getCriteria = {
    include: [{
        model: db.Donor,
        // attributes: [],
        where: { isDeleted: false },
        required: false
    }]
};

router.post('/get', common.getEntry(model, getCriteria));
router.post('/create', common.createEntry(model, 'CS'));
router.post('/update', common.updateEntry(model));
router.get('/getlist', common.getList(model, 'cellSources', getListCriteria));
router.get('/getmapping', common.getNameMapping(model));

module.exports = router;
