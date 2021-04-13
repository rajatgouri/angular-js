'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
// const winston = require(global.__base + 'config/winston');
const common = require('../common');

const model = 'PDAnalysisRequest';

const getCriteria = {

};

router.post('/get', common.getEntry(model, getCriteria));
router.post('/create', preCreate, common.createEntry(model));
router.post('/update', common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'pdAnalysisRequests'));
router.get('/getmapping', common.getNameMapping(model));
router.post('/searchByColumn', searchByColumn);

function preCreate (req, res, next) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when createPDAnlyticalRequest' });
        return;
    }
    req.body.requestedBy = req.body.userId;
    next();
}

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
        },
        attributes: [],
        include: [
            {
                model: db.CellLinePurification,
                attributes: ['id', 'name'],
                include: [{
                    model: db.CLDHarvest
                }]
            }, {
                model: db.BioreactorPurification,
                attributes: ['id', 'name']
            }
        ]
    };
    for (const i in colNames) {
        criteria.where[i] = colNames[i];
    }

    db.PDAnalysisRequest.findAll(criteria).then(function (result) {
        res.json(result);
    }, function (rejectedPromiseError) {
        res.status(500).json({ error: rejectedPromiseError });
    });
}

module.exports = router;
