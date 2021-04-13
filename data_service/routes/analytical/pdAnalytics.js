'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const common = require('../common');

const model = 'PDAnalytics';

const getListCriteria = {
    where: { isDeleted: false },
    attributes: {
        include: [
            [db.Sequelize.fn('GROUP_CONCAT', db.Sequelize.literal('DISTINCT `BioreactorPurifications->Bioreactors`.`name` SEPARATOR ", "')), 'bioreactors'],
            [db.Sequelize.fn('GROUP_CONCAT', db.Sequelize.literal('DISTINCT `CellLinePurifications->CLDHarvest`.`wellName` SEPARATOR ", "')), 'harvests']
        ]
    },
    include: [
        {
            model: db.BioreactorPurification,
            through: { attributes: [] },
            attributes: [],
            include: [{
                model: db.Bioreactor,
                through: { attributes: [] },
                attributes: []
            }]
        },
        {
            model: db.CellLinePurification,
            through: { attributes: [] },
            attributes: [],
            include: [{
                model: db.CLDHarvest,
                attributes: []
            }]
        }
    ],
    group: 'id'
};

const getCriteria = {
    include: [{
        model: db.BioreactorPurification,
        attributes: ['id', 'name'],
        include: [{
            model: db.Bioreactor,
            attributes: ['id']
        }]
    }]
};

router.post('/get', common.getEntry(model, getCriteria));
router.post('/create', createAnalysis);
router.post('/update', common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'pdAnalyses', getListCriteria));
router.get('/getmapping', common.getNameMapping(model));

function createAnalysis (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when createPDAnalysis' });
        return;
    }
    const reqBody = req.body;

    if (!reqBody.userId) {
        res.status(400).json({ error: 'invalid userId when createPDAnalysis' });
        return;
    }

    if (reqBody.method === 'DLS' && reqBody.DLSData) {
        db.DLSData.bulkCreate(reqBody.DLSData, { validate: true }).then(() => {
            res.status(200).json('DLS Data create ok');
        }, function (rejectedPromiseError) {
            winston.error('createDLSData Failed: ', rejectedPromiseError);
            res.status(500).json({ error: 'create ProteinAnalysis Failed. Please check db' });
        });
        return;
    }

    if (reqBody.method === 'cIEF' && reqBody.cIEFData) {
        db.cIEFData.bulkCreate(reqBody.cIEFData, { validate: true }).then(() => {
            res.status(200).json('cIEF Data create ok');
        }, function (rejectedPromiseError) {
            winston.error('createCIEFData Failed: ', rejectedPromiseError);
            res.status(500).json({ error: 'create ProteinAnalysis Failed. Please check db' });
        });
        return;
    }

    if (!reqBody.bioreactorPurifications && !reqBody.cellLinePurifications) {
        res.status(400).json({ error: 'must supply purifications to link to' });
        return;
    }

    db.PDAnalytics.create(reqBody).then(function (analysis) {
        analysis.addBioreactorPurifications(reqBody.bioreactorPurifications);
        analysis.addCellLinePurifications(reqBody.cellLinePurifications);
        const updatedRecord = {
            name: 'A-' + analysis.id
        };
        if (reqBody.method === 'HPLC SEC' && reqBody.SECData && reqBody.SECData.length) {
            const SECData = reqBody.SECData.map(o => { o.pdAnalysisId = analysis.id; return o; });
            db.SECData.bulkCreate(SECData);
        }
        if (reqBody.method === 'Protein Thermal Shift' && reqBody.ThermalData && reqBody.ThermalData.length) {
            const ThermalData = reqBody.ThermalData.map(o => { o.pdAnalysisId = analysis.id; return o; });
            db.ThermalData.bulkCreate(ThermalData);
        }
        if (reqBody.method === 'CE-SDS' && reqBody.CESDSData && reqBody.CESDSData.length) {
            const CESDSData = reqBody.CESDSData.map(o => { o.pdAnalysisId = analysis.id; return o; });
            db.CESDSData.bulkCreate(CESDSData);
        }
        if (reqBody.method === 'Intact Mass' && reqBody.IntactMassData && reqBody.IntactMassData.length) {
            const IntactMassData = reqBody.IntactMassData.map(o => { o.pdAnalysisId = analysis.id; return o; });
            db.IntactMassData.bulkCreate(IntactMassData);
        }

        db.PDAnalytics.update(updatedRecord, { where: { id: analysis.id } }).then(() => {
            analysis.name = updatedRecord.name;
            res.status(200).json(analysis);
        }, function (err) {
            winston.error('create PDAnalysis Failed: ', { 'message': err.message, 'code': err.original.message });
            res.status(500).json({ error: 'create PDAnalysis fail, check db.' });
        });
    }, function (rejectedPromiseError) {
        winston.error('createPDAnalysis Failed: ', rejectedPromiseError);
        if (rejectedPromiseError.name === 'SequelizeForeignKeyConstraintError') {
            res.status(403).json({ error: rejectedPromiseError.index + ' value out of range' });
            return;
        }
        res.status(500).json({ error: 'create PDAnalysis Failed. Please check db' });
    });
}

module.exports = router;
