'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const common = require('../common');

const model = 'WellRescue';

const getMappingAttrs = ['id', 'name', 'VL', 'VH', 'cloned'];

const getListCriteria = {
    attributes: {
        include: [
            [db.Sequelize.literal('IF(VH = "Yes" AND VL = "Yes", "Yes", "No")'), 'success'],
            [db.Sequelize.col('`SupernatentPlate->BCCPlate->Sort->Activation->Project`.name'), 'project'],
            [db.Sequelize.literal('CONCAT(ENUM_wellType, ENUM_wellIndex)'), 'well']
        ]
    },
    where: { isDeleted: false },
    include: [{
        model: db.SupernatentPlate,
        attributes: [],
        include: [{
            model: db.BCCPlate,
            attributes: [],
            include: [{
                model: db.Sort,
                attributes: [],
                include: [{
                    model: db.Activation,
                    attributes: [],
                    include: [{
                        model: db.Project,
                        attributes: []
                    }]
                }]
            }]
        }]
    }],
    raw: true
};

router.post('/get', common.getEntry(model));
router.post('/create', createWellRescue);
router.post('/update', common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'wellRescues', getListCriteria));
router.get('/getmapping', common.getNameMapping(model, getMappingAttrs));
router.post('/searchByColumn', searchByColumn);

function createWellRescue (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when createWellRescue' });
        return;
    }
    const reqBody = req.body;
    reqBody.createdBy = reqBody.userId;
    reqBody.updatedBy = reqBody.userId;
    reqBody.operatorUserId = reqBody.userId;

    db.WellRescue.create(reqBody).then(function (result) {
        db.SupernatentPlate.find({
            where: { id: reqBody.supernatentPlateId },
            attributes: ['id', 'name']
        }).then(function (SupernatentPlate) {
            const nameToUpdate = {
                name: 'WR' + SupernatentPlate.name.slice(2) + reqBody.ENUM_wellType + reqBody.ENUM_wellIndex
            };
            result.name = nameToUpdate.name;
            db.WellRescue.update(nameToUpdate, { where: { id: result.id } }).then(function () {
                res.status(200).json(result);
            }, function (rejectedPromiseError) { // Fail to update.
                res.status(500).json({ error: rejectedPromiseError });
            });
        }, function (rejectedPromiseError) { // Fail to update.
            res.status(500).json({ error: rejectedPromiseError });
        });
    }, function (rejectedPromiseError) {
        if (rejectedPromiseError.name === 'SequelizeForeignKeyConstraintError') {
            res.status(403).json({ error: rejectedPromiseError.index + ' value out of range' });
            return;
        }
        res.status(500).json({ error: rejectedPromiseError });
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
        if (i === 'date' && colNames[i]) {
            const date = new Date(colNames[i]);
            const date2 = new Date(colNames[i]);
            date2.setDate(date.getDate() + 1);
            criteria.where[i] = {
                $gte: date,
                $lte: date2
            };
        } else if (i === 'findRange') {
            if (!colNames[i].fromPlate || !colNames[i].toPlate) {
                res.status(400).json({ error: 'Empty plate range.' });
            }
            criteria.include = [{
                model: db.SupernatentPlate,
                required: true,
                where: {
                    bccPlateId: {
                        [db.Sequelize.Op.between]: [colNames[i].fromPlate, colNames[i].toPlate]
                    }
                }
            }];
        } else if (colNames[i] != null) {
            criteria.where[i] = colNames[i];
        }
    }

    db.WellRescue.findAll(criteria).then(function (WellRescue) {
        res.json(WellRescue);
    }, function (rejectedPromiseError) {
        res.status(500).json({ error: rejectedPromiseError });
    });
}

module.exports = router;
