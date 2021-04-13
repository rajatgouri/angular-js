'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');

router.createEquipment = function () {
    return function (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when createEquipment' });
            return;
        }
        const reqBody = req.body;
        reqBody.createdBy = reqBody.userId;
        reqBody.updatedBy = reqBody.userId;

        db.Equipment.create(reqBody).then(function (result) {
            res.status(200).json(result);
        }, function (rejectedPromiseError) {
            winston.error('createEquipment Failed: ', rejectedPromiseError);
            if (rejectedPromiseError.name === 'SequelizeForeignKeyConstraintError') {
                res.status(403).json({ error: rejectedPromiseError.index + ' value out of range' });
                return;
            }
            res.status(500).json({ error: 'createEquipment Failed. Please check db' });
        });
    };
};

router.updateEquipment = function () {
    return function (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when updateCircuit' });
            return;
        }
        const reqBody = req.body;
        db.Equipment.update(reqBody, { where: { id: reqBody.id } }).then(function (result) {
            res.status(200).json({ message: 'updated', data: result });
        }, function (err) {
            winston.error('updateEquipment Failed: ', err);
            res.status(500).json({ error: err });
        });
    };
};

router.getEquipmentList = function () {
    return function (req, res) {
        const result = {
            tableName: 'equipment'
        };

        db.Equipment.findAll({
            where: { isDeleted: false },
            attributes: {
                include: [
                    [db.Sequelize.literal('`Circuit`.name'), 'circuit'],
                    [db.Sequelize.literal('`Circuit`.location'), 'location']
                ]
            },
            include: [{
                model: db.Circuit,
                attributes: []
            }]
        }).then(function (Equipment) {
            result.records = Equipment;
            res.json(result);
        }, function (rejectedPromiseError) {
            winston.error('getEquipmentList Failed: ', rejectedPromiseError);
            res.status(500).json({ error: 'getEquipmentList Failed. Please check db' });
        });
    };
};

router.deleteEquipment = function () {
    return function (req, res) {
        if (!req.body || !req.body.id) {
            res.status(400).json({ error: 'Empty payload when deleteEquipment' });
            return;
        }
        const reqBody = req.body;

        db.Equipment.update({ isDeleted: true }, { where: { id: reqBody.id } }).then(function (result) {
            res.status(200).json({ message: 'deleted' });
        }, function (err) {
            winston.error('deleteEquipment Failed: ', err);
            res.status(500).json({ error: err });
        });
    };
};

router.getEquipment = function () {
    return function (req, res) {
        if (!req.body || !req.body.id) {
            res.status(400).json({ error: 'Empty payload when getEquipment' });
            return;
        }

        db.Equipment.findOne({ where: { id: req.body.id } }).then(function (Equipment) {
            if (Equipment) {
                res.status(200).json(Equipment);
            } else {
                res.status(400).json({ error: 'no Equipment id exists' });
            }
        }, function (err) {
            winston.error('getEquipment Failed: ', err);
            res.status(500).json({ error: 'get Equipment failed. Find id error.' });
        });
    };
};

router.createCircuit = function () {
    return function (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when createCircuit' });
            return;
        }
        const reqBody = req.body;
        reqBody.createdBy = reqBody.userId;
        reqBody.updatedBy = reqBody.userId;

        db.Circuit.create(reqBody).then(function (result) {
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
};

router.updateCircuit = function () {
    return function (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when updateCircuit' });
            return;
        }
        const reqBody = req.body;
        db.Circuit.update(reqBody, { where: { id: reqBody.id } }).then(function (result) {
            res.status(200).json({ message: 'updated' });
        }, function (err) {
            winston.error('updateCircuit Failed: ', err);
            res.status(500).json({ error: err });
        });
    };
};

router.getCircuitList = function () {
    return function (req, res) {
        const result = {
            tableName: 'circuit'
        };

        db.Circuit.findAll({
            where: { isDeleted: false },
            attributes: {
                include: [
                    [db.Sequelize.literal('Round(SUM(`Equipment`.usage), 2)'), 'peakUsage'],
                    [db.Sequelize.literal('Round(SUM(`Equipment`.usage)  / `Circuit`.capacity, 2) * 100'), 'peakLoad']
                ]
            },
            include: [{
                model: db.Equipment,
                attributes: []
            }],
            group: 'id'
        }).then(function (Circuit) {
            result.records = Circuit;
            res.json(result);
        }, function (rejectedPromiseError) {
            winston.error('getCircuitList Failed: ', rejectedPromiseError);
            res.status(500).json({ error: 'getCircuitList Failed. Please check db' });
        });
    };
};

router.deleteCircuit = function () {
    return function (req, res) {
        if (!req.body || !req.body.id) {
            res.status(400).json({ error: 'Empty payload when deleteCircuit' });
            return;
        }
        const reqBody = req.body;
        db.Circuit.update({ isDeleted: true }, { where: { id: reqBody.id } }).then(function (result) {
            res.status(200).json({ message: 'deleted' });
        }, function (err) {
            res.status(500).json({ error: err });
        });
    };
};

router.getCircuit = function () {
    return function (req, res) {
        if (!req.body || !req.body.id) {
            res.status(400).json({ error: 'Empty payload when getCircuit' });
            return;
        }

        db.Circuit.findOne({ where: { id: req.body.id } }).then(function (Circuit) {
            if (Circuit) {
                res.status(200).json(Circuit);
            } else {
                res.status(400).json({ error: 'no Circuit id exists' });
            }
        }, function (err) {
            console.log('find err:', err);
            res.status(500).json({ error: 'getCircuit failed. Find id error.' });
        });
    };
};

router.searchCircuit = function () {
    return function (req, res) {
        const body = req.body;
        const colNames = body.columns;

        if (!colNames) {
            res.status(400).json({ error: 'Empty column name.' });
            return;
        }

        const criteria = {
            where: {
                isDeleted: false
            },
            attributes: {
                include: [
                    [db.Sequelize.literal('Round(SUM(`Equipment`.usage), 2)'), 'peakUsage'],
                    [db.Sequelize.literal('Round(SUM(`Equipment`.usage)  / `Circuit`.capacity, 2) * 100'), 'peakLoad'],
                    [db.Sequelize.literal('GROUP_CONCAT(DISTINCT CONCAT(`Equipment`.name, " - ", `Equipment`.usage) Separator ";")'), 'equipment']
                ]
            },
            include: [{
                model: db.Equipment,
                attributes: []
            }],
            group: 'id'
        };
        for (const i in colNames) {
            if (colNames[i] != null) {
                criteria.where[i] = colNames[i];
            }
        }

        db.Circuit.findAll(criteria).then(function (Circuit) {
            res.json(Circuit);
        }, function (rejectedPromiseError) {
            res.status(500).json({ error: rejectedPromiseError });
        });
    };
};

module.exports = router;
