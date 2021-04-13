'use strict';

const Sequelize = require('sequelize');
const _ = require('lodash');
const config = require('./config');
const winston = require('./winston');

const db = {};
winston.info('Initializing Sequelize...');
const sequelize = new Sequelize(config.db.name, config.db.username, config.db.password, {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql',
    storage: config.db.storage,
    logging: config.enableSequelizeLog === 'true' ? winston.verbose : false
});

// invoke associations on each of the models
Object.keys(db).forEach(function (modelName) {
    if (db[modelName].options.hasOwnProperty('associate')) {
        db[modelName].options.associate(db);
    }
});

// Synchronizing any model changes with database.
// set FORCE_DB_SYNC=true in the environment, or the program parameters to drop the database,
//   and force model changes into it, if required;
// Caution: Do not set FORCE_DB_SYNC to true for every run to avoid losing data with restarts
sequelize
    .sync({
        force: config.FORCE_DB_SYNC === 'true',
        logging: config.enableSequelizeLog === 'true' ? winston.verbose : false
    })
    .then(function () {
        winston.info('Database ' + (config.FORCE_DB_SYNC === 'true' ? '*DROPPED* and ' : '') + 'synchronized');
    }).catch(function (err) {
        winston.error('An error occurred: ', err);
    });

// assign the sequelize variables to the db object and returning the db.
module.exports = _.extend({
    sequelize: sequelize,
    Sequelize: Sequelize
}, db);
