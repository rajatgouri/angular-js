'use strict';

const express = require('express');
const winston = require(global.__base + 'config/winston');
const db = require(global.__base + 'config/sequelize');
const router = express.Router();
const common = require('../common');

const getListCriteria = {
    order: [['createdAt', 'desc']]
};

router.post('/get', getData);
router.get('/getlist', common.getList('NanodropExperiment', 'nanodrop', getListCriteria));

function getData (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when getEntry' });
        return;
    }
    const reqBody = req.body;

    if (!reqBody.id) {
        res.status(400).json({ error: 'Invalid Activation id when getEntry' });
        return;
    }
    const criteria = {
        where: {
            id: reqBody.id
        }
    };
    db.NanodropExperiment.findOne(criteria).then(exp => {
        const experimentType = exp.applicationType;
        let query;
        if (experimentType === 'ProteinA280') {
            query = {
                where: {
                    experimentId: reqBody.id
                },
                attributes: [
                    'date', 'sampleName', 'sampleType',
                    [db.Sequelize.literal("MAX(IF(`NanodropData`.measurementType LIKE 'Protein A280', CONCAT_WS(' ', ROUND(`NanodropData`.measurementValue, 2), `NanodropData`.measurementUnit), NULL))"), 'proteinA280'],
                    [db.Sequelize.literal("MAX(IF(`NanodropData`.measurementType LIKE 'A260', CONCAT_WS(' ', ROUND(`NanodropData`.measurementValue, 2), `NanodropData`.measurementUnit), NULL))"), 'A260'],
                    [db.Sequelize.literal("MAX(IF(`NanodropData`.measurementType LIKE 'A280', CONCAT_WS(' ', ROUND(`NanodropData`.measurementValue, 2), `NanodropData`.measurementUnit), NULL))"), 'A280'],
                    [db.Sequelize.literal("MAX(IF(`NanodropData`.measurementType LIKE '260/280', CONCAT_WS(' ', ROUND(`NanodropData`.measurementValue, 2), `NanodropData`.measurementUnit), NULL))"), '260/280']
                ],
                group: 'sampleName',
                order: [['date', 'asc']]
            };
        } else {
            // Not implemented
            query = {
                where: {
                    experimentId: reqBody.id
                }
            };
        }

        db.NanodropData.findAll(query).then(function (result) {
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(400).json({ error: 'entry not found' });
            }
        }, function (err) {
            winston.error('getEntry Failed: ', err);
            res.status(500).json({ error: 'getEntry failed. Find id error.' });
        });
    });
}

module.exports = router;
