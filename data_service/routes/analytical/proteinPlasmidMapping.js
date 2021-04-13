'use strict';

const express = require('express');
const router = express.Router();
const winston = require(global.__base + 'config/winston');
const db = require(global.__base + 'config/sequelize');
const common = require('../common');

const model = 'ProteinPlasmidMapping';

const getListCriteria = {
    attributes: ['plasmidId', 'proteinId'],
    where: { isDeleted: false }
};
router.post('/create', create);
router.post('/delete', deleteEntry);
router.get('/getlist', common.getList(model, 'proteinplasmidpairs', getListCriteria));

function create (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when createPlasProPairs' });
        return;
    }
    const reqBody = req.body;

    if (!reqBody.plasmidId) {
        res.status(400).json({ error: 'missing plasmidId when createPlasProPairs' });
        return;
    }

    if (!reqBody.proteinId) {
        res.status(400).json({ error: 'invalid key when createPlasProPairs' });
        return;
    }

    reqBody.createdBy = reqBody.userId;

    db.ProteinPlasmidMapping.create(reqBody).then(function (record) {
        res.status(200).json({ message: 'created' });
    }, function (rejectedPromiseError) {
        winston.error('createPlasProPairs Failed: ', rejectedPromiseError);
        res.status(500).json({ error: 'createPlasProPairs Failed. Please check db' });
    });
}

function deleteEntry (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when deletePlasProPair' });
        return;
    }
    const reqBody = req.body;

    if (!reqBody.plasmidId || !reqBody.proteinId) {
        res.status(400).json({ error: 'missing plasmidId when deletePlasProPair' });
        return;
    }

    db.ProteinPlasmidMapping.destroy({
        where: {
            plasmidId: reqBody.plasmidId,
            proteinId: reqBody.proteinId
        }
    }).then(function (result) {
        res.status(200).json({ message: 'deleted' });
    }, function (err) {
        winston.error('deletePlasProPair Failed: ', err);
        res.status(500).json('deletePlasProPair: delete failed');
    });
}

module.exports = router;
