'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const common = require('../common');

const model = 'HumanizationPlasmid';

const getListCriteria = {
    where: { isDeleted: false },
    include: [{
        model: db.WellRescue,
        attributes: [],
        include: [{
            model: db.SupernatentPlate,
            attributes: [],
            include: [{
                model: db.BCCPlate,
                attributes: [],
                include: [{
                    model: db.Sort,
                    attributes: [],
                    include: [{
                        model: db.Activation,
                        attributes: [],
                        include: [{
                            model: db.Project,
                            attributes: ['name']
                        }]
                    }]
                }]
            }]
        }]
    }],
    raw: true
};

const getMappingAttrs = ['id', 'name', 'vhOrVl', 'wellRescueId'];

router.post('/get', common.getEntry(model));
router.post('/create', common.createEntry(model, 'HP'));
router.post('/update', common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'humanizationPlasmid', getListCriteria));
router.get('/getmapping', common.getNameMapping(model, getMappingAttrs));

module.exports = router;
