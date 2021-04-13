'use strict';

const express = require('express');
const url = require('url');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const common = require('../common');

const model = 'MixCondition';

router.post('/get', getMixCondition);
router.post('/create', common.createEntry(model, 'MC'));
router.post('/update', common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', getMixConditionList);
router.get('/getmapping', common.getNameMapping(model));
router.post('/searchByColumn', searchByColumn);

function getMixConditionList (req, res) {
    const result = {
        tableName: 'mixCondition'
    };

    const option = {
        isDeleted: false
    };
    const queryObject = url.parse(req.url, true).query;
    const activationId = queryObject.activationId;
    if (activationId) {
        option.activationId = activationId;
    }

    db.MixCondition.findAll({ where: option }).then(function (MixCondition) {
        result.records = MixCondition;
        db.EnumConfig.find({ where: { tableName: 'mixConditions' } }).then(function (enumConfig) {
            result.enums = enumConfig ? enumConfig.properties : null;
            res.json(result);
        }, function (rejectedPromiseError) {
            res.status(500).json({ error: 'getEnumConfig Failed. Please check db' });
            winston.error('getEnumConfig Failed: ', rejectedPromiseError);
        });
    }, function (rejectedPromiseError) {
        res.status(500).json({ error: 'getMixConditionList Failed. Please check db' });
        winston.error('getMixConditionList Failed: ', rejectedPromiseError);
    });
}

function getMixCondition (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when getMixCondition' });
        return;
    }
    const reqBody = req.body;

    if (!reqBody.id) {
        res.status(400).json({ error: 'Invalid MixCondition id when getMixCondition' });
        return;
    }

    db.MixCondition.findOne({ where: { id: reqBody.id } }).then(function (MixCondition) {
        const result = {};
        if (MixCondition) {
            let platesUsed = 0;
            db.Sort.findAll({ where: { mixConditionId: reqBody.id } }).then(function (Sort) {
                for (let i = 0; i < Sort.length; i++) {
                    platesUsed += Sort[i].numberOfPlates;
                }
                result.platesUsed = platesUsed;
                result.records = MixCondition;
                res.status(200).json(result);
            });
        } else {
            res.status(400).json({ error: 'no MixCondition id exists' });
        }
    }, function (err) {
        console.log('find err:', err);
        res.status(500).json({ error: 'get MixCondition failed. Find id error.' });
    });
}

function searchByColumn (req, res) {
    const result = {};
    const body = req.body;
    const colNames = body.columns;

    if (!colNames) {
        res.status(400).json({ error: 'Empty column name.' });
        return;
    }

    const criteria = {
        where: {
            isDeleted: false
        },
        attributes: [
            'id', 'name', 'feederConcentration', 'mlPerPlate', 'eL4B5well', 'notes', 'numberOfPlatesForMix', 'perOfTsn'
        ]
    };
    for (const i in colNames) {
        if (colNames[i] != null) {
            criteria.where[i] = colNames[i];
        }
    }

    db.MixCondition.findAll(criteria).then(function (MixCondition) {
        result.records = MixCondition;
        res.json(result);
    }, function (rejectedPromiseError) {
        res.status(500).json({ error: rejectedPromiseError });
        winston.error('searchbycolumn Failed: ', rejectedPromiseError);
    });
}

module.exports = router;
