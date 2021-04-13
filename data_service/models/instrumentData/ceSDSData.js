'use strict';

module.exports = function (sequelize, DataTypes) {
    const CESDSData = sequelize.define('CESDSData', {
        // Protein Purification
        proteinPurificationId: DataTypes.INTEGER,
        pdAnalysisId: DataTypes.INTEGER,
        proteinAnalysisId: DataTypes.INTEGER,
        cellLinePurificationId: DataTypes.INTEGER,
        bioreactorPurificationId: DataTypes.INTEGER,
        type: DataTypes.ENUM('Non-Reduced', 'Reduced'),
        // Measurements
        normal: DataTypes.ENUM('Yes', 'No'),
        notes: DataTypes.TEXT,
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

    CESDSData.associate = function (models) {
        models.CESDSData.belongsTo(models.ProteinPurification, {
            foreignKey: 'proteinPurificationId',
            sourceKey: 'id'
        });
        models.CESDSData.belongsTo(models.ProteinAnalytics, {
            foreignKey: 'proteinAnalysisId',
            sourceKey: 'id'
        });
        models.CESDSData.belongsTo(models.PDAnalytics, {
            foreignKey: 'pdAnalysisId',
            sourceKey: 'id'
        });
        models.CESDSData.belongsTo(models.CellLinePurification, {
            foreignKey: 'cellLinePurificationId',
            sourceKey: 'id'
        });
        models.CESDSData.belongsTo(models.BioreactorPurification, {
            foreignKey: 'bioreactorPurificationId',
            sourceKey: 'id'
        });
    };

    return CESDSData;
};
