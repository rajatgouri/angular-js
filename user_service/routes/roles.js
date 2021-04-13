'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');

router.getRoleList = function () {
    return function (req, res) {
        db.Role.findAll().then(function (roles) {
            res.json(roles);
        }).catch(function (err) {
            res.status(404).json({ error: err });
        });
    };
};

router.updateRole = function () {
    return function (req, res) {
        const reqBody = req.body;

        db.Role.find({ where: { id: reqBody.id } }).then(function (role) {
            if (!role) {
                res.status(404).json({ error: 'Role Not Found' });
            }
            db.Role.update(reqBody, { where: { id: reqBody.id } }).then(function (result) {
                res.status(200).json({ message: 'updated' });
            }, function (err) {
                res.status(500).json({ error: 'Update Role Failed. Please check db' });
            });
        }).catch(function (err) {
            console.log('err:', err);
            res.status(404).json({ error: 'Role Not Found' });
        });
    };
};

router.deleteRole = function () {
    return function (req, res) {
        const reqBody = req.body;

        db.Role.destroy({ where: { id: reqBody.id } }).then(function (result) {
            res.status(200).json({ message: 'deleted' });
        }, function (rejectedPromiseError) {
            res.status(500).json({ error: 'Delete Role Failed. Please check db' });
        });
    };
};

router.addAssociation = function () {
    return function (req, res) {
        const reqBody = req.body;

        db.User.findOne({ where: { id: reqBody.id } }).then(function (user) {
            user.addRole(reqBody.roleId).then(function (result) {
                res.status(200).json({ message: 'user updated' });
            });
        }, function (rejectedPromiseError) {
            res.status(500).json({ error: 'Add Role association failed. Please check db' });
        });
    };
};

router.removeAssociation = function () {
    return function (req, res) {
        const reqBody = req.body;

        db.User.findOne({ where: { id: reqBody.id } }).then(function (user) {
            user.removeRole(reqBody.roleId).then(function (result) {
                res.status(200).json({ message: 'user updated' });
            });
        }, function (rejectedPromiseError) {
            res.status(500).json({ error: 'Delete Role association failed. Please check db' });
        });
    };
};

router.createRole = function () {
    return function (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when create' });
            return;
        }
        const rb = req.body;

        db.Role.create(rb).then(function (result) {
            res.status(200).json(result);
        }, function (rejectedPromiseError) {
            res.status(500).json({ error: rejectedPromiseError });
        });
    };
};

module.exports = router;
