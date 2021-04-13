'use strict';

const express = require('express');
const router = express.Router();
const common = require('../common');

const model = 'CloningAndSequence';

router.post('/get', common.getEntry(model));
router.post('/create', common.createEntry(model, 'CS'));
router.post('/update', common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'cloningandsequences'));
router.get('/getmapping', common.getNameMapping(model));

module.exports = router;
