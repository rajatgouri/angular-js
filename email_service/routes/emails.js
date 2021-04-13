'use strict';

/**
 * Module dependencies.
 */
const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const _ = require('lodash');

router.getEmail = function () {
    return function (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when get user' });
            return;
        }
        const reqBody = req.body;

        if (!reqBody.id) {
            res.status(400).json({ error: 'invalid user id when get user' });
            return;
        }

        db.EmailTemplate.find({
            where: { id: reqBody.id },
            
        }).then(function (email) {
            if (!email) {
                res.status(404).json({ error: 'Email Not Found' });
                return;
            }
            const result = {
                email: email
            };
            res.json(result);

           
        }).catch(function (err) {
            winston.error('database error getEmail', err);
            res.status(404).json({ error: 'Database error when get Email, check sequelize/database' });
        });
    };
};

// For users
router.getCompleteEmailList = function () {
    return function (req, res) {
        db.EmailTemplate.findAll().then(function (template) {
            if (!template) {
                res.status(404).json({ error: 'Template Not Found' });
                return;
            }
            res.json({ templates: template });
        }).catch(function (err) {
            res.status(404).json({ error: 'Templates Not Found' });
        });
    };
};

module.exports = router;
