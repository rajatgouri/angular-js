'use strict';

module.exports = function (sequelize, DataTypes) {
    const BioreactorPurification = sequelize.define('BioreactorPurification', {
        // Experiment Name
        name: DataTypes.STRING,
        // Purification Date
        purificationDate: DataTypes.DATE,
        // Purified By
        purifiedBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        // Status
        status: DataTypes.STRING,
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

    BioreactorPurification.associate = function (models) {
        models.BioreactorPurification.belongsToMany(models.Bioreactor, {
            through: {
                model: models.BioreactorPurificationMapping,
                // Created unique keys in mappings table because of length bug
                unique: false
            },
            foreignKey: 'bioreactorPurificationId',
            otherKey: 'bioreactorId'
        });
        models.BioreactorPurification.belongsToMany(models.PDAnalytics, {
            through: {
                model: models.PDAnalyticsMapping,
                // Created unique keys in mappings table because of length bug
                unique: false
            },
            foreignKey: 'pdAnalysisId',
            otherKey: 'bioreactorPurificationId'
        });
        models.BioreactorPurification.hasMany(
            models.ColumnPurificationData,
            { foreignKey: 'bioreactorPurificationId', targetKey: 'id' }
        );
        models.BioreactorPurification.hasMany(
            models.AcidTreatmentData,
            { foreignKey: 'bioreactorPurificationId', targetKey: 'id' }
        );
        models.BioreactorPurification.hasMany(
            models.MembranePurificationData,
            { foreignKey: 'bioreactorPurificationId', targetKey: 'id' }
        );
        models.BioreactorPurification.hasMany(
            models.UFDFData,
            { foreignKey: 'bioreactorPurificationId', targetKey: 'id' }
        );
        models.BioreactorPurification.hasMany(
            models.BioreactorAnalytics,
            {
                foreignKey: 'bioreactorPurificationId', targetKey: 'id'
            });
        models.BioreactorPurification.hasMany(models.ThermalData, {
            foreignKey: 'bioreactorPurificationId',
            targetKey: 'id'
        });
        models.BioreactorPurification.hasMany(models.CESDSData, {
            foreignKey: 'bioreactorPurificationId',
            targetKey: 'id'
        });
        models.BioreactorPurification.hasMany(models.cIEFData, {
            foreignKey: 'bioreactorPurificationId',
            targetKey: 'id'
        });
        models.BioreactorPurification.hasMany(models.SECData, {
            foreignKey: 'bioreactorPurificationId',
            targetKey: 'id'
        });
        models.BioreactorPurification.hasMany(models.DLSData, {
            foreignKey: 'bioreactorPurificationId',
            targetKey: 'id'
        });
        models.BioreactorPurification.hasMany(models.IntactMassData, {
            foreignKey: 'bioreactorPurificationId',
            targetKey: 'id'
        });
    };

    return BioreactorPurification;
};
