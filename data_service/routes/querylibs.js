'use strict';

const express = require('express');
const router = express.Router();
const winston = require(global.__base + 'config/winston');
const db = require(global.__base + 'config/sequelize');
const common = require('./common');

const model = 'queryLib';

router.post('/create', common.createEntry(model));
router.post('/update', updateQuery);
router.get('/getlist', common.getList(model, 'querylibs'));

function updateQuery (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when updateQuery' });
        return;
    }
    const reqBody = req.body;
    if (!reqBody.id) {
        res.status(400).json({ error: 'empty queryid when updateQuery' });
        return;
    }

    if (!reqBody.name || !reqBody.query) {
        res.status(400).json({ error: 'invalid name or query when updateQuery' });
        return;
    }

    db.queryLib.update({
        name: reqBody.name,
        query: reqBody.query,
        group: reqBody.group
    }, { where: { id: reqBody.id } }).then(function (query) {
        res.status(200).json({ message: 'update success!' });
    }, function (err) {
        winston.error('update Failed: ', err);
        res.status(500).json({ error: err.errors[0].message });
    });
}

module.exports = router;
