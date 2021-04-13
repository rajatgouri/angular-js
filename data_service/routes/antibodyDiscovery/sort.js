'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const common = require('../common');

const model = 'Sort';

router.post('/get', common.getEntry(model));
router.post('/create', createSort);
router.post('/update', common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'sorts'));
router.get('/getmapping', common.getNameMapping(model));
router.post('/searchByColumn', searchByColumn);

function createSort (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when createSort' });
        return;
    }
    const reqBody = req.body;
    if (!reqBody.userId) {
        res.status(400).json({ error: 'invalid userId when createSort' });
        return;
    }
    db.Sort.create(reqBody).then(function (result) {
        const nameToUpdate = 'S' + result.id;
        db.Sort.update({ name: nameToUpdate }, { where: { id: result.id } }).then(function () {
            result.name = nameToUpdate;
            if (parseInt(result.numberOfPlates) > 0) {
                const plateList = [];
                for (let i = 0; i < parseInt(result.numberOfPlates); i++) {
                    const temp = {
                        sortId: result.id,
                        createdBy: reqBody.userId,
                        updatedBy: reqBody.userId
                    };
                    plateList.push(temp);
                }

                db.BCCPlate.bulkCreate(plateList, { individualHooks: true }).then(function (bulkCreateResult) {
                    db.BCCPlate.update({
                        name: db.Sequelize.fn('concat', 'BP', db.Sequelize.col('id'))
                    }, { where: { name: null } }).then(function (updateResults) {
                        res.status(200).json(result);
                    }, function (err) {
                        winston.error('createBCCPlate Failed: ', err);
                        res.status(500).json({ error: 'create BCCPlate fail, check db.' });
                    });
                }, function (rejectedPromiseError) {
                    winston.error('createBCCPlate Failed: ', rejectedPromiseError);
                    if (rejectedPromiseError.name === 'SequelizeForeignKeyConstraintError') {
                        res.status(403).json({ error: rejectedPromiseError.index + ' value out of range' });
                        return;
                    }
                    res.status(500).json({ error: 'create BCCPlate Failed. Please check db' });
                });
            } else {
                res.status(200).json(result);
            }
        }, function (err) {
            winston.error('createSort Failed: ', err);
            res.status(500).json({ error: 'create Sort fail, check db.' });
        });
    }, function (rejectedPromiseError) {
        winston.error('createSort Failed: ', rejectedPromiseError);
        if (rejectedPromiseError.name === 'SequelizeForeignKeyConstraintError') {
            res.status(403).json({ error: rejectedPromiseError.index + ' value out of range' });
            return;
        }
        res.status(500).json({ error: 'create Sort Failed. Please check db' });
    });
}

function searchByColumn (req, res) {
    const body = req.body;
    const colNames = body.columns;

    if (!colNames) {
        res.status(400).json({ error: 'Empty column name.' });
        return;
    }

    const criteria = {
        where: {
            isDeleted: false
        }
    };
    for (const i in colNames) {
        if (colNames[i] != null) {
            criteria.where[i] = colNames[i];
        }
    }

    db.Sort.findAll(criteria).then(function (Sort) {
        res.json(Sort);
    }, function (rejectedPromiseError) {
        winston.error('search Failed: ', rejectedPromiseError);
        res.status(500).json({ error: rejectedPromiseError });
    });
}

module.exports = router;
