'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const common = require('../common');

const model = 'SupernatentPlate';

const getListCriteria = {
    where: { isDeleted: false },
    include: [{
        model: db.BCCPlate,
        attributes: ['name'],
        include: [{
            model: db.Sort,
            attributes: ['name'],
            include: [{
                model: db.MixCondition,
                attributes: ['name'],
                include: [{
                    model: db.Activation,
                    attributes: ['name'],
                    include: [{
                        model: db.Project,
                        attributes: ['name']
                    }]
                }]
            }]
        }]
    }],
    raw: true
};

router.post('/get', common.getEntry(model));
router.post('/create', common.createEntry(model, 'SP'));
router.post('/update', common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'supernatentPlates', getListCriteria));
router.get('/getmapping', common.getNameMapping(model));

module.exports = router;
