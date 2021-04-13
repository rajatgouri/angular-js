'use strict';

module.exports = function (sequelize, DataTypes) {
    const CLDHarvest = sequelize.define('CLDHarvest', {
        // Lot Number Yes Integer  sequential generation - CLD-0001
        name: DataTypes.STRING,

        cellLineExperimentId: {
            type: DataTypes.INTEGER,
            unique: true
        },
        // Sample Name Yes String N/A created from CLD Tfxn above
        wellName: DataTypes.STRING,
        // Fed Batch ID number - Int created every time check box is clicked
        FedbatchID: DataTypes.INTEGER,
        // Harvest Date Yes Datetime Date picker
        harvestDate: DataTypes.DATE,
        // Length of Culture Yes  Calculated harvest date - inoculation date
        // Harvest Method Yes String Checkboxes tickyboxes - pick what is needed
        ENUM_harvestMethod: DataTypes.STRING,
        // Harvest Day VCD Yes Integer Number
        harvestDayVCD: DataTypes.FLOAT,
        // Harvest Day Viability Yes Integer
        harvestDayViability: DataTypes.FLOAT,
        // Titer Yes Integer Number
        titer: DataTypes.FLOAT,
        // Titer Method Yes String Dropdown
        ENUM_titerMethod: DataTypes.STRING,
        // Approve for Purification Yes  Checkboxes
        approveForPurification: DataTypes.ENUM('Yes', 'No'),

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

    CLDHarvest.associate = function (models) {
        models.CLDHarvest.belongsTo(models.CellLineExperiment, {
            as: 'experiment',
            foreignKey: 'cellLineExperimentId',
            targetKey: 'id'
        });
        models.CLDHarvest.hasOne(models.CellLinePurification, {
            foreignKey: 'cLDHarvestId',
            targetKey: 'id'
        });
        models.CLDHarvest.hasOne(models.CellLinePurificationData, {
            foreignKey: 'cellLineHarvestId',
            targetKey: 'id'
        });
        models.CLDHarvest.hasMany(models.CellExpansion, { foreignKey: 'cellLineHarvestId', targetKey: 'id' });
        models.CLDHarvest.hasMany(models.CellLineExperiment, {
            as: 'minipool',
            foreignKey: 'minipoolReference',
            targetKey: 'id',
            constraints: false
        });
        models.CLDHarvest.hasMany(models.Bioreactor, { foreignKey: 'cellLineHarvestId', targetKey: 'id' });
    };

    return CLDHarvest;
};
