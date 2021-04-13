/*
** This file is the route for the data_service model for all parts of Accounting
**      to the User Interface.
**
*/

'use strict';

const express = require('express');
const router = express.Router();
const common = require('../common');
const winston = require(global.__base + 'config/winston');
const db = require(global.__base + 'config/sequelize');

const model = 'TimePerProject';


const getListCriteria = {
    where: { isDeleted: false },
    attributes: {
        include: [
            'TimeCat', `ProjectID`, `PayPeriodID`, `TimeSpent`, `PercentTime`, `Notes`, `isDeleted`
        ]
    }
};

router.post('/get', common.getEntry(model));
router.post('/create', create);
router.post('/update', common.updateEntry(model));
router.get('/getlist', common.getList(model, 'TimePerProject', getListCriteria));
router.get('/getmapping', common.getNameMapping(model));

function create (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when createTimePerProject' });
        return;
    }
    const reqBody = req.body;
    reqBody.createdBy = reqBody.userId;
    //reqBody.updatedBy = reqBody.userId;

    db.TimePerProject.create(reqBody).then(function (result) {
        res.status(200).json(result);
    }, function (rejectedPromiseError) {
        winston.error('createCircuit Failed: ', rejectedPromiseError);
        if (rejectedPromiseError.name === 'SequelizeForeignKeyConstraintError') {
            res.status(403).json({ error: rejectedPromiseError.index + ' value out of range' });
            return;
        }
        res.status(500).json({ error: 'createCircuit Failed. Please check db' });
    });
};

module.exports = router;
