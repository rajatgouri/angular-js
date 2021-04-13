'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const common = require('../common');

const model = 'FreezerProLog';

const getListCriteria = {
    where: { isDeleted: false },
    attributes: {
        include: [
            `User`, 'Date', 'Time', `Object`, `ArchiveRecord`, `Comment`, `isDeleted`
        ]
    }
};

router.post('/get', common.getEntry(model));
router.post('/create', common.createEntry(model));
router.post('/update', common.updateEntry(model));
router.get('/getlist', common.getList(model, 'FreezerProLog', getListCriteria));
router.get('/getmapping', common.getNameMapping(model));

module.exports = router;