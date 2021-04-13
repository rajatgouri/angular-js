'use strict';

const config = require('./../config');
const session = require('express-session');
const db = require('./../sequelize');
const SequelizeStore = require('express-sequelize-session')(session.Store);

const settings = {
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore(db.sequelize),
    cookie: { maxAge: 1000 * 3600 * 24 * 7 }, // remember for 7 days
    secret: config.expressSessionSecret
};
// if (config.NODE_ENV === 'production')
//   settings.cookie.secure = true;

const sessionMiddleware = session(settings);

module.exports = sessionMiddleware;
