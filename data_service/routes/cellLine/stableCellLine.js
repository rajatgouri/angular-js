'use strict';

const express = require('express');
const router = express.Router();
const db = require(global.__base + 'config/sequelize');
const common = require('../common');

const model = 'StableCellLine';

const getListCriteria = {
    where: { isDeleted: false },
    include: [
        {
            model: db.Plasmid,
            attributes: ['name', 'description']
        }, {
            model: db.Protein,
            attributes: ['name', 'description']
        }
    ],
    raw: true
};
const getMappingAttrs = ['id', 'name', 'proteinId'];

router.post('/get', common.getEntry(model));
router.post('/create', common.createEntry(model, 'ST'));
router.post('/update', common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'stableCellLines', getListCriteria));
router.get('/getmapping', common.getNameMapping(model, getMappingAttrs));

module.exports = router;
