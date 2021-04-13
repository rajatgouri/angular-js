'use strict';

const asyncRequest = require('request');
const config = require(global.__base + 'config/config');
const userDomain = config.domain.user;

module.exports = {
    editUser (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when edit user' });
            return;
        }
        const reqBody = req.body;

        if (!reqBody.id) {
            res.status(400).json({ error: 'invalid user id when edit user' });
            return;
        }
        const editUserOptions = {
            method: 'post',
            body: reqBody,
            json: true,
            url: userDomain + 'updateuser'
        };
        asyncRequest(editUserOptions, function (err, response, body) {
            if (response.statusCode !== 200) {
                res.status(response.statusCode).json({ error: 'cannot edit user' });
                return;
            }

            if (err) {
                res.status(404).json({ error: err });
                return;
            }

            if (!body) {
                res.status(404).json({ error: 'cannot edit user' });
                return;
            }

            res.json(body);
        });
    },
    deleteUser (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when edit user' });
            return;
        }
        const reqBody = req.body;

        if (!reqBody.id) {
            res.status(400).json({ error: 'invalid user id when edit user' });
            return;
        }

        const deleteUserOptions = {
            method: 'post',
            body: reqBody,
            json: true,
            url: userDomain + 'deleteUser'
        };
        asyncRequest(deleteUserOptions, function (err, response, body) {
            if (response.statusCode !== 200) {
                res.status(response.statusCode).json({ error: 'cannot delete user' });
                return;
            }

            if (err) {
                res.status(500).json({ error: err });
                return;
            }

            if (!body) {
                res.status(500).json({ error: 'cannot delete user' });
                return;
            }

            res.json(body);
        });
    },
    getUserList (req, res) {
        const getOptions = {
            url: userDomain + 'getuserlist',
            json: true,
            method: 'get'
        };
        asyncRequest(getOptions, function (err, response, body) {
            if (err) {
                res.status(500).json({ error: err });
                return;
            }

            if (response.statusCode !== 200) {
                res.status(response.statusCode).json({ error: 'cannot get user list' });
                return;
            }

            if (!body) {
                res.status(500).json({ error: 'cannot get user list' });
                return;
            }

            res.json(body);
        });
    },
    getRoleList (req, res) {
        const getOptions = {
            url: userDomain + 'getrolelist',
            json: true,
            method: 'get'
        };
        asyncRequest(getOptions, function (err, response, body) {
            if (err) {
                res.status(500).json({ error: err });
                return;
            }

            if (response.statusCode !== 200) {
                res.status(response.statusCode).json({ error: 'cannot get role list' });
                return;
            }

            if (!body) {
                res.status(500).json({ error: 'cannot get role list' });
                return;
            }

            res.json(body);
        });
    },
    deleteRole (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when delete role' });
            return;
        }
        const reqBody = req.body;

        if (!reqBody.id) {
            res.status(400).json({ error: 'invalid role id when delete role' });
            return;
        }

        const options = {
            method: 'post',
            body: reqBody,
            json: true,
            url: userDomain + 'deleteRole'
        };
        asyncRequest(options, function (err, response, body) {
            if (response.statusCode !== 200) {
                res.status(response.statusCode).json({ error: 'cannot delete role' });
                return;
            }

            if (err) {
                res.status(500).json({ error: err });
                return;
            }

            if (!body) {
                res.status(500).json({ error: 'cannot delete role' });
                return;
            }

            res.json(body);
        });
    },
    updateRole (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when edit role' });
            return;
        }
        const reqBody = req.body;

        if (!reqBody.id) {
            res.status(400).json({ error: 'invalid role id when edit role' });
            return;
        }

        const options = {
            method: 'post',
            body: reqBody,
            json: true,
            url: userDomain + 'updateRole'
        };
        asyncRequest(options, function (err, response, body) {
            if (response.statusCode !== 200) {
                res.status(response.statusCode).json({ error: 'cannot edit role' });
                return;
            }

            if (err) {
                res.status(404).json({ error: err });
                return;
            }

            if (!body) {
                res.status(404).json({ error: 'cannot edit role' });
                return;
            }

            res.json(body);
        });
    },
    createRole (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload when create role' });
            return;
        }
        const reqBody = req.body;

        const options = {
            method: 'post',
            body: reqBody,
            json: true,
            url: userDomain + 'createRole'
        };
        asyncRequest(options, function (err, response, body) {
            if (response.statusCode !== 200) {
                res.status(response.statusCode).json({ error: 'cannot create role' });
                return;
            }

            if (err) {
                res.status(404).json({ error: err });
                return;
            }

            if (!body) {
                res.status(404).json({ error: 'cannot create role' });
                return;
            }

            res.json(body);
        });
    },
    associateRole (req, res) {
        if (!req.body) {
            res.status(400).json({ error: 'Empty payload' });
        }
        const reqBody = req.body;
        let path;
        if (reqBody.type === 'add') {
            path = 'addRoleAssociation';
        } else if (reqBody.type === 'remove') {
            path = 'removeRoleAssociation';
        } else {
            res.status(400).json({ error: 'Need add or remove for the type' });
        }

        const options = {
            method: 'post',
            body: reqBody,
            json: true,
            url: userDomain + path
        };

        asyncRequest(options, function (err, response, body) {
            if (response.statusCode !== 200) {
                res.status(response.statusCode).json({ error: 'cannot associate role' });
                return;
            }

            if (err) {
                res.status(404).json({ error: err });
                return;
            }

            if (!body) {
                res.status(404).json({ error: 'cannot associate role' });
                return;
            }

            res.json(body);
        });
    }
};
