'use strict';

module.exports = function (sequelize, DataTypes) {
    const SECData = sequelize.define('SECData', {
        proteinPurificationId: DataTypes.INTEGER,
        cellLinePurificationId: DataTypes.INTEGER,
        bioreactorPurificationId: DataTypes.INTEGER,
        proteinAnalysisId: DataTypes.INTEGER,
        pdAnalysisId: DataTypes.INTEGER,
        // Type, proA, etc.
        type: DataTypes.STRING,
        // SEC Date
        date: DataTypes.DATE,
        // MP %
        mp: DataTypes.FLOAT,
        // HMW %
        hmw: DataTypes.FLOAT,
        // LMW %
        lmw: DataTypes.FLOAT,
        // Analyzed By
        analyzedBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        instrument: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    SECData.associate = function (models) {
        SECData.belongsTo(models.CLAnalytics, { foreignKey: 'cellLineAnalyticId', sourceKey: 'id' });
        SECData.belongsTo(models.BioreactorAnalytics, {
            foreignKey: 'bioreactorAnalyticId',
            sourceKey: 'id'
        });
        SECData.belongsTo(models.ProteinPurification, {
            foreignKey: 'proteinPurificationId',
            sourceKey: 'id'
        });
        SECData.belongsTo(models.ProteinAnalytics, {
            foreignKey: 'proteinAnalysisId',
            sourceKey: 'id'
        });
        SECData.belongsTo(models.PDAnalytics, {
            foreignKey: 'pdAnalysisId',
            sourceKey: 'id'
        });
        SECData.belongsTo(models.CellLinePurification, {
            foreignKey: 'cellLinePurificationId',
            sourceKey: 'id'
        });
        SECData.belongsTo(models.BioreactorPurification, {
            foreignKey: 'bioreactorPurificationId',
            sourceKey: 'id'
        });
    };

    return SECData;
};
