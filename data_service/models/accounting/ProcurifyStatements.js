/*
**  This is the module holds the data from the Procurify table in the database
**      table name is ProcurifyStatement
**
*/

'use strict';

module.exports = function (sequelize, DataTypes) {
    const ProcurifyStatements = sequelize.define('ProcurifyStatements', {
        // Name -- change to match procurify table
        OrderID: DataTypes.INTEGER,
        LineNumber: DataTypes.INTEGER,
        
        Requester: DataTypes.STRING,
        SubmittedDate: DataTypes.DATE,
        LastModified: DataTypes.DATE,
        RecievedDate: DataTypes.DATE,
        POID: DataTypes.INTEGER,
        PurchasedDate: DataTypes.DATE,
        ApprovalDate: DataTypes.DATE,
        Approver: DataTypes.STRING,
        DueDate: DataTypes.DATE,
        InvoiceDate: DataTypes.DATE,
        Vendor: DataTypes.STRING,
        Item: DataTypes.STRING,
        SKU: DataTypes.STRING,
        Quantity: DataTypes.INTEGER,
        Unit: DataTypes.STRING,
        UnitCost: DataTypes.FLOAT,
        Currency: DataTypes.STRING,
        LineCost: DataTypes.FLOAT,
        Status: DataTypes.STRING,
        Location: DataTypes.STRING,
        LocationID: DataTypes.INTEGER,
        Department: DataTypes.STRING,
        DepartmentID: DataTypes.INTEGER,
        AccountCode: DataTypes.STRING,
        AccountDescription: DataTypes.STRING,
        Note: DataTypes.STRING,
        External_ID: DataTypes.STRING,
        Project: DataTypes.STRING,
        AdditionalProjects: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
        
    });


    return ProcurifyStatements;
};
