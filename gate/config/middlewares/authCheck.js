'use strict';

const config = require('../../config/config')

module.exports = {
    IsAuthenticated: function (req, res, next) {
        if(config.testMode) {
            req.userId = 1;
            next(); 
        } else {
            if (req.user && req.user.id) {
                req.userId = req.user.id;
                next();
            } else {
                return res.status(403).send('Not authenticated');
            }
        }

        
    },
    IsAdmin: function (req, res, next) {
        if (req.user && req.user.permissions) {
            if (req.user.permissions.includes('adminUser')) {
                next();
            }
        } else {
            return res.status(403).send('Not authorized');
        }
    }
};
