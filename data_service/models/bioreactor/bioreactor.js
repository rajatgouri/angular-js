'use strict';

module.exports = function (sequelize, DataTypes) {
    const Bioreactor = sequelize.define('Bioreactor', {
        // Bioreactor ID
        name: DataTypes.STRING,
        // Experiment
        bioreactorExperimentId: DataTypes.INTEGER,
        // Harvest
        cellLineHarvestId: DataTypes.INTEGER,
        // Cell Expansion Data (passage)
        cellPassageId: DataTypes.INTEGER,
        // Clone Notes
        cloneNotes: DataTypes.STRING,
        // Condition
        bioreactorConditionId: DataTypes.INTEGER,
        // HCF Titer
        hcfTiter: DataTypes.FLOAT,
        // HCF Volume
        hcfVolume: DataTypes.FLOAT,
        // Harvest Method
        ENUM_harvestMethod: DataTypes.STRING,
        // Variable
        variable: DataTypes.STRING,
        // Primary Recovery
        ENUM_primaryRecovery: DataTypes.STRING,
        // Graph Properties
        ENUM_pointStyle: DataTypes.STRING,
        ENUM_lineColor: DataTypes.STRING,
        // Approved for Purification
        approved: {
            type: DataTypes.ENUM('No', 'Yes'),
            defaultValue: 'No'
        },
        // Notes
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

    Bioreactor.associate = function (models) {
        models.Bioreactor.belongsTo(models.BioreactorExperiment, {
            foreignKey: 'bioreactorExperimentId',
            targetKey: 'id'
        });
        models.Bioreactor.belongsTo(models.CLDHarvest, {
            foreignKey: 'cellLineHarvestId',
            targetKey: 'id'
        });
        models.Bioreactor.belongsTo(models.CellExpansionData, {
            foreignKey: 'cellPassageId',
            targetKey: 'id'
        });
        models.Bioreactor.belongsTo(models.BioreactorCondition, {
            foreignKey: 'bioreactorConditionId',
            targetKey: 'id'
        });
        models.Bioreactor.hasMany(models.BioreactorChemData, {
            foreignKey: 'bioreactorId',
            targetKey: 'id'
        });
        models.Bioreactor.hasMany(models.BioreactorChemDataImport, {
            foreignKey: 'bioreactorId',
            targetKey: 'id'
        });
        models.Bioreactor.hasMany(models.BioreactorVCDData, {
            foreignKey: 'bioreactorId',
            targetKey: 'id'
        });
        models.Bioreactor.belongsToMany(models.BioreactorPurification, {
            through: {
                model: models.BioreactorPurificationMapping,
                // Created unique keys in mappings table because of length bug
                unique: false
            },
            foreignKey: 'bioreactorId',
            otherKey: 'bioreactorPurificationId'
        });
        models.Bioreactor.hasMany(models.ColumnPurificationData, {
            foreignKey: 'bioreactorId',
            targetKey: 'id'
        });
    };

    return Bioreactor;
};
