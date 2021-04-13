'use strict';

const express = require('express');
const router = express.Router();
const winston = require(global.__base + 'config/winston');
const db = require(global.__base + 'config/sequelize');
const common = require('./common');

const model = 'DataLog';

router.post('/create', common.createEntry(model));
router.get('/getlist', common.getList(model, 'datalogs'));
router.post('/searchByColumn', searchByColumn);

function searchByColumn (req, res) {
    const body = req.body;
    const colNames = body.columns;

    if (!colNames) {
        res.status(400).json({ error: 'Empty column name.' });
        return;
    }

    const criteria = {
        where: {},
        attributes: ['actionType', 'tableName', 'entryId', 'detail'],
        limit: 750,
        order: [['id', 'DESC']]
    };
    for (const i in colNames) {
        if (colNames[i] != null) {
            criteria.where[i] = colNames[i];
        }
    }

    db.DataLog.findAll(criteria).then(function (DataLog) {
        res.json(DataLog);
    }, function (rejectedPromiseError) {
        winston.error('search Failed: ', rejectedPromiseError);
        res.status(500).json({ error: rejectedPromiseError });
    });
}

module.exports = router;
