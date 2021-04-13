'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const common = require('../common');

const model = 'BindingData';

const getListCriteria = {
    attributes: {
        include: [
            [db.Sequelize.col('`ProteinPurification`.name'), 'purification']
        ]
    },
    where: { isDeleted: false },
    include: [{
        model: db.ProteinPurification
    }]
};

router.post('/create', common.createEntry(model));
router.post('/get', common.getEntry(model));
router.post('/update', common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'proteinBindingData', getListCriteria));
router.get('/getmapping', common.getNameMapping(model));

module.exports = router;
