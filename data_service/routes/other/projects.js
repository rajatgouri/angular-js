'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const common = require('../common');

const model = 'Project';

const getCriteria = {
    include: [{
        model: db.User,
        attributes: ['id', 'displayName'],
        through: { attributes: ['stage'] }
    }]
};

const getListCriteria = {
    where: { isDeleted: false },
    attributes: {
        include: [
            [db.Sequelize.literal('GROUP_CONCAT(`Users`.displayName SEPARATOR ", ")'), 'leaders'],
            [db.Sequelize.literal('GROUP_CONCAT(DISTINCT `Users->ProjectStage`.stage SEPARATOR ", ")'), 'stages']
        ]
    },
    include: [{
        model: db.User,
        attributes: []
    }],
    group: 'id'
};

const getMappingAttrs = ['id', 'name', 'description', 'status'];

router.post('/get', common.getEntry(model, getCriteria));
router.post('/create', createProject);
router.post('/update', updateProject);
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'projects', getListCriteria));
router.get('/getmapping', common.getNameMapping(model, getMappingAttrs));
router.post('/searchByColumn', searchByColumn);

function createProject (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when createProject' });
        return;
    }
    const reqBody = req.body;

    if (!reqBody.userId) {
        res.status(400).json({ error: 'Invalid userId when createProject' });
        return;
    }
    reqBody.createdBy = reqBody.userId;
    reqBody.updatedBy = reqBody.userId;

    db.Project.create(reqBody).then(function (result) {
        if (reqBody.stages) {
            for (let i = 0; i < reqBody.stages.length; i++) {
                const currUser = reqBody.stages[i];
                result.addUser(currUser.id, { through: { stage: currUser.stage } });
            }
        }
        const toUpdate = {
            name: 'SI-' + result.id
        };
        result.name = toUpdate.name;
        db.Project.update(toUpdate, { where: { id: result.id } }).then(function (updateResult) {
            res.status(200).json(result);
        }, function (rejectedPromiseError) {
            winston.error('update from create project Failed: ', rejectedPromiseError);
            res.status(500).json({ error: 'create Project Failed. Please check db' });
        });
    }, function (rejectedPromiseError) {
        winston.error('createProject Failed: ', rejectedPromiseError);
        if (rejectedPromiseError.name === 'SequelizeForeignKeyConstraintError') {
            res.status(403).json({ error: rejectedPromiseError.index + ' value out of range' });
            return;
        }
        res.status(500).json({ error: rejectedPromiseError });
    });
}

function updateProject (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when updateProject' });
        return;
    }
    const reqBody = req.body;
    if (!reqBody.userId) {
        res.status(400).json({ error: 'Invalid userId when updateProject' });
        return;
    }
    if (!reqBody.id) {
        res.status(400).json({ error: 'empty project id when updateProject' });
        return;
    }
    if (!reqBody.updatedAt) {
        res.status(400).json({ error: 'empty updatedAt when updateProject' });
        return;
    }

    db.Project.findOne({ where: { id: reqBody.id } }).then(function (project) {
        if (!project) {
            res.status(404).json({ error: 'the project is not found' });
            return;
        }
        if (new Date(project.updatedAt).valueOf() !== new Date(reqBody.updatedAt).valueOf()) {
            res.status(403).json({ error: 'conflict' });
            return;
        }
        delete reqBody.updatedAt;
        db.Project.update(reqBody, { where: { id: reqBody.id } }).then(function (rows) {
            let i;
            if (reqBody.stages) {
                for (i = 0; i < reqBody.stages.length; i++) {
                    const currUser = reqBody.stages[i];
                    project.addUser(currUser.userId, {
                        through: {
                            stage: currUser.stage,
                            updatedBy: reqBody.updatedBy
                        }
                    });
                }
            }
            if (reqBody.usersToRemove) {
                for (i = 0; i < reqBody.usersToRemove.length; i++) {
                    project.removeUser(reqBody.usersToRemove[i]);
                }
            }
            res.status(200).json({ message: 'updated' });
        }, function (err) {
            winston.error('updateProject Failed: ', err);
            res.status(500).json({ error: 'update Project Failed. Please check db' });
        });
    }, function (err) {
        winston.error('find id error Failed: ', err);
        res.status(500).json({ error: 'get project failed. Find id error.' });
    });
}

function searchByColumn (req, res) {
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
        include: [{
            model: db.User
        }],
        attributes: {
            include: [
                [db.Sequelize.literal('GROUP_CONCAT(`Users`.displayName SEPARATOR ", ")'), 'leaders'],
                [db.Sequelize.literal('GROUP_CONCAT(DISTINCT `Users->ProjectStage`.stage SEPARATOR ", ")'), 'stages']
            ]
        },
        group: 'id'
    };
    for (const i in colNames) {
        if (i === 'active' && colNames[i]) {
            criteria.where.status = {
                $or: ['Active', 'Planned']
            };
        } else if (colNames[i] != null) {
            criteria.where[i] = colNames[i];
        }
    }
    db.Project.findAll(criteria).then(function (Project) {
        res.json(Project);
    }, function (rejectedPromiseError) {
        res.status(500).json({ error: rejectedPromiseError });
    });
}

module.exports = router;
