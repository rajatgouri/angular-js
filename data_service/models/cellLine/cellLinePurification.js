'use strict';

module.exports = function (sequelize, DataTypes) {
    const CellLinePurification = sequelize.define('CellLinePurification', {
        name: DataTypes.STRING,
        // specific
        cLDHarvestId: DataTypes.INTEGER,
        // Purification Date Yes Datetime Date Picker
        purificationDate: DataTypes.DATE,
        // Purified By Yes Foreign Key  Dropdown
        purifiedBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        // Notes Yes Text Text Area
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
        references: DataTypes.TEXT,
        properties: DataTypes.TEXT,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    CellLinePurification.associate = function (models) {
        models.CellLinePurification.belongsTo(models.CLDHarvest, { foreignKey: 'cLDHarvestId', targetKey: 'id' });
        models.CellLinePurification.hasOne(models.CLAnalytics, {
            foreignKey: 'cellLinePurificationId',
            targetKey: 'id'
        });
        CellLinePurification.belongsToMany(models.PDAnalytics, {
            through: {
                model: models.PDAnalyticsMapping,
                // Created unique keys in mappings table because of length bug
                unique: false
            },
            foreignKey: 'pdAnalysisId',
            otherKey: 'cellLinePurificationId'
        });
        models.CellLinePurification.hasMany(models.ColumnPurificationData, {
            foreignKey: 'cellLinePurificationId',
            targetKey: 'id'
        });
        models.CellLinePurification.hasMany(models.AcidTreatmentData, {
            foreignKey: 'cellLinePurificationId',
            targetKey: 'id'
        });
        models.CellLinePurification.hasMany(models.MembranePurificationData, {
            foreignKey: 'cellLinePurificationId',
            targetKey: 'id'
        });
        models.CellLinePurification.hasMany(models.ThermalData, {
            foreignKey: 'cellLinePurificationId',
            sourceKey: 'id'
        });
        models.CellLinePurification.hasMany(models.CESDSData, {
            foreignKey: 'cellLinePurificationId',
            sourceKey: 'id'
        });
        models.CellLinePurification.hasMany(models.cIEFData, {
            foreignKey: 'cellLinePurificationId',
            sourceKey: 'id'
        });
        models.CellLinePurification.hasMany(models.SECData, {
            foreignKey: 'cellLinePurificationId',
            sourceKey: 'id'
        });
        models.CellLinePurification.hasMany(models.DLSData, {
            foreignKey: 'cellLinePurificationId',
            sourceKey: 'id'
        });
        models.CellLinePurification.hasMany(models.IntactMassData, {
            foreignKey: 'cellLinePurificationId',
            sourceKey: 'id'
        });
    };

    return CellLinePurification;
};
