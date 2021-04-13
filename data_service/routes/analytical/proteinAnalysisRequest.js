'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const asyncRequest = require('request');
const config = require(global.__base + 'config/config');
const common = require('../common');

const model = 'ProteinAnalysisRequest';

router.post('/get', common.getEntry(model));
router.post('/create', createProteinAnalysisRequest);
router.post('/update', common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'proteinanalysisrequests'));
router.get('/getmapping', common.getNameMapping(model));
router.post('/searchByColumn', searchByColumn);

function createProteinAnalysisRequest (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when createProteinAnalysisRequest' });
        return;
    }
    const reqBody = req.body;

    if (!reqBody.userId) {
        res.status(400).json({ error: 'invalid userId when createProteinAnalysisRequest' });
        return;
    }

    reqBody.requestorUserId = reqBody.userId;
    reqBody.status = 'Submitted';
    reqBody.concentrationOverride = reqBody.concentrationOverride || null;
    reqBody.notes = reqBody.notes || null;

    db.ProteinAnalysisRequest.create(reqBody).then(function (result) {
        const slackDetails = {
            type: 'PAR',
            id: result.id,
            purification: reqBody.proteinPurificationId,
            notes: reqBody.notes,
            methods: reqBody.methods
        };
        const postOptions = {
            method: 'post',
            body: slackDetails,
            json: true,
            url: config.slackUrl
        };
        asyncRequest(postOptions);

        const updatedRecord = {};
        updatedRecord.name = 'PAR' + result.id;
        updatedRecord.sampleSubmissionDate = result.createdAt;
        db.ProteinAnalysisRequest.update(updatedRecord, { where: { id: result.id } }).then(function (ProteinAnalysisRequest) {
            result.name = updatedRecord.name;
            result.sampleSubmissionDate = updatedRecord.sampleSubmissionDate;
            res.status(200).json(result);
        }, function (err) {
            winston.error('create par Failed: ', err);
            res.status(500).json({ error: 'create ProteinAnalysisRequest fail, check db.' });
        });
    }, function (rejectedPromiseError) {
        winston.error('create par Failed: ', rejectedPromiseError);
        if (rejectedPromiseError.name === 'SequelizeForeignKeyConstraintError') {
            res.status(403).json({ error: rejectedPromiseError.index + ' value out of range' });
            return;
        }
        res.status(500).json({ error: 'create ProteinAnalysisRequest Failed. Please check db' });
    });
}

function searchByColumn (req, res) {
    const body = req.body;
    const colNames = body.columns;

    if (!colNames) {
        res.status(400).json({ error: 'Empty column name.' });
        return;
    }

    const criteria = {};
    let methodSpecified = false;
    criteria.where = {};
    criteria.where.isDeleted = false;
    for (const i in colNames) {
        if (i === 'methods') {
            criteria.where[i] = { $like: '%' + colNames[i] + '%' };
            methodSpecified = true;
        }
        if (i === 'sampleSubmissionDate' && colNames[i]) {
            const date = new Date(colNames[i]);
            const date2 = new Date(colNames[i]);
            date2.setDate(date.getDate() + 1);
            criteria.where[i] = {
                $gt: date,
                $lt: date2
            };
        } else if (i === 'status') {
            criteria.where[i] = colNames[i];
            criteria.attributes = ['id', 'name', 'sampleSubmissionDate', 'methods'];
            criteria.include = [{
                model: db.ProteinPurification,
                attributes: ['id', 'name']
            }];
        } else if (colNames[i] != null) {
            criteria.where[i] = colNames[i];
        }
    }

    db.ProteinAnalysisRequest.findAll(criteria).then(function (proteinAnalysisRequests) {
        let result = [];
        if (colNames.export) {
            for (let i = 0; i < proteinAnalysisRequests.length; i++) {
                const currR = proteinAnalysisRequests[i];
                if (!methodSpecified) {
                    const methods = currR.methods.split(',');
                    for (let j = 0; j < methods.length; j++) {
                        const newR = JSON.parse(JSON.stringify(currR));
                        newR.methods = methods[j].trim();
                        result.push(newR);
                    }
                } else {
                    currR.methods = colNames.methods;
                    result.push(currR);
                }
            }
        } else {
            result = proteinAnalysisRequests;
        }
        res.json(result);
    }, function (rejectedPromiseError) {
        res.status(500).json({ error: rejectedPromiseError });
    });
}

module.exports = router;
