'use strict';

module.exports = function (sequelize, DataTypes) {
    const ProteinPurification = sequelize.define('ProteinPurification', {
        name: DataTypes.STRING,
        transfectionId: DataTypes.INTEGER,
        BEX: DataTypes.ENUM('Y', 'N'),
        finalConcentration: DataTypes.FLOAT,
        finalVolume: DataTypes.FLOAT,
        volumeRemaining: DataTypes.FLOAT,
        notes: DataTypes.TEXT,

        purificationDate: DataTypes.DATE,
        purifiedBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },

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

    ProteinPurification.associate = function (models) {
        ProteinPurification.belongsTo(models.Transfection, {
            foreignKey: 'transfectionId',
            sourceKey: 'id'
        });
        ProteinPurification.hasMany(models.ProteinAnalysisRequest, {
            foreignKey: 'proteinPurificationId',
            sourceKey: 'id'
        });
        ProteinPurification.hasMany(models.SECData, {
            foreignKey: 'proteinPurificationId',
            sourceKey: 'id'
        });
        ProteinPurification.hasMany(models.ColumnPurificationData, {
            foreignKey: 'proteinPurificationId',
            sourceKey: 'id'
        });
        ProteinPurification.hasMany(models.DLSData, {
            foreignKey: 'proteinPurificationId',
            sourceKey: 'id'
        });
        ProteinPurification.hasMany(models.MALSData, {
            foreignKey: 'proteinPurificationId',
            sourceKey: 'id'
        });
        ProteinPurification.hasMany(models.cIEFData, {
            foreignKey: 'proteinPurificationId',
            sourceKey: 'id'
        });
        ProteinPurification.hasMany(models.CESDSData, {
            foreignKey: 'proteinPurificationId',
            sourceKey: 'id'
        });
        ProteinPurification.hasMany(models.ThermalData, {
            foreignKey: 'proteinPurificationId',
            sourceKey: 'id'
        });
        ProteinPurification.hasMany(models.BindingData, {
            foreignKey: 'purificationId',
            sourceKey: 'id'
        });
        ProteinPurification.hasMany(models.IntactMassData, {
            foreignKey: 'proteinPurificationId',
            sourceKey: 'id'
        });
        ProteinPurification.belongsToMany(models.ProteinAnalytics, {
            through: {
                model: models.ProteinAnalyticsMapping,
                // Created unique keys in mappings table because of length bug
                unique: false
            },
            foreignKey: 'proteinAnalysisId',
            otherKey: 'proteinAnalysisId'
        });
    };

    return ProteinPurification;
};
