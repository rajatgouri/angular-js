'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const common = require('../common');

const model = 'DiscoveryPlasmid';

const getMappingAttrs = ['id', 'name', 'lcOrHc', 'wellRescueId'];

const getListCriteria = {
    where: { isDeleted: false },
    attributes: {
        include: [
            [db.Sequelize.col('`WellRescue`.name'), 'wellRescue'],
            [db.Sequelize.col('`WellRescue->SupernatentPlate->BCCPlate->Sort->Activation->Project`.name'), 'project']
        ]
    },
    include: [{
        model: db.WellRescue,
        attributes: [],
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
        }]
    }]
};

router.post('/get', common.getEntry(model));
router.post('/create', createDiscoveryPlasmid);
router.post('/update', common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'discoveryPlasmids', getListCriteria));
router.get('/getmapping', common.getNameMapping(model, getMappingAttrs));

function createDiscoveryPlasmid (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when createDiscoveryPlasmid' });
        return;
    }
    const reqBody = req.body;
    reqBody.createdBy = reqBody.userId;
    reqBody.updatedBy = reqBody.userId;

    db.DiscoveryPlasmid.findAll({
        where: { wellRescueId: reqBody.wellRescueId, lcOrHc: reqBody.lcOrHc },
        order: [['version', 'DESC']],
        limit: 1
    }).then(function (result) {
        let version = 0;
        if (result && result.length > 0) {
            version = parseInt(result[0].version) + 1;
        }
        reqBody.version = version;
        db.DiscoveryPlasmid.create(reqBody).then(function (result) {
            const nameToUpdate = {
                name: 'DP' + result.id
            };
            db.DiscoveryPlasmid.update(nameToUpdate, { where: { id: result.id } }).then(function () {
                res.status(200).json(nameToUpdate);
            }, function (rejectedPromiseError) {
                winston.error('update from create Failed: ', rejectedPromiseError);
                res.status(500).json({ error: rejectedPromiseError });
            });
        }, function (rejectedPromiseError) {
            winston.error('create Failed: ', rejectedPromiseError);
            if (rejectedPromiseError.name === 'SequelizeForeignKeyConstraintError') {
                res.status(403).json({ error: rejectedPromiseError.index + ' value out of range' });
                return;
            }
            res.status(500).json({ error: rejectedPromiseError });
        });
    }, function (err) {
        winston.error('create Failed: ', err);
        res.status(500).json({ error: { source: 'db', yousend: reqBody, dbsays: err } });
    });
}

function getDiscoveryPlasmidList (req, res) {
    const result = {
        tableName: 'discoveryplasmids'
    };

    db.DiscoveryPlasmid.findAll({
        where: { isDeleted: false },
        include: [{
            model: db.WellRescue,
            attributes: [],
            include: [
                {
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
                                    attributes: ['name']
                                }]
                            }]
                        }]
                    }]
                },
                {
                    model: db.CloningAndSequence,
                    attributes: ['vlClone', 'vhClone']
                }
            ]
        }],
        raw: true
    }).then(function (DiscoveryPlasmid) {
        // TODO: Rewrite in SQL
        const processedPlasmidList = [];
        if (DiscoveryPlasmid) {
            const length = DiscoveryPlasmid.length;
            for (let i = 0; i < length; i++) {
                let processedPlasmid = {};
                processedPlasmid = DiscoveryPlasmid[i];
                if (DiscoveryPlasmid[i].lcOrHc === 'HC') {
                    processedPlasmid.clone = DiscoveryPlasmid[i]['WellRescue.CloningAndSequence.vhClone'];
                } else {
                    processedPlasmid.clone = DiscoveryPlasmid[i]['WellRescue.CloningAndSequence.vlClone'];
                }
                delete processedPlasmid['WellRescue.CloningAndSequence.vhClone'];
                delete processedPlasmid['WellRescue.CloningAndSequence.vlClone'];
                delete processedPlasmid['WellRescue.CloningAndSequence.id'];
                processedPlasmidList.push(processedPlasmid);
            }
            result.records = processedPlasmidList;
        } else {
            result.records = DiscoveryPlasmid;
        }
        db.EnumConfig.find({ where: { tableName: 'discoveryPlasmids' } }).then(function (enumConfig) {
            result.enums = enumConfig ? enumConfig.properties : null;
            res.json(result);
        }, function (rejectedPromiseError) {
            winston.error('getEnumConfig Failed: ', rejectedPromiseError);
            res.status(500).json({ error: 'getEnumConfig Failed. Please check db' });
        });
    }, function (rejectedPromiseError) {
        winston.error('getDiscoveryPlasmidList Failed: ', rejectedPromiseError);
        res.status(500).json({ error: 'getDiscoveryPlasmidList Failed. Please check db' });
    });
}

module.exports = router;
