'use strict';

module.exports = function (sequelize, DataTypes) {
    const DLSData = sequelize.define('DLSData', {
        // Protein Purification
        proteinPurificationId: DataTypes.INTEGER,
        cellLinePurificationId: DataTypes.INTEGER,
        bioreactorPurificationId: DataTypes.INTEGER,
        // Measurements
        diameter: DataTypes.FLOAT,
        pd: DataTypes.FLOAT, // Percentage
        molecularWeight: DataTypes.FLOAT,
        aggregate: DataTypes.FLOAT,
        meltingTemp: DataTypes.FLOAT,

        // common
        analyzedBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        date: DataTypes.DATE,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    DLSData.associate = function (models) {
        models.DLSData.belongsTo(models.ProteinPurification, {
            foreignKey: 'proteinPurificationId',
            sourceKey: 'id'
        });
        models.DLSData.belongsTo(models.CellLinePurification, {
            foreignKey: 'cellLinePurificationId',
            sourceKey: 'id'
        });
        models.DLSData.belongsTo(models.BioreactorPurification, {
            foreignKey: 'bioreactorPurificationId',
            sourceKey: 'id'
        });
    };

    return DLSData;
};
