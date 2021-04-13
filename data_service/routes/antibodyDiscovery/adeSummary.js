'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');

router.post('/searchByProject', searchByProject);

function searchByProject (req, res) {
    const body = req.body;
    const criteria = {
        where: {
            isDeleted: false,
            projectId: body.projectId
        },
        attributes: ['id', 'name', 'date'],
        include: [{
            model: db.Sort,
            attributes: []
        }]
    };

    db.Activation.findAll(criteria).then(function (activations) {
        res.json(activations);
    }, function (rejectedPromiseError) {
        res.status(500).json({ error: rejectedPromiseError });
    });
}

module.exports = router;
