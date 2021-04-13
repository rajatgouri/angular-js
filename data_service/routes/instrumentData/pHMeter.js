'use strict';

const express = require('express');
const router = express.Router();
const common = require('../common');

const model = 'pHData';

const getListCriteria = {
    attributes: ['id', 'SampleId', 'InstrumentFriendlyName', 'PcDateTime', 'Result', 'ResultUnit', 'MethodId', 'Status'],
    order: [['id', 'desc']]
};

router.post('/get', common.getEntry(model));
router.get('/getlist', common.getList(model, 'phData', getListCriteria));

module.exports = router;
