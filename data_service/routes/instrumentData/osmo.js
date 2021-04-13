'use strict';

const express = require('express');
const router = express.Router();
const common = require('../common');

const model = 'OsmoData';

router.post('/get', common.getEntry(model));
router.get('/getlist', common.getList(model, 'osmoData', { order: [['id', 'desc']] }));

module.exports = router;
