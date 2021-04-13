'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const common = require('../common');

const model = 'Reservation';

router.post('/get', common.getEntry(model));
router.post('/create', common.createEntry(model));
router.post('/update', common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model));
router.post('/searchByColumn', searchByColumn);

function searchByColumn (req, res) {
    const body = req.body;
    const colNames = body.columns;

    if (!colNames) {
        res.status(400).json({ error: 'Empty column name.' });
        return;
    }
    const currDate = new Date();
    // only find entries that are not older than 45 days
    const dateOffset = currDate.setDate(currDate.getDate() - 45);
    const criteria = {
        where: {
            isDeleted: false,
            startDate: { [db.Sequelize.Op.gt]: dateOffset }
        },
        attributes: {
            include: [
                [db.Sequelize.col('`Instrument`.name'), 'instrument'],
                [db.Sequelize.col('`Instrument`.group'), 'instrumentGroup'],
                [db.Sequelize.literal('CONCAT(`Project`.name, " - ", `Project`.targets)'), 'project'],
                [db.Sequelize.col('`User`.department'), 'department']
            ]
        },
        include: [
            {
                model: db.Instrument,
                attributes: []
            }, {
                model: db.Project,
                attributes: []
            }, {
                model: db.User,
                attributes: []
            }
        ]
    };

    for (let i in colNames) {
        if (colNames[i] != null) {
            criteria.where[i] = colNames[i];
        }
    }

    db.Reservation.findAll(criteria).then(function (result) {
        res.json(result);
    }, function (rejectedPromiseError) {
        winston.error('searchByColumn Failed: ', rejectedPromiseError);
        res.status(500).json({ error: rejectedPromiseError });
    });
}

module.exports = router;
