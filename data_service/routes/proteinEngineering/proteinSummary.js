'use strict';

const express = require('express');
const router = express.Router();
const winston = require(global.__base + 'config/winston');
const db = require(global.__base + 'config/sequelize');

router.post('/get', getProteinSummary);
router.get('/getlist', getProteinSummaryList);

function getProteinSummaryList (req, res) {
    const query = 'Select * From ProteinSummary';
    db.sequelize.query(query).spread(function (proteins, metadata) {
        if (proteins) {
            const result = {
                records: proteins
            };
            res.status(200).json(result);
        } else {
            res.status(400).json({ error: 'No result found.' });
        }
    }, function (err) {
        winston.error('getProteinSummaryList Failed: ', err);
        res.status(500).json({ message: err.message });
    });
}

function getProteinSummary (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when getProteinSummary' });
        return;
    }
    const reqBody = req.body;

    if (!reqBody.id) {
        res.status(400).json({ error: 'Invalid protein id when getProteinSummary' });
        return;
    }

    const proteinInfo = db.Protein.findOne({
        where: { id: reqBody.id },
        attributes: {
            include: [[db.Sequelize.literal('ROUND(((molarExtCoefficient / molecularWeight) * 10), 2)'), 'nanoDrop']]
        },
        include: [
            {
                model: db.Project,
                attributes: ['id', 'name', 'description']
            }, {
                model: db.ProteinAntigen,
                attributes: ['pos1Antigen', 'pos2Antigen', 'pos3Antigen', 'pos4Antigen', 'pos1Class', 'pos2Class', 'pos3Class', 'pos4Class', 'fabLocation']
            }
        ]
    });

    const plasmidInfo = db.Plasmid.findAll({
        include: [{
            model: db.Protein,
            where: { id: reqBody.id }
        }]
    });

    const purificationInfo = db.ProteinPurification.findAll({
        include: [
            {
                model: db.Transfection,
                attributes: ['id', 'name', 'octetTiter'],
                required: true,
                include: [{
                    model: db.TransfectionRequest,
                    where: { isDeleted: false },
                    attributes: ['requestStatus', 'ENUM_transfectionCellLine'],
                    include: [{
                        model: db.Protein,
                        attributes: [],
                        where: { id: reqBody.id }
                    }]
                }]
            }
        ],
        where: { isDeleted: false }
    });

    const secInfo = db.SECData.findAll({
        where: { isDeleted: false },
        order: [
            ['proteinPurificationId', 'DESC'],
            ['date', 'DESC']
        ],
        include: [{
            model: db.ProteinPurification,
            attributes: ['name', 'id'],
            required: true,
            include: [{
                model: db.Transfection,
                required: true,
                attributes: [],
                include: [{
                    model: db.TransfectionRequest,
                    required: true,
                    attributes: [],
                    include: [{
                        model: db.Protein,
                        attributes: [],
                        where: { id: reqBody.id }
                    }]
                }]
            }]
        }]
    });

    const cellLines = db.StableCellLine.findAll({
        where: { isDeleted: false },
        attributes: ['id', 'name', 'ENUM_parentalCellLine', 'transfectionDate'],
        include: [{
            model: db.Protein,
            attributes: [],
            where: { id: reqBody.id }
        }]
    });

    const cellLineExperiments = db.CellLineExperiment.findAll({
        where: { isDeleted: false },
        attributes: ['id', 'name', 'experimentType', 'inoculationDate'],
        include: [{
            model: db.StableCellLine,
            attributes: ['id', 'name'],
            required: true,
            include: [{
                model: db.Protein,
                attributes: [],
                where: { id: reqBody.id }
            }]
        }, {
            model: db.CLDHarvest,
            attributes: ['id', 'wellName'],
            as: 'minipool'
        }]
    });

    Promise.all([proteinInfo, plasmidInfo, purificationInfo, secInfo, cellLines, cellLineExperiments]).then(function (ProteinSummary) {
        if (ProteinSummary) {
            res.status(200).json({
                proteinInfo: ProteinSummary[0],
                plasmidInfo: ProteinSummary[1],
                purificationInfo: ProteinSummary[2],
                secInfo: ProteinSummary[3],
                sclInfo: ProteinSummary[4],
                clExpInfo: ProteinSummary[5]
            });
        } else {
            res.status(400).json({ error: 'no ProteinAnalysis id exists' });
        }
    }, function (err) {
        winston.error('getProteinSummary Failed: ', err);
        res.status(500).json({ error: 'get getProteinSummary failed. Find id error.' });
    });
}

module.exports = router;
