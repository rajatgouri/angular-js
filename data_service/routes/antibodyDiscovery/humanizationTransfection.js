'use strict';

const express = require('express');
const router = express.Router();
const winston = require(global.__base + 'config/winston');
const db = require(global.__base + 'config/sequelize');
const common = require('../common');

const model = 'HumanizationTransfection';

const getMappingAttrs = ['id', 'name', 'vhOrVl', 'wellRescueId'];

router.post('/get', common.getEntry(model));
router.post('/create', common.createEntry(model, 'HTX'));
router.post('/update', common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', getHumanizationTransfectionList);
router.get('/getmapping', common.getNameMapping(model, getMappingAttrs));
router.post('/searchByColumn', searchByColumn);

function getHumanizationTransfectionList (req, res) {
    const result = {
        tableName: 'humanizationTransfections'
    };

    db.HumanizationTransfection.findAll({
        where: { isDeleted: false },
        include: [
            {
                model: db.HumanizationPlasmid,
                attributes: ['name', 'version', 'vhOrVl'],
                as: 'lightChainHumanizationPlasmid'
            },
            {
                model: db.HumanizationPlasmid,
                attributes: ['name', 'version', 'vhOrVl'],
                as: 'heavyChainHumanizationPlasmid'
            },
            {
                model: db.DiscoveryPlasmid,
                attributes: ['name', 'version', 'lcOrHc'],
                as: 'lightChainDiscoveryPlasmid'
            },
            {
                model: db.DiscoveryPlasmid,
                attributes: ['name', 'version', 'lcOrHc'],
                as: 'heavyChainDiscoveryPlasmid'
            },
            {
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
                                    attributes: ['name']
                                }]
                            }]
                        }]
                    }]
                }]
            }
        ],
        raw: true
    }).then(function (HumanizationTransfection) {
        const processedTransfectionList = [];
        const chainMapping = {
            'LC': 'VL',
            'HC': 'VH'
        };
        if (HumanizationTransfection) {
            for (let i = 0; i < HumanizationTransfection.length; i++) {
                let processedTransfection = {};
                processedTransfection = HumanizationTransfection[i];
                if (HumanizationTransfection[i].heavyChainDiscoveryPlasmidId) {
                    processedTransfection.heavyChainPlasmid = HumanizationTransfection[i]['heavyChainDiscoveryPlasmid.name'];
                    processedTransfection.heavyChainPlasmidVersion = chainMapping[HumanizationTransfection[i]['heavyChainDiscoveryPlasmid.lcOrHc']] +
                        'v' + HumanizationTransfection[i]['heavyChainDiscoveryPlasmid.version'];
                } else {
                    processedTransfection.heavyChainPlasmid = HumanizationTransfection[i]['heavyChainHumanizationPlasmid.name'];
                    processedTransfection.heavyChainPlasmidVersion = HumanizationTransfection[i]['heavyChainHumanizationPlasmid.vhOrVl'] +
                        'v' + HumanizationTransfection[i]['heavyChainHumanizationPlasmid.version'];
                }

                if (HumanizationTransfection[i].lightChainDiscoveryPlasmidId) {
                    processedTransfection.lightChainPlasmid = HumanizationTransfection[i]['lightChainDiscoveryPlasmid.name'];
                    processedTransfection.lightChainPlasmidVersion = chainMapping[HumanizationTransfection[i]['lightChainDiscoveryPlasmid.lcOrHc']] +
                        'v' + HumanizationTransfection[i]['lightChainDiscoveryPlasmid.version'];
                } else {
                    processedTransfection.lightChainPlasmid = HumanizationTransfection[i]['lightChainHumanizationPlasmid.name'];
                    processedTransfection.lightChainPlasmidVersion = HumanizationTransfection[i]['lightChainHumanizationPlasmid.vhOrVl'] +
                        'v' + HumanizationTransfection[i]['lightChainHumanizationPlasmid.version'];
                }
                processedTransfection.version = processedTransfection.heavyChainPlasmidVersion + processedTransfection.lightChainPlasmidVersion;

                delete processedTransfection['lightChainDiscoveryPlasmid.name'];
                delete processedTransfection['lightChainDiscoveryPlasmid.lcOrHc'];
                delete processedTransfection['lightChainDiscoveryPlasmid.version'];
                delete processedTransfection['lightChainHumanizationPlasmid.name'];
                delete processedTransfection['lightChainHumanizationPlasmid.vhOrVl'];
                delete processedTransfection['lightChainHumanizationPlasmid.version'];
                delete processedTransfection['heavyChainHumanizationPlasmid.name'];
                delete processedTransfection['heavyChainHumanizationPlasmid.vhOrVl'];
                delete processedTransfection['heavyChainHumanizationPlasmid.version'];
                delete processedTransfection['heavyChainDiscoveryPlasmid.name'];
                delete processedTransfection['heavyChainDiscoveryPlasmid.lcOrHc'];
                delete processedTransfection['heavyChainDiscoveryPlasmid.version'];
                delete processedTransfection.lightChainPlasmidVersion;
                delete processedTransfection.heavyChainPlasmidVersion;
                processedTransfectionList.push(processedTransfection);
            }
            result.records = processedTransfectionList;
        } else {
            result.records = HumanizationTransfection;
        }
        db.EnumConfig.find({ where: { tableName: 'humanizationTransfections' } }).then(function (enumConfig) {
            result.enums = enumConfig ? enumConfig.properties : null;
            res.json(result);
        }, function (rejectedPromiseError) {
            res.status(500).json({ error: 'getEnumConfig Failed. Please check db' });
            winston.error('getEnumConfig Failed: ', rejectedPromiseError);
        });
    }, function (rejectedPromiseError) {
        res.status(500).json({ error: 'getHumanizationTransfectionList Failed. Please check db' });
        winston.error('getHumanizationTransfectionList Failed: ', rejectedPromiseError);
    });
}

function searchByColumn (req, res) {
    const result = {};
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
        attributes: [
            'id', 'name', 'lightChainDiscoveryPlasmidId', 'heavyChainDiscoveryPlasmidId', 'lightChainHumanizationPlasmidId', 'heavyChainHumanizationPlasmidId'
        ],
        include: [
            {
                model: db.HumanizationPlasmid,
                attributes: ['name', 'version', 'vhOrVl', 'concentration'],
                as: 'lightChainHumanizationPlasmid'
            },
            {
                model: db.HumanizationPlasmid,
                attributes: ['name', 'version', 'vhOrVl', 'concentration'],
                as: 'heavyChainHumanizationPlasmid'
            },
            {
                model: db.DiscoveryPlasmid,
                attributes: ['name', 'version', 'lcOrHc', 'concentration'],
                as: 'lightChainDiscoveryPlasmid'
            },
            {
                model: db.DiscoveryPlasmid,
                attributes: ['name', 'version', 'lcOrHc', 'concentration'],
                as: 'heavyChainDiscoveryPlasmid'
            },
            {
                model: db.WellRescue,
                attributes: ['name']
            }
        ],
        raw: true
    };
    for (const i in colNames) {
        if (colNames.hasOwnProperty(i)) {
            if (colNames[i] != null) {
                criteria.where[i] = colNames[i];
            }
            if (i === 'harvestDate' && colNames[i]) {
                const date = new Date(new Date(colNames[i]).setHours(0));
                const date2 = new Date(colNames[i]);
                date2.setDate(date.getDate() + 1);
                criteria.where[i] = {
                    $gte: date,
                    $lte: date2
                };
            }
        }
    }

    db.HumanizationTransfection.findAll(criteria).then(function (HumanizationTransfection) {
        const processedTransfectionList = [];
        const chainMapping = {
            'LC': 'VL',
            'HC': 'VH'
        };
        if (HumanizationTransfection) {
            for (let i = 0; i < HumanizationTransfection.length; i++) {
                let processedTransfection = {};
                processedTransfection = HumanizationTransfection[i];
                if (HumanizationTransfection[i].heavyChainDiscoveryPlasmidId) {
                    processedTransfection.heavyChainPlasmid = HumanizationTransfection[i]['heavyChainDiscoveryPlasmid.name'];
                    processedTransfection.heavyChainPlasmidVersion = chainMapping[HumanizationTransfection[i]['heavyChainDiscoveryPlasmid.lcOrHc']] +
                        'v' + HumanizationTransfection[i]['heavyChainDiscoveryPlasmid.version'];
                    processedTransfection.heavyChainConcentration = HumanizationTransfection[i]['heavyChainDiscoveryPlasmid.concentration'];
                } else {
                    processedTransfection.heavyChainPlasmid = HumanizationTransfection[i]['heavyChainHumanizationPlasmid.name'];
                    processedTransfection.heavyChainPlasmidVersion = HumanizationTransfection[i]['heavyChainHumanizationPlasmid.vhOrVl'] +
                        'v' + HumanizationTransfection[i]['heavyChainHumanizationPlasmid.version'];
                    processedTransfection.heavyChainConcentration = HumanizationTransfection[i]['heavyChainHumanizationPlasmid.concentration'];
                }

                if (HumanizationTransfection[i].lightChainDiscoveryPlasmidId) {
                    processedTransfection.lightChainPlasmid = HumanizationTransfection[i]['lightChainDiscoveryPlasmid.name'];
                    processedTransfection.lightChainPlasmidVersion = chainMapping[HumanizationTransfection[i]['lightChainDiscoveryPlasmid.lcOrHc']] +
                        'v' + HumanizationTransfection[i]['lightChainDiscoveryPlasmid.version'];
                    processedTransfection.lightChainConcentration = HumanizationTransfection[i]['lightChainDiscoveryPlasmid.concentration'];
                } else {
                    processedTransfection.lightChainPlasmid = HumanizationTransfection[i]['lightChainHumanizationPlasmid.name'];
                    processedTransfection.lightChainPlasmidVersion = HumanizationTransfection[i]['lightChainHumanizationPlasmid.vhOrVl'] +
                        'v' + HumanizationTransfection[i]['lightChainHumanizationPlasmid.version'];
                    processedTransfection.lightChainConcentration = HumanizationTransfection[i]['lightChainHumanizationPlasmid.concentration'];
                }
                processedTransfection.version = processedTransfection.heavyChainPlasmidVersion + processedTransfection.lightChainPlasmidVersion;
                processedTransfection.wellRescue = HumanizationTransfection[i]['WellRescue.name'];

                delete processedTransfection['lightChainDiscoveryPlasmid.name'];
                delete processedTransfection['lightChainDiscoveryPlasmid.lcOrHc'];
                delete processedTransfection['lightChainDiscoveryPlasmid.version'];
                delete processedTransfection['lightChainHumanizationPlasmid.name'];
                delete processedTransfection['lightChainHumanizationPlasmid.vhOrVl'];
                delete processedTransfection['lightChainHumanizationPlasmid.version'];
                delete processedTransfection['heavyChainHumanizationPlasmid.name'];
                delete processedTransfection['heavyChainHumanizationPlasmid.vhOrVl'];
                delete processedTransfection['heavyChainHumanizationPlasmid.version'];
                delete processedTransfection['heavyChainDiscoveryPlasmid.name'];
                delete processedTransfection['heavyChainDiscoveryPlasmid.lcOrHc'];
                delete processedTransfection['heavyChainDiscoveryPlasmid.version'];
                delete processedTransfection['WellRescue.name'];
                delete processedTransfection['lightChainHumanizationPlasmid.concentration'];
                delete processedTransfection['lightChainDiscoveryPlasmid.concentration'];
                delete processedTransfection['heavyChainHumanizationPlasmid.concentration'];
                delete processedTransfection['heavyChainDiscoveryPlasmid.concentration'];
                delete processedTransfection.lightChainPlasmidVersion;
                delete processedTransfection.heavyChainPlasmidVersion;
                processedTransfectionList.push(processedTransfection);
            }
            result.records = processedTransfectionList;
        } else {
            result.records = HumanizationTransfection;
        }
        res.json(result);
    }, function (rejectedPromiseError) {
        res.status(500).json({ error: rejectedPromiseError });
    });
}

module.exports = router;
