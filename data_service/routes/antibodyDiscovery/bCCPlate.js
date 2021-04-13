'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const common = require('../common');

const model = 'BCCPlate';

const getListCriteria = {
    where: { isDeleted: false },
    include: [{
        model: db.Sort,
        attributes: ['name'],
        include: [
            {
                model: db.MixCondition,
                attributes: ['name', 'ENUM_plateType'],
                include: [{
                    model: db.Activation,
                    attributes: ['name', 'projectId'],
                    include: [{
                        model: db.Project,
                        attributes: ['name']
                    }]
                }]
            },
            {
                model: db.BCellSource,
                attributes: ['name']
            }
        ]
    }],
    raw: true
};

router.post('/get', common.getEntry(model));
router.post('/create', common.createEntry(model, 'BP'));
router.post('/update', common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'bCCPlate', getListCriteria));
router.get('/getmapping', common.getNameMapping(model));
router.post('/searchByColumn', searchByColumn);

function searchByColumn (req, res) {
    const body = req.body;
    const colNames = body.columns;

    if (!colNames) {
        res.status(400).json({ error: 'Empty column name.' });
        return;
    }

    const criteria = {
        where: {
            isDeleted: false
        }
    };
    for (const i in colNames) {
        if (i === 'activationId') {
            criteria.include = [{
                model: db.Sort,
                attributes: ['name'],
                include: [{
                    model: db.Activation,
                    attributes: []
                }]
            }];
            criteria.where = { '$Sort.Activation.id$': colNames[i] };
        } else if (colNames[i] != null) {
            criteria.where[i] = colNames[i];
        }
    }

    db.BCCPlate.findAll(criteria).then(function (BCCPlate) {
        res.json(BCCPlate);
    }, function (rejectedPromiseError) {
        winston.error('search Failed: ', rejectedPromiseError);
        res.status(500).json({ error: rejectedPromiseError });
    });
}

module.exports = router;
