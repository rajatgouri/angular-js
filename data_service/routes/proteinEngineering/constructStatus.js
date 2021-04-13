'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const common = require('../common');

const model = 'ConstructStatus';

const getListCriteria = () => {
    return {
        where: { isDeleted: false },
        attributes: {
            include: [
                [db.Sequelize.col('`ConstructRequest`.requestedBy'), 'requestedBy'],
                [db.Sequelize.col('`ConstructRequest->User`.department'), 'department'],
                [db.Sequelize.literal('IFNULL(`Plasmid->Project`.`name`, `ConstructRequest->requestProject`.`name`)'), 'project'],
                [db.Sequelize.col('`ConstructRequest`.createdAt'), 'requestDate'],
                [db.Sequelize.col('`Plasmid`.name'), 'plasmid'],
                [db.Sequelize.col('`Plasmid`.ENUM_vector'), 'vector'],
                [db.Sequelize.literal('100*(sequenceReviewed + designed + ordered + cloned + maxiprep + sequenceVerified)/6'), 'progress'],
                [db.Sequelize.literal('IF(onHold, "On Hold", `ConstructStatus`.status)'), 'status']
            ]
        },
        include: [{
            model: db.Plasmid,
            attributes: [],
            include: [{
                model: db.Project,
                attributes: []
            }]
        }, {
            model: db.ConstructRequest,
            attributes: [],
            include: [{
                model: db.User,
                attributes: []
            }, {
                model: db.Project,
                attributes: [],
                as: 'requestProject'
            }]
        }]
    };
};

const getCriteria = {
    where: { isDeleted: false },
    include: [{
        model: db.Plasmid,
        attributes: ['id', 'name', 'description'],
        include: [{
            model: db.Protein,
            through: { attributes: ['id', 'name', 'description'] }
        }, {
            model: db.Project,
            attributes: ['id', 'name', 'description']
        }]
    }, {
        model: db.ConstructRequest,
        attributes: ['id', 'name', 'requestedBy'],
        include: [{
            model: db.Project,
            as: 'requestProject',
            attributes: ['id', 'name', 'description']
        }]
    }]
};

const getMappingAttrs = ['id', 'name', 'description'];

router.post('/get', common.getEntry(model, getCriteria));
router.post('/create', getStatus, common.createEntry(model, 'CS'));
router.post('/update', getStatus, common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'constructRequests', getListCriteria));
router.get('/getmapping', common.getNameMapping(model, getMappingAttrs));
router.post('/searchByColumn', searchByColumn);

async function getStatus (req, res, next) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when update/create ConstructRequest' });
        return;
    }
    const reqBody = req.body;
    if (reqBody.maxiprep) {
        req.body.status = 'Waiting for Verification';
    } else if (reqBody.cloned) {
        req.body.status = 'Waiting for Maxiprep';
    } else if (reqBody.ordered) {
        req.body.status = 'Cloning';
    } else if (reqBody.designed) {
        req.body.status = 'Waiting for order';
    } else if (reqBody.sequenceReviewed) {
        req.body.status = 'Designing';
    } else {
        req.body.status = 'Waiting for Review';
    }
    req.body.completed = (reqBody.sequenceReviewed && reqBody.sequenceVerified && reqBody.cloned && reqBody.designed && reqBody.maxiprep);
    if (req.body.completed && req.body.constructRequestId) {
        // Check if all other constructs from the request are in progress
        const constructs = await db.ConstructStatus.findAll({
            where: {
                constructRequestId: reqBody.constructRequestId,
                id: { [db.Sequelize.Op.ne]: reqBody.id }
            }
        });
        if (constructs.every(construct => {
            return construct.completed;
        })) {
            db.ConstructRequest.update({ status: 'Completed' }, { where: { id: reqBody.constructRequestId } });
        }
    }
    req.body.status = req.body.completed ? 'Completed' : req.body.status;
    next();
}

function searchByColumn (req, res) {
    const body = req.body;
    const colNames = body.columns;

    if (!colNames) {
        res.status(400).json({ error: 'Empty column name.' });
        return;
    }

    const criteria = getListCriteria();
    for (let i in colNames) {
        criteria.where[i] = colNames[i];
    }

    db.ConstructStatus.findAll(criteria).then(function (ConstructStatus) {
        res.json(ConstructStatus);
    }, function (rejectedPromiseError) {
        winston.error('searchByProject Failed: ', rejectedPromiseError);
        res.status(500).json({ error: rejectedPromiseError });
    });
}

module.exports = router;
