'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');

// Not used in the LIMS, used in case it is needed allows for manual queries to be ran
router.submitQuery = function () {
    return function (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when submitQuery' });
        }
        const reqBody = req.body;
        const q = reqBody.queryExpression;
        const re = new RegExp('\\b(update|delete|create|insert|drop|alter|truncate)\\b', 'i');
        if (re.test(q)) {
            res.status(400).json({ error: 'query not allowed' });
            return;
        }

        db.sequelize.query(reqBody.queryExpression).spread(function (results) {
            if (results) {
                res.status(200).json(results);
            } else {
                res.status(400).json({ error: 'No result found.' });
            }
        }, function (err) {
            res.status(500).json({ message: err.message });
        });
    };
};

router.getQuery = function () {
    return function (req, res) {
        if (!req.body.params && !req.params.id) {
            res.status(400).json({ error: 'Empty payload when getQuery' });
        }
        const queryId = req.params.id;

        db.queryLib.findOne({ where: { id: queryId } }).then(function (Query) {
            if (Query) {
                const query = Query.query;
                db.sequelize.query(query).spread(function (results) {
                    if (results) {
                        res.status(200).json(results);
                    } else {
                        res.status(400).json({ error: 'No result found.' });
                    }
                }, function (err) {
                    res.status(500).json({ message: err.message });
                });
            } else {
                res.status(400).json({ error: 'no Query with that id exists' });
            }
        }, function (err) {
            console.log('find err:', err);
            res.status(500).json({ error: 'get Query failed. Find id error.' });
        });
    };
};

module.exports = router;
