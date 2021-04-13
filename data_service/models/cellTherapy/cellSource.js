'use strict';

module.exports = function (sequelize, DataTypes) {
    const CellSource = sequelize.define('CellSource', {
        // Name
        name: DataTypes.STRING,
        vendor: DataTypes.STRING,
        // Eg. Blood, T-Cells
        orderType: DataTypes.STRING,
        orderNumber: DataTypes.STRING,
        cost: DataTypes.FLOAT,
        deliveryDate: DataTypes.DATE,
        deliveryMethod: DataTypes.STRING,
        diversionPouchCollection: DataTypes.STRING,
        virologyLookUp: DataTypes.STRING,
        purchaseOrder: DataTypes.STRING,
        preparedBy: DataTypes.STRING,
        pickedUpBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        // common
        createdBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        references: DataTypes.TEXT,
        properties: DataTypes.TEXT,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    CellSource.associate = function (models) {
        models.CellSource.hasMany(models.Donor, {
            foreignKey: 'cellSourceId',
            targetKey: 'id'
        });
    };

    return CellSource;
};
