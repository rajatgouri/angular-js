'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const common = require('../common');

const model = 'BioreactorExperiment';

const getListCriteria = {
    where: { isDeleted: false },
    group: 'id',
    include: [
        {
            model: db.StableCellLine,
            attributes: ['name'],
            include: [{
                model: db.Protein,
                attributes: [],
                include: [{
                    model: db.Project,
                    attributes: ['name']
                }]
            }]
        },
        {
            model: db.Bioreactor,
            attributes: [
                [db.Sequelize.fn('GROUP_CONCAT', db.Sequelize.literal("`Bioreactors`.name SEPARATOR ', '")), 'name']
            ]
        }
    ],
    raw: true
};

const getMappingAttrs = ['id', 'name', 'stableCellLineId'];

router.post('/get', common.getEntry(model));
router.post('/create', common.createEntry(model));
router.post('/update', common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'bioreactorExperiments', getListCriteria));
router.get('/getmapping', common.getNameMapping(model, getMappingAttrs));
router.post('/searchByProject', searchByProject);

function searchByProject (req, res) {
    const body = req.body;

    const criteria = {
        where: {
            isDeleted: false
        },
        attributes: ['id', 'name', 'description', 'inoculationDate',
            [db.Sequelize.col('`StableCellLine`.name'), 'stableCellLine'],
            [db.Sequelize.col('`StableCellLine->Protein`.name'), 'protein']
        ],
        group: 'id',
        include: [{
            model: db.StableCellLine,
            attributes: [],
            required: true,
            include: [{
                model: db.Protein,
                attributes: [],
                required: true,
                include: [{
                    model: db.Project,
                    attributes: [],
                    where: { id: body.projectId }
                }]
            }]
        }]
    };

    db.BioreactorExperiment.findAll(criteria).then(function (BioreactorExperiment) {
        res.json(BioreactorExperiment);
    }, function (rejectedPromiseError) {
        winston.error('searchByProject Failed: ', rejectedPromiseError);
        res.status(500).json({ error: rejectedPromiseError });
    });
}

module.exports = router;
