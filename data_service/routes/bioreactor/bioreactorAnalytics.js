'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const sequelize = require('sequelize');
const common = require('../common');

const model = 'BioreactorAnalytics';

const getListCriteria = {
    where: { isDeleted: false },
    attributes: {
        include: [
            [sequelize.col('`BioreactorPurification`.name'), 'name'],
            [sequelize.fn('GROUP_CONCAT', sequelize.literal('DISTINCT `BioreactorPurification->Bioreactors`.name SEPARATOR ", "')), 'bioreactors'],
            [sequelize.fn('GROUP_CONCAT', sequelize.literal('DISTINCT SECData.type SEPARATOR ", "')), 'SECtype'],
            [sequelize.fn('GROUP_CONCAT', sequelize.literal('DISTINCT SECData.mp SEPARATOR ", "')), 'SECmp'],
            [sequelize.fn('GROUP_CONCAT', sequelize.literal('DISTINCT SECData.hmw SEPARATOR ", "')), 'SEChmw'],
            [sequelize.literal('`BioreactorPurification->Bioreactors->CLDHarvest`.`wellName`'), 'clone'],
            [sequelize.literal('`BioreactorPurification->Bioreactors->CLDHarvest->experiment->StableCellLine->Protein->Project`.`name`'), 'project']
        ]
    },
    include: [
        {
            model: db.BioreactorPurification,
            attributes: [],
            include: [{
                model: db.Bioreactor,
                through: { attributes: [] },
                attributes: [],
                include: [{
                    model: db.CLDHarvest,
                    attributes: [],
                    include: [{
                        model: db.CellLineExperiment,
                        attributes: [],
                        as: 'experiment',
                        include: [{
                            model: db.StableCellLine,
                            attributes: [],
                            include: [{
                                model: db.Protein,
                                attributes: [],
                                include: [{
                                    model: db.Project,
                                    attributes: []
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        },
        {
            model: db.SECData,
            attributes: [],
            where: { isDeleted: false },
            required: false
        }
    ],
    group: 'id'
};

const getCriteria = {
    include: [{
        model: db.SECData,
        where: { isDeleted: false },
        required: false
    }]
};

router.post('/get', common.getEntry(model, getCriteria));
router.post('/create', createBioreactorAnalysis);
router.post('/update', updateBioreactorAnalysis);
router.get('/getlist', common.getList(model, 'bioreactorAnalytics', getListCriteria));
router.get('/getmapping', common.getNameMapping(model));
router.get('/delete', common.deleteEntry(model));

function createBioreactorAnalysis (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when createBioreactorAnalytics' });
        return;
    }
    const reqBody = req.body;
    reqBody.createdBy = reqBody.userId;
    reqBody.updatedBy = reqBody.userId;

    db.BioreactorAnalytics.create(reqBody).then(function (result) {
        if (reqBody.SECData) {
            for (let i = 0; i < reqBody.SECData.length; i++) {
                const currEntry = reqBody.SECData[i];
                currEntry.bioreactorAnalyticId = result.id;
                currEntry.createdBy = reqBody.createdBy;
                currEntry.updatedBy = reqBody.updatedBy;
                db.SECData.create(currEntry);
            }
        }
        res.status(200).json(result);
    }, function (rejectedPromiseError) {
        winston.error('create Failed: ', rejectedPromiseError);
        if (rejectedPromiseError.name === 'SequelizeForeignKeyConstraintError') {
            res.status(403).json({ error: rejectedPromiseError.index + ' value out of range' });
            return;
        }
        res.status(500).json({ error: 'create BioreactorAnalytics Failed. Please check db' });
    });
}

function updateBioreactorAnalysis (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when updateBioreactorAnalytics' });
        return;
    }
    const reqBody = req.body;

    db.BioreactorAnalytics.update(reqBody, { where: { id: reqBody.id } }).then(function () {
        if (reqBody.SECData) {
            for (let i = 0; i < reqBody.SECData.length; i++) {
                const currEntry = reqBody.SECData[i];
                currEntry.updatedBy = reqBody.updatedBy;
                if (currEntry.id) {
                    db.SECData.update(currEntry, { where: { id: currEntry.id } });
                    // New entry to create
                } else {
                    currEntry.bioreactorAnalyticId = reqBody.id;
                    currEntry.createdBy = reqBody.updatedBy;
                    db.SECData.create(currEntry);
                }
            }
        }
        res.status(200).json({ message: 'updated' });
    }, function (err) {
        winston.error('create Failed: ', err);
        res.status(500).json({ error: err });
    });
}

module.exports = router;
