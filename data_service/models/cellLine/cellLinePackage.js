'use strict';

module.exports = function (sequelize, DataTypes) {
    const CellLinePackage = sequelize.define('CellLinePackage', {
        // Notes
        notes: DataTypes.TEXT,

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

    CellLinePackage.associate = function (models) {
        models.CellLinePackage.hasMany(models.CellLinePurificationData, {
            foreignKey: 'cellLinePackageId',
            targetKey: 'id'
        });
    };

    return CellLinePackage;
};
