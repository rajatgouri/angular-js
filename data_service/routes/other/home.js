'use strict';

const express = require('express');
const router = express.Router();
// const common = require('../common');
const winston = require(global.__base + 'config/winston');
const db = require(global.__base + 'config/sequelize');

router.post('/get', getInfo);
router.post('/update', updateDashboard);

function getInfo (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when getEntry' });
        return;
    }
    const reqBody = req.body;
    reqBody.widgets = reqBody.id;
    const deps = [];
    const toReturn = [];
    if (!reqBody.widgets || !Array.isArray(reqBody.widgets)) {
        res.status(400).json({ error: 'Must provide array of widgets' });
        return;
    }
    for (let i = 0; i < reqBody.widgets.length; i++) {
        let query;
        switch (reqBody.widgets[i]) {
            case 'constructsAwaiting':
                query = db.ConstructRequest.findAll({
                    where: {
                        isDeleted: false,
                        status: {
                            [db.Sequelize.Op.or]: ['Pending', 'Approved']
                        }
                    },
                    attributes: ['id', 'name', 'requestedBy', 'notes', 'createdAt']
                });
                break;
            case 'octetRequestsAwaiting':
                query = db.KineticRequest.findAll({
                    where: { isDeleted: false, expProgress: 'Submitted' },
                    attributes: ['id', 'name', 'createdBy', 'fullKinetics', 'quantitation', 'epitopeBinning', 'createdAt']
                });
                break;
            case 'myEvents':
                query = db.Reservation.findAll({
                    where: {
                        isDeleted: false,
                        assignedTo: reqBody.userId,
                        endDate: { [db.Sequelize.Op.gt]: new Date() }
                    },
                    attributes: ['startDate', 'endDate'],
                    include: [{
                        model: db.Instrument,
                        attributes: ['name']
                    }]
                });
                break;
            case 'adTransfectionsAwaiting':
                query = db.ADTransfectionRequest.findAll({
                    where: {
                        isDeleted: false,
                        status: 'Pending'
                    },
                    attributes: ['id', 'name', 'createdBy']
                });
                break;
            case 'myConstructs':
                query = db.ConstructStatus.findAll({
                    where: { isDeleted: false, assignedTo: reqBody.userId, completed: false, onHold: false },
                    attributes: ['id', 'name', 'description',
                        [db.Sequelize.literal('100*(sequenceReviewed + designed + ordered + cloned + maxiprep + sequenceVerified)/6'), 'progress'],
                        [db.Sequelize.literal('IF(onHold, "On Hold", `ConstructStatus`.status)'), 'status']
                    ]
                });
                break;
            case 'latestActivities':
                query = db.User.findOne({
                    where: { id: reqBody.userId },
                    attributes: ['tableHistories']
                });
                break;
            case 'pendingTRs':
                query = db.TransfectionRequest.findAll({
                    where: { isDeleted: false, requestStatus: 'Pending' },
                    attributes: ['id', 'name', 'requesterId', 'createdAt'],
                    include: [{
                        model: db.Protein,
                        attributes: ['id', 'name', 'description', 'ENUM_moleculeType']
                    }]
                });
                break;
            case 'approvedTRs':
                query = db.TransfectionRequest.findAll({
                    where: { isDeleted: false, requestStatus: 'Approved' },
                    attributes: ['id', 'name', 'requesterId', 'createdAt', 'dnaReady'],
                    include: [{
                        model: db.Protein,
                        attributes: ['id', 'name', 'description', 'ENUM_moleculeType'],
                        include: [{
                            model: db.Plasmid,
                            attributes: ['id', 'name', 'description']
                        }]
                    }]
                });
                break;
            case 'inTransfection':
                query = db.Transfection.findAll({
                    where: { isDeleted: false },
                    attributes: ['id', 'name', 'transfectionDate', 'createdBy'],
                    include: [{
                        model: db.TransfectionRequest,
                        where: { isDeleted: false, requestStatus: 'In Progress' },
                        attributes: ['id', 'name', 'ENUM_transfectionCellLine'],
                        include: [{
                            model: db.Protein,
                            attributes: ['id', 'name', 'description', 'ENUM_moleculeType']
                        }]
                    }]
                });
                break;
            case 'inPurification':
                query = db.ProteinPurification.findAll({
                    where: { isDeleted: false },
                    attributes: ['id', 'name', 'createdAt'],
                    include: [{
                        model: db.Transfection,
                        attributes: ['id', 'name', 'harvestDate'],
                        required: true,
                        include: [{
                            model: db.TransfectionRequest,
                            where: { requestStatus: 'In Purification' },
                            attributes: ['id', 'name', 'ENUM_transfectionPurificationMethod', 'requesterId'],
                            include: [{
                                model: db.Protein,
                                attributes: ['id', 'name', 'description']
                            }]
                        }]
                    }]
                });
                break;
            default:
                break;
        }
        if (query) {
            toReturn.push(reqBody.widgets[i]);
            deps.push(query);
        }
    }

    Promise.all(deps).then(results => {
        // map results to widget names
        const result = {};
        for (let i = 0; i < toReturn.length; i++) {
            result[toReturn[i]] = results[i];
        }
        res.status(200).json(result);
    }, function (err) {
        winston.error('getWidgetData Failed: ', err);
        res.status(500).json({ error: 'get getWidgetData failed. query error.' });
    });
}

function updateDashboard (req, res) {
    if (!req.body || !req.body.userId || !req.body.layout) {
        res.status(400).json({ error: 'Empty payload when getEntry' });
        return;
    }

    db.UserPreference.upsert({ homeLayout: req.body.layout, userId: req.body.userId }).then(result => {
        res.status(200).json('ok');
    }, err => {
        winston.error('update Failed: ', err);
        res.status(500).json({ error: 'find id error.' });
    });
}

module.exports = router;
