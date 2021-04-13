'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const common = require('../common');

const model = 'DiscoveryTransfection';

router.post('/get', common.getEntry(model));
router.post('/create', common.createEntry(model, 'DTX'));
router.post('/update', common.updateEntry(model));
router.get('/getlist', getDiscoveryTransfectionList);
router.get('/getmapping', common.getNameMapping(model));
router.post('/searchByColumn', searchByColumn);

function getDiscoveryTransfectionList (req, res) {
    const result = {
        tableName: 'discoveryTransfections'
    };

    db.DiscoveryTransfection.findAll({
        where: { isDeleted: false },
        include: [
            {
                model: db.WellRescue,
                attributes: ['name'],
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
            },
            {
                model: db.Protein,
                attributes: ['name'],
                include: [{
                    model: db.Project,
                    attributes: ['name']
                }]
            },
            {
                model: db.Plasmid,
                as: 'heavyChainPlasmid',
                attributes: ['name']
            },
            {
                model: db.Plasmid,
                as: 'lightChainPlasmid',
                attributes: ['name']
            },
            {
                model: db.DiscoveryPlasmid,
                as: 'heavyChainDiscoveryPlasmid',
                attributes: ['name', 'concentration']
            },
            {
                model: db.DiscoveryPlasmid,
                as: 'lightChainDiscoveryPlasmid',
                attributes: ['name', 'concentration']
            }
        ],
        raw: true
    }).then(function (DiscoveryTransfection) {
        const processedTransfectionList = [];
        if (DiscoveryTransfection) {
            for (let i = 0; i < DiscoveryTransfection.length; i++) {
                let processedTransfection = {};
                processedTransfection = DiscoveryTransfection[i];
                if (DiscoveryTransfection[i].rescueControl === 'Control') {
                    processedTransfection.pw = DiscoveryTransfection[i]['Protein.name'];
                    processedTransfection.heavyChainPlasmid = DiscoveryTransfection[i]['heavyChainPlasmid.name'];
                    processedTransfection.lightChainPlasmid = DiscoveryTransfection[i]['lightChainPlasmid.name'];
                    processedTransfection.project = DiscoveryTransfection[i]['Protein.Project.name'];
                } else {
                    processedTransfection.pw = DiscoveryTransfection[i]['WellRescue.name'];
                    processedTransfection.heavyChainPlasmid = DiscoveryTransfection[i]['heavyChainDiscoveryPlasmid.name'];
                    processedTransfection.lightChainPlasmid = DiscoveryTransfection[i]['lightChainDiscoveryPlasmid.name'];
                    processedTransfection.project = DiscoveryTransfection[i]['WellRescue.SupernatentPlate.BCCPlate.Sort.Activation.Project.name'];
                    processedTransfection.heavyChainPlasmidConcentration = DiscoveryTransfection[i]['heavyChainDiscoveryPlasmid.concentration'];
                    processedTransfection.lightChainPlasmidConcentration = DiscoveryTransfection[i]['lightChainDiscoveryPlasmid.concentration'];
                }
                delete processedTransfection['WellRescue.SupernatentPlate.BCCPlate.Sort.Activation.Project.name'];
                delete processedTransfection['WellRescue.SupernatentPlate.BCCPlate.Sort.Activation.Project.id'];
                delete processedTransfection['Protein.name'];
                delete processedTransfection['WellRescue.name'];
                delete processedTransfection['Protein.Project.id'];
                delete processedTransfection['Protein.Project.name'];
                delete processedTransfection['heavyChainPlasmid.name'];
                delete processedTransfection['lightChainPlasmid.name'];
                delete processedTransfection['heavyChainDiscoveryPlasmid.name'];
                delete processedTransfection['lightChainDiscoveryPlasmid.name'];
                delete processedTransfection['heavyChainDiscoveryPlasmid.concentration'];
                delete processedTransfection['lightChainDiscoveryPlasmid.concentration'];
                processedTransfectionList.push(processedTransfection);
            }
            result.records = processedTransfectionList;
        } else {
            result.records = DiscoveryTransfection;
        }

        db.EnumConfig.find({ where: { tableName: 'discoveryTransfections' } }).then(function (enumConfig) {
            result.enums = enumConfig ? enumConfig.properties : null;
            res.json(result);
        }, function (rejectedPromiseError) {
            res.status(500).json({ error: 'getEnumConfig Failed. Please check db' });
            winston.error('getEnumConfig Failed: ', rejectedPromiseError);
        });
    }, function (rejectedPromiseError) {
        winston.error('updateBioreactor Failed: ', rejectedPromiseError);
        res.status(500).json({ error: 'updateBioreactor Failed. Please check db' });
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
            'id', 'name', 'rescueControl'
        ],
        include: [
            {
                model: db.WellRescue,
                attributes: ['name']
            },
            {
                model: db.Protein,
                attributes: ['name']
            },
            {
                model: db.Plasmid,
                as: 'heavyChainPlasmid',
                attributes: ['name', 'concentration']
            },
            {
                model: db.Plasmid,
                as: 'lightChainPlasmid',
                attributes: ['name', 'concentration']
            },
            {
                model: db.DiscoveryPlasmid,
                as: 'heavyChainDiscoveryPlasmid',
                attributes: ['name', 'concentration']
            },
            {
                model: db.DiscoveryPlasmid,
                as: 'lightChainDiscoveryPlasmid',
                attributes: ['name', 'concentration']
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

    db.DiscoveryTransfection.findAll(criteria).then(function (DiscoveryTransfection) {
        const processedTransfectionList = [];
        if (DiscoveryTransfection) {
            for (let i = 0; i < DiscoveryTransfection.length; i++) {
                let processedTransfection = {};
                processedTransfection = DiscoveryTransfection[i];
                if (DiscoveryTransfection[i].rescueControl === 'Control') {
                    processedTransfection.pw = DiscoveryTransfection[i]['Protein.name'];
                    processedTransfection.heavyChainPlasmid = DiscoveryTransfection[i]['heavyChainPlasmid.name'];
                    processedTransfection.lightChainPlasmid = DiscoveryTransfection[i]['lightChainPlasmid.name'];
                    processedTransfection.heavyChainConcentration = DiscoveryTransfection[i]['heavyChainPlasmid.concentration'];
                    processedTransfection.lightChainConcentration = DiscoveryTransfection[i]['lightChainPlasmid.concentration'];
                } else {
                    processedTransfection.pw = DiscoveryTransfection[i]['WellRescue.name'];
                    processedTransfection.heavyChainPlasmid = DiscoveryTransfection[i]['heavyChainDiscoveryPlasmid.name'];
                    processedTransfection.lightChainPlasmid = DiscoveryTransfection[i]['lightChainDiscoveryPlasmid.name'];
                    processedTransfection.heavyChainConcentration = DiscoveryTransfection[i]['heavyChainDiscoveryPlasmid.concentration'];
                    processedTransfection.lightChainConcentration = DiscoveryTransfection[i]['lightChainDiscoveryPlasmid.concentration'];
                }
                delete processedTransfection['Protein.name'];
                delete processedTransfection['WellRescue.name'];
                delete processedTransfection['heavyChainPlasmid.name'];
                delete processedTransfection['lightChainPlasmid.name'];
                delete processedTransfection['heavyChainDiscoveryPlasmid.name'];
                delete processedTransfection['lightChainDiscoveryPlasmid.name'];
                delete processedTransfection['heavyChainDiscoveryPlasmid.concentration'];
                delete processedTransfection['lightChainDiscoveryPlasmid.concentration'];
                delete processedTransfection['heavyChainPlasmid.concentration'];
                delete processedTransfection['lightChainPlasmid.concentration'];

                processedTransfectionList.push(processedTransfection);
            }
            result.records = processedTransfectionList;
        } else {
            result.records = DiscoveryTransfection;
        }
        res.json(result);
    }, function (rejectedPromiseError) {
        res.status(500).json({ error: rejectedPromiseError });
    });
}

module.exports = router;
