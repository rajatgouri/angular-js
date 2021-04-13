/*
** This file is the route for the data_service model for all parts of Accounting
**      to the User Interface.
**
*/

'use strict';

const express = require('express');
const router = express.Router();
const common = require('../common');

const model = 'AccountingStatements';


const getListCriteria = {
    where: { isDeleted: false },
    attributes: {
        include: [
             'PONumber', `PurchaseDate`, `Description`, `Amount`, `Department`, `ItemType`, `Projects`, 'NumOfProjects', `isDeleted`
        ]
    }
};

router.post('/get', common.getEntry(model));
router.post('/create', common.createEntry(model));
router.post('/update', common.updateEntry(model));
router.get('/getlist', common.getList(model, 'AccountingStatements', getListCriteria));
router.get('/getmapping', common.getNameMapping(model));

module.exports = router;
