'use strict';

const asyncRequest = require('request');
const config = require(global.__base + 'config/config');
const emailDomain = config.domain.email;
const os = require('os');

module.exports = {
    
    getEmail: function (req, res) {
        const reqBody = {
            id: req.body.emailId
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
    getCompleteEmailList: function (req, res) {
        const getOptions = {
            method: 'get',
            json: true,
            url: emailDomain + 'getCompleteEmailList'
        };
        asyncRequest(getOptions, function (err, response, body) {

            
            if (err) {
                res.status(500).json({ error: err });
                console.log(err)
                return;
            }


            console.log(response)
            if (response.statusCode !== 200) {
                res.status(response.statusCode).json({ error: 'cannot get email list' });
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
