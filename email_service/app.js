'use strict';

/**
 * Module dependencies.
 */
const express = require('express');
const bodyParser = require('body-parser');
// Load Configurations
const config = require('./config/config');
const winston = require('./config/winston');

winston.info('Starting ' + config.app.name + '...');
winston.info('Config loaded: ' + config.NODE_ENV);
winston.debug('Accepted Config:', config);

global.__base = __dirname + '/';
const app = express();
app.use(bodyParser.json());

const emails = require('./routes/emails');
app.use('/emails', emails);
app.post('/getEmail',emails.getEmail());
app.get('/getCompleteEmailList', emails.getCompleteEmailList());


// Start the app by listening on <port>
app.listen(config.PORT, config.IP);
winston.info('Express app started on port ' + config.PORT);

// expose app
module.exports = app;
