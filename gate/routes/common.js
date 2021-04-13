'use strict';

const asyncRequest = require('request');
const config = require(global.__base + 'config/config');
const dataDomain = config.domain.data;
const userDomain = config.domain.user;

module.exports = {
    recordTableHistory: function recordTableHistory (reqBody, callback) {
        if (!reqBody) {
            return callback(null);
        }

        if (!reqBody.id) {
            return callback(null);
        }

        if (!reqBody.historyTable) {
            return callback(null);
        }
        if (!reqBody.time) {
            return callback(null);
        }

        const editUserOptions = {
            method: 'post',
            body: reqBody,
            json: true,
            url: userDomain + 'updateuser'
        };
        asyncRequest(editUserOptions, function (err, response, body) {
            if (response.statusCode !== 200) {
                return callback(null);
            }

            if (err) {
                return callback(null);
            }

            if (!body) {
                return callback(null);
            }

            return callback(body);
        });
    },
    recordDataLog: function recordDataLog (reqBody, callback) {
        if (!reqBody) {
            return callback(null);
        }

        if (!reqBody.userId) {
            return callback(null);
        }
        if (!reqBody.tableName) {
            return callback(null);
        }
        if (!reqBody.actionType) {
            return callback(null);
        }

        const postOptions = {
            method: 'post',
            body: reqBody,
            json: true,
            url: dataDomain + 'datalog/create'
        };
        asyncRequest(postOptions, function (err, response, body) {
            if (response.statusCode !== 200) {
                return callback(null);
            }

            if (err) {
                return callback(null);
            }

            if (!body) {
                return callback(null);
            }

            return callback(body);
        });
    }
};
