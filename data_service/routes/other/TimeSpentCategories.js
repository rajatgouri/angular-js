/*
** This file is the route for the data_service model for all parts of Accounting
**      to the User Interface.
**
*/

'use strict';

const express = require('express');
const router = express.Router();
const common = require('../common');
const winston = require(global.__base + 'config/winston');
const db = require(global.__base + 'config/sequelize');


const model = 'TimeSpentCategories';


const getListCriteria = {
    where: { isDeleted: false },
    attributes: {
        include: [
             'name', 'isDeleted'
        ]
    }
};

const getMappingAttrs = ['id', 'name'];
router.post('/get', common.getEntry(model));
router.post('/create', common.createEntry(model));
router.post('/update', common.updateEntry(model));
router.get('/getlist', common.getList(model, 'TimeSpentCategories', getListCriteria));
router.get('/getmapping', common.getNameMapping(model, getMappingAttrs));

module.exports = router;
