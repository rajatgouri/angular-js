/*
** This file is the route for the data_service model for all parts of Accounting
**      to the User Interface.
**
*/

'use strict';

const express = require('express');
const router = express.Router();
const common = require('../common');

const model = 'ProcurifyStatements';


const getListCriteria = {
    where: { isDeleted: false },
    attributes: {
        include: [
             `OrderID`, `LineNumber`, `Requester`, `SubmittedDate`, `LastModified`,
             `RecievedDate`, `POID`,`PurchasedDate`, `ApprovalDate`, `Approver`, `DueDate`,
             `InvoiceDate`, `Vendor`, `Item`, `SKU`, `Quantity`, `Unit`, `UnitCost`,
             `Currency`, `LineCost`, `Status`,`Location`, `LocationID`, `Department`,
             `DepartmentID`, `AccountCode`, `AccountDescription`, `Note`, 'External_ID',
             'Project', 'AdditionalProjects', 'isDeleted' 
        ]
    }
};

router.post('/get', common.getEntry(model));
router.post('/create', common.createEntry(model));
router.post('/update', common.updateEntry(model));
router.get('/getlist', common.getList(model, 'ProcurifyStatements', getListCriteria));
router.get('/getmapping', common.getNameMapping(model));

module.exports = router;