'use strict';

const express = require('express');
const router = express.Router();
const url = require('url');
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const common = require('../common');

const model = 'BCellSource';

router.post('/get', common.getEntry(model));
router.post('/create', common.createEntry(model, 'BCS'));
router.post('/update', common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', getBCellSourceList);
router.get('/getmapping', common.getNameMapping(model));

function getBCellSourceList (req, res) {
    const result = {
        tableName: 'bCellSources'
    };
    const option = {
        isDeleted: false
    };

    const queryObject = url.parse(req.url, true).query;
    const activationId = queryObject.activationId;
    if (activationId) {
        option.activationId = activationId;
    }

    db.BCellSource.findAll({ where: option }).then(function (BCellSource) {
        result.records = BCellSource;
        db.EnumConfig.find({ where: { tableName: result.tableName } }).then(function (enumConfig) {
            result.enums = enumConfig ? enumConfig.properties : null;
            res.json(result);
        }, function (rejectedPromiseError) {
            res.status(500).json({ error: 'getEnumConfig Failed. Please check db' });
            winston.error('getEnumConfig Failed: ', rejectedPromiseError);
        });
    }, function (rejectedPromiseError) {
        res.status(500).json({ error: 'getBCellSourceList Failed. Please check db' });
        winston.error('getBCellSourceList Failed: ', rejectedPromiseError);
    });
}

module.exports = router;
