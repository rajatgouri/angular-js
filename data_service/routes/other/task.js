'use strict';

const express = require('express');
const router = express.Router();
const common = require('../common');

const model = 'Task';

router.post('/get', common.getEntry(model));
router.post('/create', common.createEntry(model));
router.post('/update', common.updateEntry(model));
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'Task'));
router.get('/getmapping', common.getNameMapping(model));

module.exports = router;
