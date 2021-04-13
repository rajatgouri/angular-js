'use strict';

/**
 * Module dependencies.
 */
const express = require('express');
const fileUpload = require('express-fileupload');
// Load Configurations
const config = require('./config/config');
const winston = require('./config/winston');
const mongoose = require('mongoose');
const mongoDriver = mongoose.mongo;
require('./config/mongoose')();

winston.info('Starting ' + config.app.name + '...');
winston.info('Config loaded: ' + config.NODE_ENV);
winston.debug('Accepted Config:', config);

global.__base = __dirname + '/';
const app = express();
app.use(fileUpload());
mongoose.connection.once('open', function () {
    app.locals.gfs = new mongoDriver.GridFSBucket(mongoose.connection.db);
});

const fileOps = require('./routes/fileOps');
app.post('/upload', fileOps.createEntry());
app.get('/download/:id', fileOps.getEntry());
app.post('/delete/:id', fileOps.deleteEntry());
const backup = require('./routes/backup');
app.get('/backupAll', backup.backupAll());

// Start the app by listening on <port>
app.listen(config.PORT, config.IP);
winston.info('Express app started on port ' + config.PORT);
module.exports = app;
