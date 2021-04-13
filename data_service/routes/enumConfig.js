'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');

router.getEnumConfigForManyTable = function () {
    return function (req, res) {
        const reqBody = req.body;
        const criteria = {};

        if (reqBody.tableNameArray) {
            criteria.where = { tableName: reqBody.tableNameArray };
        }

        db.EnumConfig.findAll(criteria).then(function (enumConfigs) {
            if (!enumConfigs) {
                res.status(400).json({ error: 'Table names not found' });
            } else {
                const mergedEnums = {};
                for (let i = 0; i < enumConfigs.length; i++) {
                    const props = JSON.parse(enumConfigs[i].properties);
                    for (const key in props) {
                        if (props.hasOwnProperty(key)) {
                            mergedEnums[key] = props[key];
                        }
                    }
                }
                res.status(200).json(mergedEnums);
            }
        }, function (rejectedPromiseError) {
            winston.error('searchByProject Failed: ', rejectedPromiseError);
            res.status(500).json({ error: 'getEnumConfigForManyTable Failed. Please check db' });
        });
    };
};

router.updateEnumConfig = function () {
    return function (req, res) {
        const reqBody = req.body;
        db.EnumConfig.find({ where: { tableName: reqBody.tableName } }).then(function (enumConfig) {
            if (!enumConfig) {
                // By default, create new table entry.
                if (reqBody.createTableEntryIfNotExist !== 'no') {
                    const enumConfigToCreate = {
                        tableName: reqBody.tableName
                    };
                    const propertiesToCreate = {};
                    propertiesToCreate[reqBody.key] = JSON.parse(reqBody.value);
                    enumConfigToCreate['properties'] = JSON.stringify(propertiesToCreate);
                    db.EnumConfig.create(enumConfigToCreate).then(function (result) {
                        res.status(200).json({ message: 'ok' });
                    }, function (rejectedPromiseError) {
                        winston.error('searchByProject Failed: ', rejectedPromiseError);
                        res.status(500).json({ error: 'updatenum unable to new enum with table entry. Please check db' });
                    });
                } else {
                    res.status(400).json({ error: 'Table name not found' });
                    return;
                }
                return;
            }
            let createKeyIfNotExist = reqBody.createKeyIfNotExist;
            const props = JSON.parse(enumConfig.properties);
            const key = reqBody.key;
            if (!createKeyIfNotExist) {
                if (!props.hasOwnProperty(key)) {
                    res.status(400).json({ error: 'No such enum key' });
                    return;
                }
            }

            props[key] = JSON.parse(reqBody.value);
            const newEnumConfig = {
                tableName: reqBody.tableName,
                properties: JSON.stringify(props)
            };
            db.EnumConfig.update(newEnumConfig, { where: { tableName: reqBody.tableName } }).then(function (result) {
                res.status(200).json({ message: 'ok' });
            }, function (rejectedPromiseError) { // Fail to update.
                winston.error('update enum Failed: ', rejectedPromiseError);
                res.status(500).json({ error: 'Data: Update fail.. Please check db' });
            });
        }, function (rejectedPromiseError) {
            winston.error('find failed Failed: ', rejectedPromiseError);
            res.status(500).json({ error: 'Find Failed. Please check db' });
        });
    };
};

module.exports = router;
