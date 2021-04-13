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

const users = require('./routes/users');
app.use('/users', users);
app.post('/getuser', users.getUser());
app.post('/updateuser', users.updateUser());
app.post('/saveuser', users.saveUser());
app.post('/deleteUser', users.deleteUser());
app.get('/getuserlist', users.getUserList());
app.get('/getCompleteUserList', users.getCompleteUserList());

const roles = require('./routes/roles');
app.get('/getRoleList', roles.getRoleList());
app.post('/updateRole', roles.updateRole());
app.post('/deleteRole', roles.deleteRole());
app.post('/createRole', roles.createRole());
app.post('/addRoleAssociation', roles.addAssociation());
app.post('/removeRoleAssociation', roles.removeAssociation());

// Start the app by listening on <port>
app.listen(config.PORT, config.IP);
winston.info('Express app started on port ' + config.PORT);

// expose app
module.exports = app;
