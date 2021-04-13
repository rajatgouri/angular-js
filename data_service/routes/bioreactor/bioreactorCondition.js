'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const common = require('../common');

const model = 'BioreactorCondition';

const getListCriteria = {
    where: { isDeleted: false },
    group: 'id',
    include: [{
        model: db.Bioreactor,
        attributes: [
            [db.Sequelize.fn('GROUP_CONCAT', db.Sequelize.literal("`Bioreactors`.name SEPARATOR ', '")), 'name']
        ]
    }],
    raw: true
};

router.post('/get', common.getEntry(model));
router.post('/create', common.createEntry(model, 'BC'));
router.post('/update', common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'bioreactorConditions', getListCriteria));
router.get('/getmapping', common.getNameMapping(model));

module.exports = router;
