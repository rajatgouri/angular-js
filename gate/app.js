'use strict';

/**
 * Module dependencies.
 */
const express = require('express');
const config = require('./config/config');
const winston = require('./config/winston');
const passport = require('./config/passport');

winston.info('Starting ' + config.app.name + '...');
winston.info('Config loaded: ' + config.NODE_ENV);
winston.debug('Accepted Config:', config);

global.__base = __dirname + '/';

const app = express();

// Load Express config
require('./config/express')(app, passport);

// Start the app by listening on <port>
app.listen(config.PORT, config.IP);
winston.info('Express app started on port ' + config.PORT);

// Login/Logout Routes
app.get('/loginaad', passport.authenticate('azureadlogin', {
    successRedirect: '/',
    failureFlash: true
}));
app.post('/loginldap', function (req, res, next) {
    if (config.testMode) {
        return res.status(200).json({ status: 'success' });

    } else {
        passport.authenticate('ldapauth', { failureFlash: true }, function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({ status: info });
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.status(200).json({ status: 'success' });
            });
        })(req, res, next);
    }
    
});
app.get('/signout', function (req, res) {
    req.logout();
    return res.send({ status: 'success', message: 'User logout successfully.' });
});

const check = require('./config/middlewares/authCheck');
const user = require('./routes/user');
app.get('/status', check.IsAuthenticated, user.status);
app.get('/getuser', check.IsAuthenticated, user.getCurrentUser);
app.get('/getCompleteUserList', check.IsAuthenticated, user.getCompleteUserList);

const email = require('./routes/email');
app.post('/getEmail', check.IsAuthenticated, email.getEmail);
app.get('/getCompleteEmailList', check.IsAuthenticated, email.getCompleteEmailList);


const admin = require('./routes/admin');
app.post('/edituser', check.IsAdmin, admin.editUser);
app.post('/deleteUser', check.IsAdmin, admin.deleteUser);
app.get('/getuserlist', check.IsAdmin, admin.getUserList);
app.get('/getRoleList', check.IsAdmin, admin.getRoleList);
app.post('/updateRole', check.IsAdmin, admin.updateRole);
app.post('/deleteRole', check.IsAdmin, admin.deleteRole);
app.post('/createRole', check.IsAdmin, admin.createRole);
app.post('/associateRole', check.IsAdmin, admin.associateRole);

const data = require('./routes/data');
// General
app.post('/getTableEntries', check.IsAuthenticated, data.getTableRecords);
app.post('/getEntry', check.IsAuthenticated, data.getEntry);
app.post('/createEntry', check.IsAuthenticated, data.createEntry);
app.post('/deleteEntry', check.IsAuthenticated, data.deleteEntry);
app.post('/updateEntry', check.IsAuthenticated, data.updateEntry);

// Bulk data endpoints
app.post('/insertTableEntries', check.IsAuthenticated, data.insertTableEntries);
app.post('/updateEntries', check.IsAuthenticated, data.editTableEntries);

// Search and helpers
app.post('/searchTableEntriesByColumn', check.IsAuthenticated, data.searchTableEntriesByColumn);
app.post('/getNameMappings', check.IsAuthenticated, data.getNameMappings);
app.post('/searchByProject', check.IsAuthenticated, data.searchByProject);
// Other
app.post('/getEnumForManyTable', check.IsAuthenticated, data.getEnumForManyTable);
app.post('/updateEnum', check.IsAuthenticated, data.updateEnum);
app.post('/submitQuery', check.IsAuthenticated, data.submitQuery);
app.get('/helper/:name', check.IsAuthenticated, data.helperAPI);
app.post('/helper/:name', check.IsAuthenticated, data.helperAPI);
app.get('/seqUtils/*', check.IsAuthenticated, data.seqUtilsAPI);
app.post('/seqUtils/*', check.IsAuthenticated, data.seqUtilsAPI);

// File routes
const file = require('./routes/file');
app.post('/uploadFile', check.IsAuthenticated, file.uploadFile);
app.post('/downloadFile', check.IsAuthenticated, file.downloadFile);
app.get('/viewFile/:id/*', check.IsAuthenticated, file.viewFile);

// expose app
module.exports = app;
