'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const common = require('../common');
const config = require(global.__base + 'config/config');

const model = 'Transfection';

const getListCriteria = {
    where: { isDeleted: false },
    include: [{
        model: db.TransfectionRequest,
        attributes: ['requestStatus', 'name', 'id'],
        include: [{
            model: db.Protein,
            attributes: ['id', 'name', 'ENUM_moleculeType']
        }]
    }],
    raw: true
};

const getMappingAttrs = ['id', 'name', [db.Sequelize.col('`TransfectionRequest->Protein`.name'), 'protein']];
const getMappingInclude = [{
    model: db.TransfectionRequest,
    attributes: [],
    include: [{
        model: db.Protein,
        attributes: []
    }]
}];

router.post('/get', common.getEntry(model));
router.post('/create', createTransfection);
router.post('/update', common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'transfection', getListCriteria));
router.get('/getmapping', common.getNameMapping(model, getMappingAttrs, getMappingInclude));

function updateTRfromPending (trReqNum, callback, errCallback) {
    db.TransfectionRequest.findOne({ where: { id: trReqNum } }).then(function (result) {
        let tr = result;
        if (!tr) {
            if (errCallback) {
                errCallback();
            }
            return;
        }

        if (tr.requestStatus === 'Approved') {
            adjustPlasmidLot(result.proteinId, result.ENUM_transfectionScale);
            db.TransfectionRequest.update({ requestStatus: 'In Progress' }, { where: { id: trReqNum } }).then(function () {
                callback();
            }, function (err2) {
                console.log('err2', err2);
            });
        } else {
            callback();
        }
    }, function (err) {
        if (err) {
            callback();
        }
    });
}

async function adjustPlasmidLot (proteinId, scale) {
    if (!proteinId || !scale) {
        return;
    }
    // Find all plasmids associated with protein
    const plasmids = await db.Plasmid.findAll({
        where: {
            isDeleted: false
        },
        include: [{
            model: db.Protein,
            attributes: [],
            where: {
                id: proteinId
            }
        }]
    });
    // Subtract volume needed for TR from each plasmid
    for (let i = 0; i < plasmids.length; i++) {
        let massNeeded = parseInt(scale);
        const currPlasmid = plasmids[i];
        // Find all available lots sorted by oldest first
        const lots = await db.PlasmidLot.findAll({
            where: {
                isDeleted: false,
                plasmidId: currPlasmid.id,
                volume: {
                    [db.Sequelize.Op.gt]: 0
                }
            },
            order: [
                ['prepDate', 'ASC']
            ]
        });
        let lotIndex = 0;
        // go through lots until we don't need anymore juice
        while (massNeeded > 0 && lotIndex < lots.length) {
            const currLot = lots[lotIndex];
            // Lowest is 1 microgram so round to 3 decimal
            let volumeNeeded = massNeeded / currLot.concentration;
            // If the lot can handle the full amount
            if (volumeNeeded < currLot.volume) {
                const volumeLeft = Math.round(100 * (currLot.volume - volumeNeeded)) / 100;
                db.PlasmidLot.update({ volume: volumeLeft }, { where: { id: currLot.id } });
                massNeeded = 0;
                // Send reprep notification if we need more, only once as it transitions
                if (volumeLeft < 0.5 && currLot.volume > 0.5) {
                    sendReprepNotification(currPlasmid, volumeLeft);
                }
                // If it can't use what's left and go to the next lot
            } else {
                massNeeded -= currLot.volume * currLot.concentration;
                db.PlasmidLot.update({ volume: 0 }, { where: { id: currLot.id } });
                lotIndex++;
            }
        }
    }
}

function sendReprepNotification (entry, volumeLeft) {
    entry.type = 'PREP';
    const postOptions = {
        method: 'post',
        body: entry,
        json: true,
        url: config.slackUrl
    };
    common.asyncRequest(postOptions);
}

function createTransfection (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when createTransfection' });
        return;
    }
    const reqBody = req.body;

    if (!reqBody.userId) {
        res.status(400).json({ error: 'invalid userId when createTransfection' });
        return;
    }
    reqBody.createdBy = reqBody.userId;
    reqBody.updatedBy = reqBody.userId;

    db.Transfection.create(reqBody).then(function (result) {
        const nameToUpdate = 'T' + result.id;
        db.Transfection.update({ name: nameToUpdate }, { where: { id: result.id } }).then(function () {
            // Update TR from pending to being transfected.
            updateTRfromPending(reqBody.trqId, function () {
                result.name = nameToUpdate;
                res.status(200).json(result);
            }, function () {
                // TODO(ww): Still return ok, if this is importing from CSV.
                res.status(200).json({ message: 'ok', warning: 'TR number not found' });
            });
        }, function (err) {
            winston.error('create transfection Failed: ', err);
            res.status(500).json({ error: 'create transfection fail, check db.' });
        });
    }, function (rejectedPromiseError) {
        winston.error('create transfection failed: ', rejectedPromiseError);
        if (rejectedPromiseError.name === 'SequelizeForeignKeyConstraintError') {
            res.status(403).json({ error: rejectedPromiseError.index + ' value out of range' });
            return;
        }
        res.status(500).json({ error: 'db', yousend: reqBody, dbsays: rejectedPromiseError });
    });
}

module.exports = router;
