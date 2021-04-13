/*
**  This is the module holds the data from the Bank of America table in the database
**      table name is BoaStatements
**
*/

'use strict';

module.exports = function (sequelize, DataTypes) {
    const BoaStatements = sequelize.define('BoaStatements', {
        // Name
        PurchaseDate: DataTypes.DATE,
        Description: DataTypes.STRING,
        Amount: DataTypes.FLOAT,
        Department: DataTypes.STRING,
        ItemType: DataTypes.STRING,
        PONumber: DataTypes.INTEGER,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    });

    return BoaStatements;
};
