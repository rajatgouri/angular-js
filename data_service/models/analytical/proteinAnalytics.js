'use strict';

// Research
module.exports = function (sequelize, DataTypes) {
    const ProteinAnalytics = sequelize.define('ProteinAnalytics', {
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

    ProteinAnalytics.associate = function (models) {
        models.ProteinAnalytics.belongsToMany(models.ProteinPurification, {
            through: {
                model: models.ProteinAnalyticsMapping,
                // Created unique keys in mappings table because of length bug
                unique: false
            },
            foreignKey: 'proteinAnalysisId',
            otherKey: 'proteinPurificationId'
        });
        models.ProteinAnalytics.hasMany(models.CESDSData, {
            foreignKey: 'proteinAnalysisId',
            sourceKey: 'id'
        });
        models.ProteinAnalytics.hasMany(models.ThermalData, {
            foreignKey: 'proteinAnalysisId',
            sourceKey: 'id'
        });
        models.ProteinAnalytics.hasMany(models.SECData, {
            foreignKey: 'proteinAnalysisId',
            sourceKey: 'id'
        });
    };

    return ProteinAnalytics;
};
