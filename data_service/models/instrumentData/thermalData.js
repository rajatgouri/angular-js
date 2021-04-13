'use strict';

module.exports = function (sequelize, DataTypes) {
    const ThermalData = sequelize.define('ThermalData', {
        // Protein Purification
        proteinPurificationId: DataTypes.INTEGER,
        bioreactorPurificationId: DataTypes.INTEGER,
        cellLinePurificationId: DataTypes.INTEGER,
        proteinAnalysisId: DataTypes.INTEGER,
        pdAnalysisId: DataTypes.INTEGER,
        type: DataTypes.ENUM('Single', 'Multiple'),
        // Measurements
        analysisMode: DataTypes.STRING,
        TmD: DataTypes.DOUBLE,
        Tm2: DataTypes.DOUBLE,
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

    ThermalData.associate = function (models) {
        models.ThermalData.belongsTo(models.ProteinPurification, {
            foreignKey: 'proteinPurificationId',
            sourceKey: 'id'
        });
        models.ThermalData.belongsTo(models.ProteinAnalytics, {
            foreignKey: 'proteinAnalysisId',
            sourceKey: 'id'
        });
        models.ThermalData.belongsTo(models.PDAnalytics, {
            foreignKey: 'pdAnalysisId',
            sourceKey: 'id'
        });
        models.ThermalData.belongsTo(models.CellLinePurification, {
            foreignKey: 'cellLinePurificationId',
            sourceKey: 'id'
        });
        models.ThermalData.belongsTo(models.BioreactorPurification, {
            foreignKey: 'bioreactorPurificationId',
            sourceKey: 'id'
        });
    };

    return ThermalData;
};
