'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const common = require('../common');

const model = 'PayPeriods';

const getListCriteria = {
    where: { isDeleted: false },
    attributes: {
        include: [
             `name`, 'endDate', 'available', `IsDeleted`
        ]
    }
};

const getMappingAttrs = ['id', 'name', 'endDate', 'available'];

router.post('/get', common.getEntry(model));
router.post('/create', common.createEntry(model));
router.post('/update', common.updateEntry(model));
router.get('/getlist', common.getList(model, 'PayPeriods', getListCriteria));
// router.get('/getmapping', common.getNameMapping(model));
router.get('/getmapping', common.getNameMapping(model, getMappingAttrs));

module.exports = router;
