'use strict';

const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');
const asyncRequest = require('request');

module.exports = {
    deleteEntry: function (Model) {
        return function (req, res) {
            if (!req.body) {
                res.status(400).json({ error: 'Empty payload when delete' });
                return;
            }
            const reqBody = req.body;

            if (!reqBody.id) {
                res.status(400).json({ error: 'missing id when delete' });
                return;
            }

            db[Model].find({ where: { id: reqBody.id } }).then(() => {
                db[Model].update({ isDeleted: true }, { where: { id: reqBody.id } }).then(() => {
                    res.status(200).json({ message: 'deleted' });
                }, function (err) {
                    res.status(500).json({ error: err });
                });
            }, function (err) {
                winston.error('delete Failed: ', err);
                res.status(400).json('delete: id not found');
            });
        };
    },
    getNameMapping: function (Model, attributes = ['id', 'name'], include, group) {
        return function (req, res) {
            db[Model].findAll({
                attributes: attributes,
                where: { isDeleted: false },
                include: include,
                group: group
            }).then(function (result) {
                res.status(200).json(result);
            }, function (rejectedPromiseError) {
                res.status(500).json({ error: 'getNameMapping Failed. Please check db' });
                winston.error('getNameMapping Failed: ', rejectedPromiseError);
            });
        };
    },
    getEntry: function (Model, criteria = {}) {
        return function (req, res) {
            if (!req.body) {
                res.status(400).json({ error: 'Empty payload when getEntry' });
                return;
            }
            const reqBody = req.body;

            if (!reqBody.id) {
                res.status(400).json({ error: 'Invalid Activation id when getEntry' });
                return;
            }
            if (!criteria.where) {
                criteria.where = {
                    id: reqBody.id
                };
            } else {
                criteria.where.id = reqBody.id;
            }

            db[Model].findOne(criteria).then(function (result) {
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(400).json({ error: 'entry not found' });
                }
            }, function (err) {
                winston.error('getEntry Failed: ', err);
                res.status(500).json({ error: 'getEntry failed. Find id error.' });
            });
        };
    },
    getList: function (Model, tableName, criteria = { where: { isDeleted: false } }) {
        return function (req, res) {
            const output = {
                tableName
            };

            const enums = db.EnumConfig.find({ where: { tableName: output.tableName } });
            const records = db[Model].findAll(criteria);

            Promise.all([records, enums]).then(function (result) {
                output.records = result[0];
                output.enums = result[1] ? result[1].properties : null;
                res.json(output);
            }, function (rejectedPromiseError) {
                res.status(500).json({ error: 'getList Failed. Please check db' });
                winston.error('getList Failed: ', rejectedPromiseError);
            });
        };
    },
    createEntry: function (Model, prefix) {
        return function (req, res) {
            if (!req.body) {
                res.status(400).json({ error: 'Empty payload when createEntry' });
                return;
            }
            const reqBody = req.body;

            if (!reqBody.userId) {
                res.status(400).json({ error: 'invalid userId when createEntry' });
                return;
            }
            reqBody.createdBy = reqBody.userId;
            reqBody.updatedBy = reqBody.userId;

            db[Model].create(reqBody).then(function (result) {
                if (prefix) {
                    const nameToUpdate = {
                        name: prefix + result.id
                    };
                    result.name = nameToUpdate.name;
                    db[Model].update(nameToUpdate, { where: { id: result.id } }).then(() => {
                        res.status(200).json(result);
                    }, function (rejectedPromiseError) {
                        res.status(500).json({ error: rejectedPromiseError });
                        winston.error('update after create Failed: ', rejectedPromiseError);
                    });
                } else {
                    res.status(200).json(result);
                }
            }, function (rejectedPromiseError) {
                if (rejectedPromiseError.name === 'SequelizeForeignKeyConstraintError') {
                    res.status(403).json({ error: rejectedPromiseError.index + ' value out of range' });
                    return;
                }
                res.status(500).json({ error: rejectedPromiseError });
                winston.error('create Failed: ', rejectedPromiseError);
            });
        };
    },
    updateEntry: function (Model) {
        return function (req, res) {
            if (!req.body) {
                res.status(400).json({ error: 'Empty payload when updateEntry' });
                return;
            }
            const reqBody = req.body;

            db[Model].findOne({ where: { id: reqBody.id } }).then(function (entry) {
                if (entry) {
                    db[Model].update(reqBody, { where: { id: reqBody.id } }).then(function (result) {
                        res.status(200).json({ message: 'updated', oldData: entry, newData: reqBody, numRows: result });
                    }, function (err) {
                        winston.error('update Failed: ', err);
                        res.status(500).json({ error: err });
                    });
                } else {
                    res.status(400).json({ error: 'no entry exists' });
                }
            }, function (err) {
                winston.error('update Failed: ', err);
                res.status(500).json({ error: 'find id error.' });
            });
        };
    },
    searchByColumn: function (Model) {
        return function (req, res) {
            const body = req.body;
            const colNames = body.columns;

            if (!colNames) {
                res.status(400).json({ error: 'Empty column name.' });
                return;
            }
            const criteria = { where: { isDeleted: false } };
            for (let i in colNames) {
                if (colNames[i] != null) {
                    criteria.where[i] = colNames[i];
                }
            }

            db[Model].findAll(criteria).then(function (result) {
                res.json(result);
            }, function (rejectedPromiseError) {
                winston.error('searchByColumn Failed: ', rejectedPromiseError);
                res.status(500).json({ error: rejectedPromiseError });
            });
        };
    },
    asyncRequest: function (postOptions) {
        return asyncRequest(postOptions);
    }
};
