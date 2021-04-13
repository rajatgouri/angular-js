'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const common = require('../common');

const model = 'ProteinAnalysisMapping';

router.post('/get', getOne);
router.post('/create', common.createEntry(model));
router.post('/delete', deleteEntry);

function getOne (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when createProteinAnalysisPairs' });
        return;
    }
    const result = {
        tableName: 'proteinAnalysisPairs'
    };
    db.ProteinAnalysisMapping.findAll({ where: { requestId: req.body.id } }).then(function (pairs) {
        result.data = pairs || null;
        res.json(result);
    }, function (rejectedPromiseError) {
        winston.error('getOne Failed: ', rejectedPromiseError);
        res.status(500).json({ error: rejectedPromiseError });
    });
}

function deleteEntry (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when deleteTransfectionHarvest' });
        return;
    }
    const reqBody = req.body;

    if (!reqBody.requestId || !reqBody.analysisId) {
        res.status(400).json({ error: 'missing requestId or analysisId when deleteProteinAnalysisMapping' });
        return;
    }

    db.ProteinAnalysisMapping.destroy({
        where: {
            requestId: reqBody.requestId,
            analysisId: reqBody.analysisId
        }
    }).then(function (result) {
        res.status(200).json({ message: 'deleted', data: result });
    }, function (err) {
        winston.error('deleteProteinAnalysisMapping Failed: ', err);
        res.status(500).json('deleteProteinAnalysisMapping: delete failed');
    });
}

module.exports = router;
