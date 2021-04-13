/*
**  This is the module holds the data from the Bank of America table in the database
**      table name is BoaStatements
**
*/

'use strict';

module.exports = function (sequelize, DataTypes) {
    const AccountingStatements = sequelize.define('AccountingStatements', {
        // Name
        PONumber: DataTypes.INTEGER,
        PurchaseDate: DataTypes.DATE,
        Description: DataTypes.STRING,
        Amount: DataTypes.FLOAT,
        Department: DataTypes.STRING,
        ItemType: DataTypes.STRING,
        Projects: DataTypes.INTEGER,
        NumOfProjects: DataTypes.INTEGER,

        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    });

    return AccountingStatements;
};
