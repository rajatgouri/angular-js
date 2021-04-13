'use strict';

// Research
module.exports = function (sequelize, DataTypes) {
    const PDAnalytics = sequelize.define('PDAnalytics', {
        // PA1, PA2, ...
        name: DataTypes.STRING,
        method: DataTypes.STRING,
        // Notes TEXT
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
        // Links to PDFs
        references: DataTypes.TEXT,
        properties: DataTypes.TEXT,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    PDAnalytics.associate = function (models) {
        models.PDAnalytics.belongsToMany(models.CellLinePurification, {
            through: {
                model: models.PDAnalyticsMapping,
                // Created unique keys in mappings table because of length bug
                unique: false
            },
            foreignKey: 'pdAnalysisId',
            otherKey: 'cellLinePurificationId'
        });
        models.PDAnalytics.belongsToMany(models.BioreactorPurification, {
            through: {
                model: models.PDAnalyticsMapping,
                // Created unique keys in mappings table because of length bug
                unique: false
            },
            foreignKey: 'pdAnalysisId',
            otherKey: 'bioreactorPurificationId'
        });
        models.PDAnalytics.hasMany(models.CESDSData, {
            foreignKey: 'pdAnalysisId',
            sourceKey: 'id'
        });
        models.PDAnalytics.hasMany(models.ThermalData, {
            foreignKey: 'pdAnalysisId',
            sourceKey: 'id'
        });
        models.PDAnalytics.hasMany(models.SECData, {
            foreignKey: 'pdAnalysisId',
            sourceKey: 'id'
        });
        models.PDAnalytics.hasMany(models.IntactMassData, {
            foreignKey: 'pdAnalysisId',
            sourceKey: 'id'
        });
    };

    return PDAnalytics;
};
