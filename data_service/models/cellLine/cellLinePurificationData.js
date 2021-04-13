'use strict';

module.exports = function (sequelize, DataTypes, references = { model: 'Users', key: 'id' }) {
    const CellLinePurificationData = sequelize.define('CellLinePurificationData', {
        cellLineHarvestId: DataTypes.INTEGER,
        cellLinePackageId: DataTypes.INTEGER,
        yield: DataTypes.DOUBLE,
        proAHMW: DataTypes.DOUBLE,
        nPrAHMW: DataTypes.DOUBLE,
        nrCELMW: DataTypes.DOUBLE,
        rCELMW: DataTypes.DOUBLE,
        cIEF: DataTypes.ENUM('Good', 'Fine', 'Bad'),
        nglycan: DataTypes.ENUM('High', 'Moderate', 'Low'),
        // Notes Yes Text Text Area
        notes: DataTypes.TEXT,

        // common
        createdBy: {
            type: DataTypes.INTEGER,
            references: references
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

    CellLinePurificationData.associate = function (models) {
        models.CellLinePurificationData.belongsTo(models.CLDHarvest, {
            foreignKey: 'cellLineHarvestId',
            targetKey: 'id'
        });
        models.CellLinePurificationData.belongsTo(models.CellLinePackage, {
            foreignKey: 'cellLinePackageId',
            sourceKey: 'id'
        });
    };

    return CellLinePurificationData;
};
