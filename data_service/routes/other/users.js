'use strict';

/**
 * Module dependencies.
 */
const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const _ = require('lodash');

router.getUser = function () {
    return function (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when get user' });
            return;
        }
        const reqBody = req.body;

        if (!reqBody.id) {
            res.status(400).json({ error: 'invalid user id when get user' });
            return;
        }

        db.User.find({
            where: { id: reqBody.id },
            attributes: ['id', 'displayName', 'email', 'username', 'tableHistories'],
            include: [{
                model: db.UserPreference,
                attributes: ['homeLayout', 'ctLayout']
            }]
        }).then(function (user) {
            if (!user) {
                winston.warn('the searched user id not in database, user possibly deleted post-login');
                res.status(404).json({ error: 'User Not Found' });
                return;
            }
            const result = {
                user: user
            };
            if (!reqBody.perms) {
                res.json(result);
            } else {
                let permissions = [];
                user.getRoles().then(function (roles) {
                    for (let i = 0; i < roles.length; i++) {
                        permissions = _.union(permissions, JSON.parse(roles[i].permissions));
                    }
                    result.permissions = permissions;
                    res.json(result);
                });
                winston.info('Session: { id: ' + user.id + ', username: ' + user.username + ' }');
            }
        }).catch(function (err) {
            winston.error('database error getUser', err);
            res.status(404).json({ error: 'Database error when get User, check sequelize/database' });
        });
    };
};

// For admins
router.getUserList = function () {
    return function (req, res) {
        db.User.findAll({
            where: { isDeleted: false },
            include: [{
                model: db.Role
            }]
        }).then(function (users) {
            if (!users) {
                res.status(404).json({ error: 'User Not Found' });
                return;
            }
            res.json(users);
        }).catch(function (err) {
            res.status(404).json({ error: 'User Not Found' });
        });
    };
};

// For users
router.getCompleteUserList = function () {
    return function (req, res) {
        const attributes = ['id', 'email', 'displayName', 'isDeleted'];
        db.User.findAll({ attributes: attributes }).then(function (users) {
            if (!users) {
                res.status(404).json({ error: 'User Not Found' });
                return;
            }
            res.json({ users: users });
        }).catch(function (err) {
            res.status(404).json({ error: 'User Not Found' });
        });
    };
};

// Used when updating table histories
router.updateUser = function () {
    return function (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when update user' });
            return;
        }
        const reqBody = req.body;

        if (!reqBody.id) {
            res.status(400).json({ error: 'invalid user id when update user' });
            return;
        }
        const id = reqBody.id;

        const option = {};

        let historyEntry;
        if (reqBody.historyTable && reqBody.time) {
            historyEntry = {
                tableName: reqBody.historyTable,
                time: reqBody.time
            };
        }

        db.User.find({ where: { id: id } }).then(function (user) {
            if (!user) {
                winston.warn('the searched user id not in database, user possibly deleted post-login');
                res.status(404).json({ error: 'User Not Found' });
                return;
            }

            if (historyEntry) {
                // Try to parse tablehistory JSON, empty list if error
                let history;
                try {
                    history = JSON.parse(user.tableHistories) || [];
                } catch (err) {
                    history = [];
                }
                // try find and replace table if already in the tableHistories log
                const found = history.findIndex(entry => entry.tableName === historyEntry.tableName);
                if (found > -1) {
                    history.splice(found, 1);
                // Don't want it to record more than 6 entries. Should be sorted so remove first entry
                } else if (history.length > 6) {
                    history.shift();
                }
                history.push(historyEntry);
                option.tableHistories = JSON.stringify(history);
            }

            db.User.update(
                option,
                { where: { id: id } })
                .then(() => {
                    res.status(200).json({ message: 'updated' });
                }, function (rejectedPromiseError) {
                    res.status(500).json({ error: 'Update User Failed. Please check db' });
                });
        }).catch(function (err) {
            console.log('err:', err);
            res.status(404).json({ error: 'User Not Found' });
        });
    };
};

// Used when saving user information from login
router.saveUser = function () {
    return function (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when update user' });
            return;
        }
        const reqBody = req.body;

        if (!reqBody.type || !reqBody.data) {
            res.status(400).json({ error: 'Invalid Payload' });
            return;
        }
        const userToSaveOption = {};

        if (reqBody.type === 'azuread') {
            userToSaveOption.mailNickname = reqBody.data.mailNickname;
            userToSaveOption.provider = 'AzureAD-OIDC';
        } else if (reqBody.type === 'ldap') {
            userToSaveOption.provider = 'LDAP';
        } else {
            res.status(500).json({ error: 'Not Implemented' });
            return;
        }
        userToSaveOption.username = reqBody.data.userPrincipalName;
        userToSaveOption.email = reqBody.data.mail;
        userToSaveOption.displayName = reqBody.data.displayName;
        userToSaveOption.department = reqBody.data.department;
        userToSaveOption.role = 'user';
        userToSaveOption.isDeleted = false;

        db.User.find({ where: { username: userToSaveOption.username } }).then(function (user) {
            if (!user) {
                db.User.create(userToSaveOption).then(function (createdUser) {
                    res.json(createdUser);
                }, function () {
                    res.status(500).json({ error: 'Create User Failed. Please check db' });
                });
            } else {
                userToSaveOption.role = user.role;
                db.User.update(userToSaveOption, { where: { username: userToSaveOption.username } }).then(function (result) {
                    db.User.find({ where: { username: userToSaveOption.username } }).then(function (user) {
                        if (!user) {
                            res.status(500).json({ error: 'Get User Failed. Please check db' });
                            return;
                        }
                        res.json(user);
                    }, function () {
                        res.status(500).json({ error: 'Get User Failed. Please check db' });
                    });
                }, function () {
                    res.status(500).json({ error: 'Update User Failed. Please check db' });
                });
            }
        }, function () {
            res.status(500).json({ error: 'Find User Failed. Please check db' });
        });
    };
};

router.deleteUser = function () {
    return function (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when get user' });
            return;
        }
        const reqBody = req.body;

        if (!reqBody.id) {
            res.status(400).json({ error: 'invalid user id when get user' });
            return;
        }

        db.User.update({ isDeleted: true }, { where: { id: reqBody.id } }).then(function () {
            res.status(200).json({ message: 'deleted' });
        }, function () {
            res.status(500).json({ error: 'Delete User Failed. Please check db' });
        });
    };
};

module.exports = router;
