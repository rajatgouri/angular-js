'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const common = require('../common');
const email = require('../email');

const model = 'ConstructRequest';

const getListCriteria = () => {
    return {
        where: { isDeleted: false },
        attributes: {
            include: [
                [db.Sequelize.literal('`User`.department'), 'department'],
                [db.Sequelize.literal('AVG(100*(`ConstructStatuses`.sequenceReviewed + `ConstructStatuses`.designed + `ConstructStatuses`.ordered + `ConstructStatuses`.cloned + `ConstructStatuses`.maxiprep + `ConstructStatuses`.sequenceVerified)/6)'), 'progress']
            ]
        },
        include: [{
            model: db.ConstructStatus,
            attributes: [],
            where: { isDeleted: false },
            required: false
        }, {
            model: db.User,
            attributes: []
        }],
        group: 'id'
    };
};

const getCriteria = {
    where: { isDeleted: false },
    include: [{
        model: db.ConstructStatus,
        attributes: ['id', 'name', 'description', 'assignedTo', 'priority', 'createdBy', 'status', 'adminNotes',
            [db.Sequelize.literal('100*(sequenceReviewed + designed + ordered + cloned + maxiprep + sequenceVerified)/6'), 'progress']
        ],
        where: { isDeleted: false },
        required: false,
        include: [{
            model: db.Plasmid,
            attributes: ['id', 'name', 'description'],
            where: { isDeleted: false },
            required: false,
            include: [{
                model: db.Protein,
                through: { attributes: ['id', 'name', 'description'] },
                where: { isDeleted: false },
                required: false
            }]
        }]
    }, {
        model: db.Project,
        as: 'requestProject',
        attributes: ['id', 'name', 'description']
    }]
};

const getMappingAttrs = ['id', 'name', 'notes'];

router.post('/get', common.getEntry(model, getCriteria));
router.post('/create', preCreate, common.createEntry(model, 'CR'));
router.post('/update', checkNotification, checkOnHold, common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'constructRequests', getListCriteria));
router.get('/getmapping', common.getNameMapping(model, getMappingAttrs));
router.post('/searchByColumn', searchByColumn);

function preCreate (req, res, next) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when createConstructRequest' });
        return;
    }
    req.body.requestedBy = req.body.userId;
    next();
}

async function checkNotification (req, res, next) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload' });
        return;
    }
    const reqBody = req.body;
    // Get construct request details
    const request = await db.ConstructRequest.findOne({
        where: { id: reqBody.id }
    });
    // Skip if requestedBy is null
    if (!request.requestedBy) {
        next();
    }
    // On approve hook
    if (reqBody.approvedBy) {
        const subject = 'Your construct request has been approved';
        const message = `<a href="https://lims.systimmune.net/#!/app/research/constructRequest?op=view&id=${request.id}">${request.name}</a> is approved.` +
            ` Estimated date of completion: ${request.estimatedTimeline.toDateString()}`;
        email.sendEmail(request.requestedBy, subject, message);
    // Edit to the timeline by non-requester in the specified state
    } else if (
        request.requestedBy !== reqBody.updatedBy &&
        (request.status === 'In Progress' || request.status === 'Approved') &&
        (new Date(request.estimatedTimeline).toDateString() !== new Date(reqBody.estimatedTimeline).toDateString())) {
        const subject = 'Your construct request has been updated';
        const message = `<a href="https://lims.systimmune.net/#!/app/research/constructRequest?op=view&id=${request.id}">${request.name}</a> was updated.` +
            ` Estimated date of completion: ${reqBody.estimatedTimeline.split('T')[0]}`;
        email.sendEmail(request.requestedBy, subject, message);
    }
    next();
}

async function checkOnHold (req, res, next) {
    if (!req.body.id) {
        res.status(400).json({ error: 'Empty payload' });
        return;
    }
    const reqBody = req.body;
    const request = await db.ConstructRequest.findOne({ where: { id: reqBody.id } });
    // change status condition on the child constructs if request is put on hold
    if (reqBody.status !== request.status) {
        if (reqBody.status === 'On Hold') {
            db.ConstructStatus.update({ onHold: true }, { where: { constructRequestId: reqBody.id } });
        } else {
            db.ConstructStatus.update({ onHold: false }, { where: { constructRequestId: reqBody.id } });
        }
    }
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

    db.ConstructRequest.findAll(criteria).then(function (ConstructRequest) {
        res.json(ConstructRequest);
    }, function (rejectedPromiseError) {
        winston.error('searchByProject Failed: ', rejectedPromiseError);
        res.status(500).json({ error: rejectedPromiseError });
    });
}

module.exports = router;
