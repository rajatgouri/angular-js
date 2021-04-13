'use strict';

const asyncRequest = require('request');
const config = require(global.__base + 'config/config');
const userDomain = config.domain.user;
const os = require('os');

module.exports = {
    status: function (req, res) {
        const reqBody = {
            id: config.testMode ? 1 : req.userId,
            perms: true
        };
        const getUserOptions = {
            method: 'post',
            body: reqBody,
            json: true,
            url: userDomain + 'getuser'
        };

        asyncRequest(getUserOptions, function (err, response, body) {
            if (err) {
                res.status(404).json({ error: err });
                return;
            }

            if (response.statusCode !== 200) {
                res.status(response.statusCode).json({ error: 'cannot get user' });
                return;
            }

            if (!body) {
                res.status(404).json({ error: 'cannot get user. please check DB.' });
                return;
            }
            body.info = {
                helperAPI: config.helperAPI ? config.helperAPI : 'http://127.0.0.1:5000',
                os: os.type(),
                env: config.NODE_ENV,
                hostname: os.hostname()
            };
            res.json(body);
        });
    },
    getCurrentUser: function (req, res) {
        const reqBody = {
            id: req.userId
        };
        const getUserOptions = {
            method: 'post',
            body: reqBody,
            json: true,
            url: userDomain + 'getuser'
        };
        asyncRequest(getUserOptions, function (err, response, body) {
            if (err) {
                res.status(404).json({ error: err });
                return;
            }

            if (response.statusCode !== 200) {
                res.status(response.statusCode).json({ error: 'cannot get user' });
                return;
            }

            if (!body) {
                res.status(404).json({ error: 'cannot get user. please check DB.' });
                return;
            }
            res.json(body);
        });
    },
    getCompleteUserList: function (req, res) {
        const getOptions = {
            method: 'get',
            json: true,
            url: userDomain + 'getCompleteUserList'
        };
        asyncRequest(getOptions, function (err, response, body) {
            if (err) {
                res.status(500).json({ error: err });
                return;
            }

            if (response.statusCode !== 200) {
                res.status(response.statusCode).json({ error: 'cannot get user list' });
                return;
            }

            if (!body) {
                res.status(500).json({ error: 'no response body' });
                return;
            }
            res.json(body);
        });
    }
};
