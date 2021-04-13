'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const common = require('../common');

const model = 'BioreactorVCDDataImport';

const getListCriteria = {
    where: { isDeleted: false, isImported: false }
};

router.post('/update', common.updateEntry(model));
router.get('/getlist', common.getList(model, 'bioreactors', getListCriteria));
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
            isDeleted: false,
            isImported: false
        }
    };
    for (const i in colNames) {
        if (i === 'bioreactorExperimentId') {
            criteria.include = [{
                model: db.Bioreactor,
                attributes: [],
                include: [{
                    model: db.BioreactorExperiment,
                    attributes: []
                }]
            }];
            criteria.raw = true;
            criteria.where['$Bioreactor->BioreactorExperiment.id$'] = colNames[i];
        } else if (i === 'bioreactorId') {
            criteria.include = [{
                model: db.Bioreactor,
                attributes: []
            }];
            criteria.raw = true;
            criteria.where['$Bioreactor.id$'] = colNames[i];
            delete criteria.where.isDeleted;
            delete criteria.where.isImported;
        } else if (colNames[i] != null) {
            criteria.where[i] = colNames[i];
        }
    }

    db.BioreactorVCDDataImport.findAll(criteria).then(function (BioreactorVCDDataImport) {
        res.json(BioreactorVCDDataImport);
    }, function (rejectedPromiseError) {
        res.status(500).json({ error: rejectedPromiseError });
        winston.error('updateBioreactor Failed: ', rejectedPromiseError);
    });
}

module.exports = router;
