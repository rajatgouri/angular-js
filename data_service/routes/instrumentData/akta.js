'use strict';

const express = require('express');
const router = express.Router();
const common = require('../common');

const model = 'AktaData';

router.post('/get', common.getEntry(model));
router.get('/getlist', common.getList(model, 'aktaData', {}));

module.exports = router;
