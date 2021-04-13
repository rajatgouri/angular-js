'use strict';

const express = require('express');
const router = express.Router();
const common = require('../common');

const model = 'ViCellData';

const getListCriteria = {
    attributes: ['id', 'sampleId', 'cellType', 'runDate', 'viableCells', 'viability', 'totalViableCellsPerMl', 'dilution', 'totalCellsPerMl', 'averageDiameter']
};

router.post('/get', common.getEntry(model));
router.get('/getlist', common.getList(model, 'viCellData', getListCriteria));

module.exports = router;
