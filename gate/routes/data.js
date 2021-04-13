'use strict';

const winston = require(global.__base + 'config/winston');
const async = require('async');
const asyncRequest = require('request');
const config = require(global.__base + 'config/config');
const dataDomain = config.domain.data;
const helperAPI = config.helperAPI;
const seqUtilsAPI = config.seqUtilsAPI;
const common = require('./common.js');

module.exports = {
    getEnumForManyTable: function (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when getEnumForManyTable' });
            return;
        }
        const reqBody = req.body;

        const postOptions = {
            method: 'post',
            body: reqBody,
            json: true,
            url: dataDomain + 'enumconfig/getForManyTable'
        };
        asyncRequest(postOptions, function (err, response, body) {
            if (err) {
                res.status(500).json({ error: err });
                return;
            }

            if (response.statusCode !== 200) {
                // Forward the error in body.
                res.status(response.statusCode).json(body);
                return;
            }

            if (!body) {
                res.status(500).json({ error: err });
                return;
            }

            res.json(body);
        });
    },
    updateEnum: function (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when updateEnum' });
            return;
        }
        const reqBody = req.body;

        if (!reqBody.tableName) {
            res.status(400).json({ error: 'invalid tableName when upateEnum' });
            return;
        }

        if (!reqBody.key) {
            res.status(400).json({ error: 'invalid key when updateEnum' });
            return;
        }

        if (!reqBody.value) {
            res.status(400).json({ error: 'invalid value when updateEnum' });
            return;
        }

        const postOptions = {
            method: 'post',
            body: reqBody,
            json: true,
            url: dataDomain + 'enumconfig/update'
        };
        asyncRequest(postOptions, function (err, response, body) {
            if (err) {
                res.status(500).json({ error: err });
                return;
            }

            if (response.statusCode !== 200) {
                // Forward the error in body.
                res.status(response.statusCode).json(body);
                return;
            }

            if (!body) {
                res.status(500).json({ error: err });
                return;
            }

            res.json(body);
        });
    },
    getTableRecords: function (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when getTableRecords' });
            return;
        }
        const reqBody = req.body;

        if (!reqBody.tableName) {
            res.status(400).json({ error: 'invalid tableName when getTableRecords' });
            return;
        }
        const tableName = reqBody.tableName;

        const getOptions = {
            method: 'get',
            json: true,
            url: dataDomain + tableName + '/getlist'
        };
        asyncRequest(getOptions, function (err, response, body) {
            if (err) {
                res.status(500).json({ error: err });
                return;
            }

            if (response.statusCode !== 200) {
                res.status(response.statusCode).json({
                    error: 'cannot getTableRecords', errorDetail: response
                });
                return;
            }
            res.json(body);

            const recordTableHistoryReq = {
                id: req.userId,
                historyTable: tableName,
                time: new Date()
            };

            common.recordTableHistory(recordTableHistoryReq, function (recordResult) {
                if (!recordResult) {
                    winston.warn('the table history is not saved and will not show in the use dashboard');
                }
            });
        });
    },
    getEntry: function (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when getEntry' });
            return;
        }
        const reqBody = req.body;

        if (!reqBody.tableName) {
            res.status(400).json({ error: 'invalid tableName when getEntry' });
            return;
        }
        reqBody.userId = req.userId;

        const tableName = reqBody.tableName;

        const postOptions = {
            method: 'post',
            body: reqBody,
            json: true,
            url: dataDomain + tableName + '/get'
        };
        asyncRequest(postOptions, function (err, response, body) {
            if (err) {
                res.status(500).json({ error: err });
                return;
            }

            if (response.statusCode !== 200) {
                res.status(response.statusCode).json({ error: 'gateway: cannot get', detail: response.body });
                return;
            }

            if (!body) {
                res.status(500).json({ error: 'gateway: cannot get, empty body' });
                return;
            }
            res.json(body);

            const recordTableHistoryReq = {
                id: req.userId,
                historyTable: tableName,
                time: new Date()
            };
            if (tableName === 'home') {
                return;
            }
            common.recordTableHistory(recordTableHistoryReq, function (recordResult) {
                if (!recordResult) {
                    winston.warn('the table history is not saved and will not show in the use dashboard');
                }
            });
        });
    },
    createEntry: function (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when createEntry' });
            return;
        }
        const reqBody = req.body;

        if (!reqBody.tableName) {
            res.status(400).json({ error: 'invalid tableName when createEntry' });
            return;
        }

        reqBody.userId = req.userId;
        reqBody.createdBy = req.userId;
        reqBody.updatedBy = req.userId;

        const tableName = reqBody.tableName;

        const postOptions = {
            method: 'post',
            body: reqBody,
            json: true,
            url: dataDomain + tableName + '/create'
        };

        asyncRequest(postOptions, function (err, response, body) {
            if (err) {
                res.status(500).json({ error: err });
                return;
            }

            if (response.statusCode !== 200) {
                res.status(response.statusCode).json({ error: 'gateway: cannot create', detail: response.body });
                return;
            }

            if (!body) {
                res.status(500).json({ error: 'gateway: cannot create, empty body' });
                return;
            }

            res.json(body);

            const recordTableHistoryReq = {
                id: req.userId,
                historyTable: tableName,
                time: new Date()
            };
            common.recordTableHistory(recordTableHistoryReq, function (recordResult) {
                if (!recordResult) {
                    winston.warn('the table history is not saved and will not show in the use dashboard');
                }
            });
            const dataLogEntry = {
                userId: req.userId,
                actionType: 'createEntry',
                tableName: tableName,
                entryId: body.id,
                detail: JSON.stringify(reqBody)
            };
            common.recordDataLog(dataLogEntry, function (recordDataLogResult) {
                if (!recordDataLogResult) {
                    winston.warn('the dataLog is not saved and will not show in the db');
                }
            });
        });
    },
    insertTableEntries: function (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when insertTableEntries' });
            return;
        }
        const reqBody = req.body;

        if (!reqBody.tableName) {
            res.status(400).json({ error: 'invalid tableName when insertTableEntries' });
            return;
        }

        const tableName = reqBody.tableName;
        const resultRows = [];

        if (!reqBody.list || !reqBody.list.length) {
            res.status(400).json({ error: 'invalid list when insertTableEntries' });
            return;
        }

        const limit = 1;
        async.eachLimit(reqBody.list, limit, function (entry, callback) {
            const currResult = { data: entry, success: false };
            entry.userId = req.userId;
            entry.createdBy = req.userId;
            entry.updatedBy = req.userId;
            const postOptions = {
                method: 'post',
                body: entry,
                json: true,
                url: dataDomain + tableName + '/create'
            };
            asyncRequest(postOptions, function (err, response, body) {
                if (err) {
                    callback();
                    return;
                }

                if (response.statusCode === 403) {
                    callback();
                    return;
                }

                if (response.statusCode !== 200 || !body) {
                    callback();
                    return;
                }

                currResult.success = true;
                callback();

                const recordTableHistoryReq = {
                    id: req.userId,
                    historyTable: tableName,
                    time: new Date()
                };
                common.recordTableHistory(recordTableHistoryReq, function (recordResult) {
                    if (!recordResult) {
                        winston.warn('the table history is not saved and will not show in the use dashboard');
                    }
                });
                const dataLogEntry = {
                    userId: req.userId,
                    actionType: 'insertEntries',
                    tableName: tableName,
                    entryId: body.id,
                    detail: JSON.stringify(entry)
                };
                common.recordDataLog(dataLogEntry, function (recordDataLogResult) {
                    if (!recordDataLogResult) {
                        winston.warn('the dataLog is not saved and will not show in the db');
                    }
                });
            });
            resultRows.push(currResult);
        }, function (err) {
            // if any of the file processing produced an error, err would equal that error
            if (err) {
                // One of the iterations produced an error.
                console.log('An entry failed to process');
                res.status(500).json({ error: err });
            } else {
                res.status(200).json({ result: resultRows });
            }
        });
    },
    editTableEntries: function (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when editTableEntries' });
            return;
        }
        const reqBody = req.body;

        if (!reqBody.tableName) {
            res.status(400).json({ error: 'invalid tableName when editTableEntries' });
            return;
        }

        const tableName = reqBody.tableName;

        const resultRows = [];

        if (!reqBody.list || !reqBody.list.length) {
            res.status(400).json({ error: 'invalid list when editTableEntries' });
            return;
        }

        async.each(reqBody.list, function (entry, callback) {
            const currResult = { data: entry, success: false };

            entry.userId = req.userId;
            entry.updatedBy = req.userId;
            const postOptions = {
                method: 'post',
                body: entry,
                json: true,
                url: dataDomain + tableName + '/update'
            };
            asyncRequest(postOptions, function (err, response, body) {
                if (err) {
                    callback();
                    return;
                }

                if (response.statusCode === 403) {
                    callback();
                    return;
                }

                if (response.statusCode !== 200 || !body) {
                    callback();
                    return;
                }
                currResult.success = true;
                callback();

                const recordTableHistoryReq = {
                    id: req.userId,
                    historyTable: tableName,
                    time: new Date()
                };
                common.recordTableHistory(recordTableHistoryReq, function (recordResult) {
                    if (!recordResult) {
                        winston.warn('the table history is not saved and will not show in the use dashboard');
                    }
                });
                const dataLogEntry = {
                    userId: req.userId,
                    actionType: 'updateEntries',
                    tableName: tableName,
                    entryId: entry.id,
                    detail: JSON.stringify(entry)
                };
                common.recordDataLog(dataLogEntry, function (recordDataLogResult) {
                    if (!recordDataLogResult) {
                        winston.warn('the dataLog is not saved and will not show in the db');
                    }
                });
            });
            resultRows.push(currResult);
        }, function (err) {
            // if any of the file processing produced an error, err would equal that error
            if (err) {
                // One of the iterations produced an error.
                console.log('An entry failed to process');
                res.status(500).json({ error: err });
            } else {
                res.status(200).json({ result: resultRows });
            }
        });
    },
    updateEntry: function (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when updateEntry' });
            return;
        }
        const reqBody = req.body;

        if (!reqBody.tableName) {
            res.status(400).json({ error: 'invalid tableName when updateEntry' });
            return;
        }
        const tableName = reqBody.tableName;
        reqBody.userId = req.userId;
        reqBody.updatedBy = req.userId;

        const postOptions = {
            method: 'post',
            body: reqBody,
            json: true,
            url: dataDomain + tableName + '/update'
        };
        asyncRequest(postOptions, function (err, response, body) {
            if (err) {
                res.status(500).json({ error: err });
                return;
            }

            if (response.statusCode === 403) {
                res.status(response.statusCode).json({ error: 'gateway: update conflict', detail: response });
                return;
            }

            if (response.statusCode !== 200) {
                res.status(response.statusCode).json({ error: 'gateway: cannot update', detail: response });
                return;
            }

            if (!body) {
                res.status(500).json({ error: 'gateway: cannot update, empty body' });
                return;
            }
            res.json(body);

            if (tableName === 'home') {
                return;
            }

            const recordTableHistoryReq = {
                id: req.userId,
                historyTable: tableName,
                time: new Date()
            };
            common.recordTableHistory(recordTableHistoryReq, function (recordResult) {
                if (!recordResult) {
                    winston.warn('the table history is not saved and will not show in the use dashboard');
                }
            });
            const dataLogEntry = {
                userId: req.userId,
                actionType: 'updateEntry',
                tableName: tableName,
                entryId: reqBody.id,
                detail: JSON.stringify(reqBody)
            };
            common.recordDataLog(dataLogEntry, function (recordDataLogResult) {
                if (!recordDataLogResult) {
                    winston.warn('the dataLog is not saved and will not show in the db');
                }
            });
        });
    },
    submitQuery: function (req, res) {
        /** @namespace reqBody.queryExpression */
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when submitQuery' });
            return;
        }
        const reqBody = req.body;
        if (reqBody.id === null || reqBody.queryExpression == null) {
            res.status(400).json({ error: 'Requires query ID and expression' });
            return;
        }

        const getOptions = {
            method: 'get',
            body: reqBody,
            json: true,
            url: dataDomain + 'query/' + reqBody.id
        };
        asyncRequest(getOptions, function (err, response, body) {
            if (err) {
                res.status(500).json({ Error: err });
                return;
            }

            if (response.statusCode !== 200) {
                if (response.body.error === 'Invalid query.') {
                    res.status(500).json({ error: 'Invalid query.' });
                } else {
                    res.status(response.statusCode).json({ error: 'error from SQL server', detail: response });
                }
                return;
            }

            if (!body) {
                res.status(500).json({ error: 'gateway: empty body from query result' });
                return;
            }
            res.json(body);
            const dataLogEntry = {
                userId: req.userId,
                actionType: 'runQuery',
                tableName: 'query',
                detail: reqBody.queryExpression
            };
            common.recordDataLog(dataLogEntry, function (recordDataLogResult) {
                if (!recordDataLogResult) {
                    winston.warn('the dataLog is not saved and will not show in the db');
                }
            });
        });
    },
    deleteEntry: function (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload' });
            return;
        }
        const reqBody = req.body;

        if (!reqBody.tableName) {
            res.status(400).json({ error: 'invalid tableName' });
            return;
        }
        const tableName = reqBody.tableName;

        if (!req.userId) {
            res.status(400).json({ error: 'invalid user id' });
            return;
        }

        if (!(reqBody.id || reqBody.plasmidId)) {
            res.status(400).json({ error: 'invalid id for delete' });
            return;
        }

        const postOptions = {
            method: 'post',
            body: reqBody,
            json: true,
            url: dataDomain + tableName + '/delete'
        };
        asyncRequest(postOptions, function (err, response, body) {
            if (err) {
                res.status(500).json({ error: err });
                return;
            }

            if (response.statusCode !== 200) {
                res.status(response.statusCode).json({ error: 'gateway: cannot delete', response: response });
                return;
            }

            if (!body) {
                res.status(500).json({ error: 'gateway: cannot delete, empty body' });
                return;
            }

            res.json(body);

            const recordTableHistoryReq = {
                id: req.userId,
                historyTable: tableName,
                time: new Date()
            };
            common.recordTableHistory(recordTableHistoryReq, function (recordResult) {
                if (!recordResult) {
                    winston.warn('the table history is not saved and will not show in the use dashboard');
                }
            });
            const dataLogEntry = {
                userId: req.userId,
                actionType: 'deleteEntry',
                tableName: tableName,
                entryId: reqBody.id,
                detail: JSON.stringify(reqBody)
            };
            common.recordDataLog(dataLogEntry, function (recordDataLogResult) {
                if (!recordDataLogResult) {
                    winston.warn('the dataLog is not saved and will not show in the db');
                }
            });
        });
    },
    searchTableEntriesByColumn: function (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when searchTableEntriesByColumn' });
            return;
        }
        const reqBody = req.body;

        if (!reqBody.tableName) {
            res.status(400).json({ error: 'invalid tableName when searchTableEntriesByColumn' });
            return;
        }

        const tableName = reqBody.tableName;
        const postOptions = {
            method: 'post',
            body: reqBody,
            json: true,
            url: dataDomain + tableName + '/searchByColumn'
        };
        asyncRequest(postOptions, function (err, response, body) {
            if (err) {
                res.status(500).json({ error: err });
                return;
            }

            if (response.statusCode !== 200) {
                res.status(response.statusCode).json({
                    error: 'gateway: cannot searchTableEntriesByColumn',
                    detail: response.body.error
                });
                return;
            }

            if (!body) {
                res.status(500).json({ error: 'gateway: cannot searchTableEntriesByColumn, empty body' });
                return;
            }

            res.json(body);

            const recordTableHistoryReq = {
                id: req.userId,
                historyTable: tableName,
                time: new Date()
            };
            common.recordTableHistory(recordTableHistoryReq, function (recordResult) {
                if (!recordResult) {
                    winston.warn('the table history is not saved and will not show in the use dashboard');
                }
            });
        });
    },
    getNameMappings: function (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when getNameMappings' });
            return;
        }
        const reqBody = req.body;

        if (!reqBody.tableName) {
            res.status(400).json({ error: 'invalid tableName when getNameMappings' });
            return;
        }

        const getOptions = {
            method: 'get',
            json: true,
            url: dataDomain + reqBody.tableName + '/getmapping'
        };
        asyncRequest(getOptions, function (err, response, body) {
            if (err) {
                res.status(500).json({ error: err });
                return;
            }

            if (response.statusCode !== 200) {
                res.status(response.statusCode).json({
                    error: 'gateway: cannot getNameMappings',
                    detail: response.body.error
                });
                return;
            }

            if (!body) {
                res.status(500).json({ error: 'gateway: cannot getNameMappings, empty body' });
                return;
            }
            res.json(body);
        });
    },
    searchByProject: function (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when searchByProject' });
            return;
        }
        const reqBody = req.body;

        if (!reqBody.tableName) {
            res.status(400).json({ error: 'invalid tableName when searchByProject' });
            return;
        }

        const postOptions = {
            method: 'post',
            body: reqBody,
            json: true,
            url: dataDomain + reqBody.tableName + '/searchByProject'
        };
        asyncRequest(postOptions, function (err, response, body) {
            if (err) {
                res.status(500).json({ error: err });
                return;
            }

            if (response.statusCode !== 200) {
                res.status(response.statusCode).json({
                    error: 'gateway: cannot searchByProject',
                    detail: response.body.error
                });
                return;
            }

            if (!body) {
                res.status(500).json({ error: 'gateway: cannot searchByProject, empty body' });
                return;
            }

            res.json(body);
        });
    },
    helperAPI: function (req, res) {
        const apiName = req.params.name;

        const forwardOptions = {
            method: req.method,
            body: req.body,
            json: true,
            url: helperAPI + apiName,
            strictSSL: false
        };
        asyncRequest(forwardOptions, function (err, response, body) {
            if (err) {
                res.status(500).json({ error: err });
                return;
            }
            res.status(response.statusCode).json(body);
        });
    },
    seqUtilsAPI: function (req, res) {
        const apiName = req.params[0];

        const forwardOptions = {
            method: req.method,
            body: req.body,
            json: true,
            url: seqUtilsAPI.url + apiName,
            strictSSL: false,
            headers: { 'Authorization': seqUtilsAPI.key }
        };
        asyncRequest(forwardOptions, function (err, response, body) {
            if (err) {
                res.status(500).json({ error: err });
                return;
            }
            res.status(response.statusCode).json(body);
        });
    }
};
