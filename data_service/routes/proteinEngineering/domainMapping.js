'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');

router.createDomainMapping = function () {
    return function (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when create domain mapping' });
            return;
        }
        const reqBody = req.body;

        db.DomainMapping.create(reqBody).then(() => {
            res.status(200).json({ 'msg': 'ok', 'name': reqBody.domain });
        }, function (rejectedPromiseError) {
            if (rejectedPromiseError.name === 'SequelizeForeignKeyConstraintError') {
                res.status(403).json({ error: rejectedPromiseError.index + ' value out of range' });
                return;
            }
            res.status(500).json({ error: rejectedPromiseError });
        });
    };
};
router.createAntigenClass = function () {
    return function (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when create domain mapping' });
            return;
        }
        const reqBody = req.body;

        db.AntigenClass.create(reqBody).then(() => {
            res.status(200).json({ 'msg': 'ok', 'name': reqBody.antigen });
        }, function (rejectedPromiseError) {
            if (rejectedPromiseError.name === 'SequelizeForeignKeyConstraintError') {
                res.status(403).json({ error: rejectedPromiseError.index + ' value out of range' });
                return;
            }
            res.status(500).json({ error: rejectedPromiseError });
        });
    };
};

router.getDomainMapping = function () {
    return function (req, res) {
        const domain = db.DomainMapping.findAll();
        const antigen = db.AntigenClass.findAll();

        Promise.all([domain, antigen]).then(function (result) {
            res.status(200).json({
                domainMappings: result[0],
                antigenClasses: result[1]
            });
        }, function (rejectedPromiseError) {
            res.status(500).json({ error: 'getDomainMapping Failed. Please check db' });
        });
    };
};

router.getAntigenClasses = function () {
    return function (req, res) {
        db.AntigenClass.findAll().then(function (result) {
            res.status(200).json(result);
        }, function (rejectedPromiseError) {
            res.status(500).json({ error: 'getAntigenClasses Failed. Please check db' });
        });
    };
};

router.deleteDomainMapping = function () {
    return function (req, res) {
        if (!req.body || !req.body.id) {
            res.status(400).json({ error: 'Empty payload when delete domain mapping' });
            return;
        }
        db.DomainMapping.destroy({ where: { domain: req.body.id } }).then(function (result) {
            res.status(200).json({ message: 'deleted' });
        }, function (err) {
            res.status(500).json({ error: err });
        });
    };
};

router.deleteAntigenClass = function () {
    return function (req, res) {
        if (!req.body || !req.body.id) {
            res.status(400).json({ error: 'Empty payload when delete antigen class' });
            return;
        }
        db.AntigenClass.destroy({ where: { antigen: req.body.id } }).then(function (result) {
            res.status(200).json({ message: 'deleted' });
        }, function (err) {
            res.status(500).json({ error: err });
        });
    };
};

module.exports = router;
