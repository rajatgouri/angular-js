
router.forgotPassword = function (User) {
    return function (req, res) {
        if (!req.body) {
            res.status(400).json({error: 'Empty payload when forgot password'});
            return;
        }
        var reqBody = req.body;

        if (!reqBody.email) {
            res.status(400).json({error: 'invalid email id when forgot password'});
            return;
        }
        var email = reqBody.email;

        async.waterfall([
            function (done) {
                crypto.randomBytes(20, function (err, buf) {
                    var token = buf.toString('hex');
                    console.log("token is: " + token);
                    done(err, token);
                });
            },
            function (token, done) {
                var option = {};
                option['resetPasswordToken'] = token;
                option['resetPasswordExpires'] = Date.now() + 3600000; // 1 hour

                db.User.update(
                    option,
                    {
                        where: {email: email}
                    })
                    .then(function (result) {
                        done(null, token, result[0]);
                    }, function (rejectedPromiseError) {
                        //TODO : proper status code
                        done(rejectedPromiseError);
                    });

            },
            function (token, user, done) {
                // create reusable transporter object using SMTP transport
                var transporter = nodemailer.createTransport({
                    service: 'hotmail',
                    auth: {
                        user: 'wali_customer@hotmail.com',
                        pass: 'Xsharp@2015'
                    }
                });

                // No need to recreate the transporter object. You can use
                // the same transporter object for all e-mails
                console.log("the email to be sent: " + email);
                var mailOptions = {
                    to: email,
                    from: 'wali_customer@hotmail.com',
                    subject: 'Wali Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your wali account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        forgotEmailDomain + '#/page/newpassword/' + token + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        res.json({error: error});
                        return;
                    }
                    console.log('Message sent: ' + info.response);
                    done(null);
                });
            }
        ], function (err) {
            if (err) {
                res.json({error: err});
                return;
            }
            console.log('Email is sent successfully.');
            res.json({isEmailSent: true});
            return;
        });
    }
};

router.updatePassword = function (User) {
    return function (req, res) {
        console.log("enter updatePassword, user:", User);
        var token = req.params.token;
        if (!token) {
            res.status(400).json({error: 'invalid token when update password'});
            return;
        }

        async.waterfall([
            function (done) {
                db.User.find({where: {resetPasswordToken: token}}).then(function (user) {
                    if (!user) {
                        winston.warn('the searched user id not in database, user possibly deleted post-login');
                        res.status(404).json({error: 'User Not Found'});
                        return;
                    }

                    var option = {};

                    // ww:TODO: Make sure this hashed password is the same as create user, which didn't use bCrypt.
                    //option['hashedPassword'] = bCrypt.hashSync(req.body.password, bCrypt.genSaltSync(10), null);
                    option['salt'] = crypto.randomBytes(16).toString('base64');
                    var salt = new Buffer(option['salt'], 'base64');
                    option['hashedPassword'] = crypto.pbkdf2Sync(req.body.password, salt, 10000, 64).toString('base64');

                    option['resetPasswordToken'] = null;
                    option['resetPasswordExpires'] = Date.now(); // 1 hour


                    console.log("option:", option);

                    db.User.update(
                        option,
                        {
                            where: {resetPasswordToken: token}
                        })
                        .then(function (result) {
                            done(null, user);
                            res.status(200).json({status: 'Password updated'});
                        }, function (rejectedPromiseError) {
                            //TODO : proper status code
                            done(rejectedPromiseError);
                        });
                }).catch(function (err) {
                    console.log("err:", err);
                    res.status(404).json({error: 'User Not Found'});
                    return;
                });
            },
            function (user, done) {
                // create reusable transporter object using SMTP transport
                var transporter = nodemailer.createTransport({
                    service: 'hotmail',
                    auth: {
                        user: 'wali_customer@hotmail.com',
                        pass: 'Xsharp@2015'
                    }
                });

                var mailOptions = {
                    to: user.email,
                    from: 'wali_customer@hotmail.com',
                    subject: 'Your password has been changed',
                    text: 'Hello,\n\n' +
                        'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                });

            }
        ], function (err) {
            res.redirect('/');
        });
    }
};
router.getUserMap = function () {
    return function (req, res) {

        if (!req.body) {
            res.status(400).json({error: 'Empty payload when get user'});
            return;
        }
        var reqBody = req.body;

        if (!reqBody.userList) {
            res.status(400).json({error: 'invalid user list when get users\' id'});
            return;
        }

        var insertionList = reqBody.userList;
        var userList = [];
        var userMap = undefined;
        var userNameMap = undefined;
        var success = 0;

        var retievedUser = {};
        //TODO(ww): Use config file.
        var userData = 'grant_type=password&resource=https://graph.windows.net&client_id=8db4d61c-dc38-472c-bd90-a7fad248917e&username=usertest@systimmune.com&password=Vonu7010';
        var retrieveTokenUrl = "https://login.microsoftonline.com/23dbe9a7-1846-4202-8c96-b3091f272842/oauth2/token";
        var retrieveTokenOptions = {
            method: 'post',
            body: userData,
            url: retrieveTokenUrl,
            headers: { //We can define headers too
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }
        asyncRequest(retrieveTokenOptions, function (retrieveTokenErr, retrieveTokenResponse, retrieveTokenBody) {
            if (retrieveTokenResponse.statusCode !== 200 || retrieveTokenErr) {
                res.status(500).json({error: 'cannot retrive the azure ad token'});
                return;
            }
            retievedUser = JSON.parse(retrieveTokenBody);

            if (!retievedUser.access_token) {
                res.status(500).json({error: 'cannot retrive the azure ad token'});
                return;
            }
            var getUserDetailOptions = {
                method: 'get',
                url: 'https://graph.windows.net/systimmuneinc.onmicrosoft.com/users?api-version=2013-04-05',
                headers: { //We can define headers too
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + retievedUser.access_token
                }
            }

            asyncRequest(getUserDetailOptions, function (getUserDetailErr, getUserDetailResponse, getUserDetailBody) {
                var retievedUserDetail = JSON.parse(getUserDetailBody);
                userList = retievedUserDetail.value;
                userMap = {};
                userNameMap = {};
                for (var i = 0; i < insertionList.length; i++) {
                    getUserId(insertionList[i]);
                }

            });
        });

        var getUserId = function (userName) {
            var lastName = userName.substring(1);
            var userDetail = {};
            for (var i = 0; i < userList.length; i++) {
                if ((userList[i]['surname']) && userList[i]['surname'].toLowerCase() == lastName.toLowerCase()) {
                    userDetail = userList[i];
                    break;
                }
            }
            if (!userDetail.mail) {
                success++;
            }
            db.User.find({where: {displayName: userDetail.displayName}}).then(function (user) {
                if (user) {
                    userMap[userName] = user.id;
                    userNameMap[userName] = user.displayName;
                    console.log(user.id);
                    success++;
                } else {
                    if (userDetail.mail) {
                        var user = {};
                        user['firstName'] = userDetail.givenname;
                        user['lastName'] = userDetail.surname;
                        user['email'] = userDetail.mail;
                        user['username'] = userDetail.mail;
                        user['provider'] = "AzureAD";
                        user['role'] = userDetail.objectType;
                        user['isDeleted'] = false;
                        user['displayName'] = userDetail.displayName;
                        user['mailNickname'] = userDetail.mailNickname;

                        db.User.create(user).then(function (createdUser) {
                            db.User.find({where: {displayName: userDetail.displayName}}).then(function (user) {
                                userMap[userName] = user.id;
                                userNameMap[userName] = user.displayName;
                                console.log("second find", user.id);
                                success++;
                            });
                        }, function (rejectedPromiseError) {
                            res.status(500).json({error: 'Create User Failed. Please check db'});
                            return;
                        });
                    }
                }
            });
        };

        var waitTime = 0;
        var waitForGettingUsers = function () {
            if (success == insertionList.length) {
                res.status(200).json({message: "ok", userMap: userMap, userNameMap: userNameMap});
                return;
            }
            waitTime += 100;
            if (waitTime > 10000) {
                res.status(500).json({message: "timeout waiting getting user list"});
                return;
            }

            setTimeout(waitForGettingUsers, 100);

        };
        waitForGettingUsers();
    }
};