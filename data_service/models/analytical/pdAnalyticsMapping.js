'use strict';

module.exports = function (sequelize, DataTypes) {
    const PDAnalyticsMapping = sequelize.define('PDAnalyticsMapping', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        pdAnalysisId: DataTypes.INTEGER,
        cellLinePurificationId: DataTypes.INTEGER,
        bioreactorPurificationId: DataTypes.INTEGER
    }, {
        indexes: [{
            name: 'clUnique',
            unique: true,
            fields: ['pdAnalysisId', 'cellLinePurificationId']
        }, {
            name: 'bioreactorUnique',
            unique: true,
            fields: ['pdAnalysisId', 'bioreactorPurificationId']
        }]
    });

    PDAnalyticsMapping.associate = function (models) {
        models.PDAnalyticsMapping.belongsTo(models.CellLinePurification, {
            foreignKey: 'cellLinePurificationId',
            targetKey: 'id'
        });
        models.PDAnalyticsMapping.belongsTo(models.BioreactorPurification, {
            foreignKey: 'bioreactorPurificationId',
            targetKey: 'id'
        });
        models.PDAnalyticsMapping.belongsTo(models.PDAnalytics, {
            foreignKey: 'pdAnalysisId',
            targetKey: 'id'
        });
    };

    return PDAnalyticsMapping;
};
