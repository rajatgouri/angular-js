'use strict';

/**
 * Module dependencies.
 */
const flash = require('connect-flash');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const sessionMiddleware = require('./middlewares/session');
const config = require('./config');
const winston = require('./winston');

module.exports = function (app, passport) {
    winston.info('Initializing Express');

    if (config.NODE_ENV !== 'production') {
        app.set('showStackError', true);
    }

    // Don't use logger for test env
    if (config.NODE_ENV !== 'test') {
        app.use(logger('dev', { 'stream': winston.stream }));
    }

    // Enable jsonp
    app.enable('jsonp callback');

    // cookieParser should be above session
    app.use(cookieParser());

    // request body parsing middleware should be above methodOverride
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({
        // TODO: Check if needed
        type: function (req) {
            if (!req.headers['content-type']) { return true; }
            return req.headers['content-type'].indexOf('multipart/form-data') !== 0;
        }
    }));
    app.use(
        fileUpload({
            useTempFiles: false,
            limits: { fileSize: 50 * 1024 * 1024 } // 50 MB limit
        })
    );

    // express session configuration
    app.use(sessionMiddleware);

    // connect flash for flash messages
    app.use(flash());

    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());
    app.set('trust proxy', true);
};
