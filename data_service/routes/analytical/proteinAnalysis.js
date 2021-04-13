'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const common = require('../common');

const model = 'ProteinAnalytics';

const getListCriteria = {
    where: { isDeleted: false },
    attributes: {
        include: [
            [db.Sequelize.fn('GROUP_CONCAT', db.Sequelize.literal('DISTINCT `ProteinPurifications`.`name` SEPARATOR ", "')), 'purifications']
        ]
    },
    include: [{
        model: db.ProteinPurification,
        through: { attributes: [] },
        attributes: []
    }],
    group: 'id',
    raw: false
};

const getCriteria = {
    include: [{
        model: db.ProteinPurification,
        attributes: ['id', 'name'],
        include: [{
            model: db.Transfection,
            attributes: ['id'],
            include: [{
                model: db.TransfectionRequest,
                attributes: ['id'],
                include: [{
                    model: db.Protein,
                    attributes: ['id', 'name']
                }]
            }]
        }]
    }]
};

router.post('/get', common.getEntry(model, getCriteria));
router.post('/create', createProteinAnalysis);
router.post('/update', common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'proteinAnalyses', getListCriteria));
router.get('/getmapping', common.getNameMapping(model));

function createProteinAnalysis (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when createProteinAnalysis' });
        return;
    }
    const reqBody = req.body;

    if (!reqBody.userId) {
        res.status(400).json({ error: 'invalid userId when createProteinAnalysis' });
        return;
    }

    if (reqBody.method === 'DLS') {
        if (!reqBody.DLSData || !reqBody.DLSData.length) {
            return;
        }
        db.DLSData.bulkCreate(reqBody.DLSData, { validate: true }).then(() => {
            res.status(200).json('DLS Data create ok');
        }, function (rejectedPromiseError) {
            winston.error('createDLSData Failed: ', rejectedPromiseError);
            res.status(500).json({ error: 'create ProteinAnalysis Failed. Please check db' });
        });
        return;
    }

    if (reqBody.method === 'MALS') {
        if (!reqBody.MALSData || !reqBody.MALSData.length) {
            return;
        }
        db.MALSData.bulkCreate(reqBody.MALSData, { validate: true }).then(() => {
            res.status(200).json('MALS Data create ok');
        }, function (rejectedPromiseError) {
            winston.error('createMALSData Failed: ', rejectedPromiseError);
            res.status(500).json({ error: 'create ProteinAnalysis Failed. Please check db' });
        });
        return;
    }

    if (reqBody.method === 'cIEF') {
        if (!reqBody.cIEFData || !reqBody.cIEFData.length) {
            return;
        }
        db.cIEFData.bulkCreate(reqBody.cIEFData, { validate: true }).then(() => {
            res.status(200).json('cIEF Data create ok');
        }, function (rejectedPromiseError) {
            winston.error('createCIEFData Failed: ', rejectedPromiseError);
            res.status(500).json({ error: 'create ProteinAnalysis Failed. Please check db' });
        });
        return;
    }

    if (!reqBody.proteinPurifications && !reqBody.proteinAnalysisRequests) {
        res.status(400).json({ error: 'must supply protein purification or analysis request to link to' });
        return;
    }

    db.ProteinAnalytics.create(reqBody).then(function (proteinAnalysis) {
        proteinAnalysis.addProteinPurifications(reqBody.proteinPurifications);
        const updatedRecord = {
            name: 'PA' + proteinAnalysis.id
        };
        if (reqBody.method === 'HPLC SEC' && reqBody.SECData && reqBody.SECData.length) {
            const SECData = reqBody.SECData.map(o => { o.proteinAnalysisId = proteinAnalysis.id; return o; });
            db.SECData.bulkCreate(SECData);
        }
        if (reqBody.method === 'Protein Thermal Shift' && reqBody.ThermalData && reqBody.ThermalData.length) {
            const ThermalData = reqBody.ThermalData.map(o => { o.proteinAnalysisId = proteinAnalysis.id; return o; });
            db.ThermalData.bulkCreate(ThermalData);
        }
        if (reqBody.method === 'CE-SDS' && reqBody.CESDSData && reqBody.CESDSData.length) {
            const CESDSData = reqBody.CESDSData.map(o => { o.proteinAnalysisId = proteinAnalysis.id; return o; });
            db.CESDSData.bulkCreate(CESDSData);
        }

        db.ProteinAnalytics.update(updatedRecord, { where: { id: proteinAnalysis.id } }).then(() => {
            proteinAnalysis.name = updatedRecord.name;
            res.status(200).json(proteinAnalysis);
        }, function (err) {
            winston.error('createProteinAnalysis Failed: ', { 'message': err.message, 'code': err.original.message });
            res.status(500).json({ error: 'create ProteinAnalysis fail, check db.' });
        });
    }, function (rejectedPromiseError) {
        winston.error('createProteinAnalysis Failed: ', rejectedPromiseError);
        if (rejectedPromiseError.name === 'SequelizeForeignKeyConstraintError') {
            res.status(403).json({ error: rejectedPromiseError.index + ' value out of range' });
            return;
        }
        res.status(500).json({ error: 'create ProteinAnalysis Failed. Please check db' });
    });
}

module.exports = router;
