'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const common = require('../common');

const model = 'ADTransfectionRequest';

const getListCriteria = {
    attributes: {
        include: [
            [db.Sequelize.col('`Plasmid`.name'), 'plasmid']
        ]
    },
    include: [{
        model: db.Plasmid,
        attributes: []
    }]
};

const getCriteria = {
    include: [{
        model: db.Plasmid,
        attributes: ['id', 'name', 'description']
    }]
};

router.post('/get', common.getEntry(model, getCriteria));
router.post('/create', common.createEntry(model, 'ATR'));
router.post('/update', checkComplete, common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'adTransfectionRequest', getListCriteria));
router.get('/getmapping', common.getNameMapping(model));

async function checkComplete (req, res, next) {
    if (!req.body || !req.body.id) {
        res.status(400).json({ error: 'Empty payload when createConstructRequest' });
        return;
    }
    const request = await db.ADTransfectionRequest.findOne({
        where: {
            id: req.body.id
        }
    });
    if (!req.body.plasmidId) {
        next();
    }
    if (req.body.status === 'Completed' && request.status === 'Pending') {
        // scale always 3mL
        let massNeeded = 3;
        // Find all available lots sorted by oldest first
        const lots = await db.PlasmidLot.findAll({
            where: {
                isDeleted: false,
                plasmidId: req.body.plasmidId,
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
                // // Send reprep notification if we need more, only once as it transitions
                // if (volumeLeft < 0.5 && currLot.volume > 0.5) {
                //     sendReprepNotification(request.plasmidId, volumeLeft);
                // }
                // If it can't use what's left and go to the next lot
            } else {
                massNeeded -= currLot.volume * currLot.concentration;
                db.PlasmidLot.update({ volume: 0 }, { where: { id: currLot.id } });
                lotIndex++;
            }
        }
    }
    next();
}

module.exports = router;
