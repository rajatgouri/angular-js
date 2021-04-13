'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const common = require('../common');

const model = 'BioreactorChemData';

const getListCriteria = {
    where: { isDeleted: false },
    attributes: {
        include: [
            [db.Sequelize.literal('TIMESTAMPDIFF(SECOND, `Bioreactor.BioreactorExperiment`.inoculationDate, sampleTime)/60/60'), 'hour'],
            [db.Sequelize.literal('(select `hour`/24)'), 'day']
        ]
    },
    include: [{
        model: db.Bioreactor,
        attributes: [],
        include: [{
            model: db.BioreactorExperiment,
            attributes: []
        }]
    }],
    raw: true
};

router.post('/create', common.createEntry(model));
router.post('/get', common.getEntry(model));
router.post('/update', common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'bioreactorChemData', getListCriteria));
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
            criteria.where = { '$Bioreactor.BioreactorExperiment.id$': colNames[i], isDeleted: false };
        } else if (colNames[i] != null) {
            criteria.where[i] = colNames[i];
        }
    }

    db.BioreactorChemData.findAll(criteria).then(function (BioreactorChemData) {
        res.json(BioreactorChemData);
    }, function (rejectedPromiseError) {
        res.status(500).json({ error: rejectedPromiseError });
        winston.error('searchByColumn Failed: ', rejectedPromiseError);
    });
}

module.exports = router;
