'use strict';

module.exports = function (sequelize, DataTypes) {
    const ProteinAnalyticsMapping = sequelize.define('ProteinAnalyticsMapping', {
        proteinAnalysisId: {
            type: DataTypes.INTEGER,
            unique: 'purificationId_bioreactorId_unique'
        },
        proteinPurificationId: {
            type: DataTypes.INTEGER,
            unique: 'purificationId_bioreactorId_unique'
        }
    });

    ProteinAnalyticsMapping.associate = function (models) {
        models.ProteinAnalyticsMapping.belongsTo(models.ProteinPurification, {
            foreignKey: 'proteinPurificationId',
            targetKey: 'id'
        });
        models.ProteinAnalyticsMapping.belongsTo(models.ProteinAnalytics, {
            foreignKey: 'proteinAnalysisId',
            targetKey: 'id'
        });
    };

    return ProteinAnalyticsMapping;
};
