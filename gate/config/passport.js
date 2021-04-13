'use strict';

const passport = require('passport');
const config = require('./config');
const graphHelper = require('./graphHelper');
const winston = require('./winston');
const asyncRequest = require('request');
const fs = require('fs');

// These are different types of authentication strategies that can be used with Passport.
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const LdapStrategy = require('passport-ldapauth');
const ldapOptions = config.ldap;
const azureadOptions = config.azuread;

// Parse CA Certificate if tls is enabled, needed for active directory
if (ldapOptions.server && ldapOptions.server.sslCert) {
    ldapOptions.server.tlsOptions = {
        ca: [fs.readFileSync(ldapOptions.server.sslCert)]
    };
}

// Passport serialize and deserialize
passport.serializeUser(function (result, done) {
    const user = result.user;
    const permissions = result.permissions;
    done(null, { id: user.id, displayName: user.displayName, updatedAt: user.updatedAt, permissions: permissions });
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use('azureadlogin',
    new OIDCStrategy(azureadOptions, function (iss, sub, profile, accessToken, refreshToken, done) {
        winston.info('verifying the user');
        // winston.info(accessToken, 'was the token retreived');
        graphHelper.getUserData(accessToken, (err, msuser) => {
            if (!err) {
                const reqBody = {
                    type: 'azuread',
                    data: msuser.body
                };
                const loginOptions = {
                    method: 'post',
                    body: reqBody,
                    json: true,
                    url: config.domain.user + 'saveuser'
                };
                asyncRequest(loginOptions, function (err, response, body) {
                    if (err) {
                        console.log('AdLogin error:', err.message);
                        done(err);
                        return;
                    }

                    if (response.statusCode !== 200) {
                        done('err when getting users');
                        return;
                    }

                    if (!body) {
                        done('err when getting users');
                        return;
                    }

                    const getUserOptions = {
                        method: 'post',
                        body: { id: body.id, perms: true },
                        json: true,
                        url: config.domain.user + 'getuser'
                    };

                    asyncRequest(getUserOptions, function (err, response, body) {
                        if (err) {
                            console.log('AdLogin error:', err.message);
                            done(err);
                            return;
                        }

                        if (response.statusCode !== 200) {
                            done('err when getting users');
                            return;
                        }

                        if (!body) {
                            done('err when getting users');
                            return;
                        }
                        return done(null, body);
                    });
                });
            } else {
                return done(err);
            }
        });
    })
);

passport.use('ldapauth',
    new LdapStrategy(ldapOptions, function (user, done) {
        winston.info('user ' + user.userPrincipalName + ' verified');
        if (!user.userPrincipalName) {
            return done();
        }
        const reqBody = {
            type: 'ldap',
            data: user
        };

        const loginOptions = {
            method: 'post',
            body: reqBody,
            json: true,
            url: config.domain.user + 'saveuser'
        };
        asyncRequest(loginOptions, function (err, response, body) {
            if (err) {
                console.log('AdLogin error:', err.message);
                done(err);
                return;
            }

            if (response.statusCode !== 200) {
                done('err when getting users');
                return;
            }

            if (!body) {
                done('err when getting users');
                return;
            }

            const getUserOptions = {
                method: 'post',
                body: { id: body.id, perms: true },
                json: true,
                url: config.domain.user + 'getuser'
            };

            asyncRequest(getUserOptions, function (err, response, body) {
                if (err) {
                    console.log('AdLogin error:', err.message);
                    done(err);
                    return;
                }

                if (response.statusCode !== 200) {
                    done('err when getting users');
                    return;
                }

                if (!body) {
                    done('err when getting users');
                    return;
                }
                return done(null, body);
            });
        });
    })
);

module.exports = passport;
