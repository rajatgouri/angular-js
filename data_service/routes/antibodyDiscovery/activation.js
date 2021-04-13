'use strict';

const express = require('express');
const router = express.Router();
const common = require('../common');
const db = require(global.__base + 'config/sequelize');
const winston = require(global.__base + 'config/winston');

const model = 'Activation';

router.post('/get', common.getEntry(model));
router.get('/getlist', common.getList(model, 'activations'));
router.post('/create', common.createEntry(model, 'A'));
router.post('/update', common.updateEntry(model));
router.post('/delete', deleteActivation);
router.get('/getmapping', common.getNameMapping(model));

function deleteActivation (req, res) {
    if (!req.body || !req.body.id) {
        res.status(500).json({ error: 'delete fail, must provide activation id' });
        return;
    }
    const activation = db.Activation.update({ isDeleted: true }, { where: { id: req.body.id } });
    const sorts = db.Sort.update({ isDeleted: true }, { where: { activationId: req.body.id } });
    const bcs = db.BCellSource.update({ isDeleted: true }, { where: { activationId: req.body.id } });
    const mcs = db.MixCondition.update({ isDeleted: true }, { where: { activationId: req.body.id } });
    // Find all BCC plates associated with sort.
    const plates = db.Sort.findAll({
        where: { activationId: req.body.id },
        include: [{
            model: db.BCCPlate
        }]
    }).then(sorts => {
        sorts.map(sort => {
            if (sort.id) {
                db.BCCPlate.update({ isDeleted: true }, { where: { sortId: sort.id } });
            }
        });
    });
    Promise.all([activation, sorts, bcs, mcs, plates]).then(result => {
        res.status(200).json({ message: 'deleted' });
    }, err => {
        winston.error('delete activation failed', err);
        res.status(500).json({ error: err });
    });
}
module.exports = router;
