'use strict';

module.exports = function (sequelize, DataTypes) {
    const HumanizationTransfection = sequelize.define('HumanizationTransfection', {
        // specific
        name: DataTypes.STRING,
        // Transfection # String
        // Well Rescue Name Integer (foreign key) Well Rescue Table
        wellRescueId: {
            type: DataTypes.INTEGER,
            references: { model: 'WellRescues', key: 'id' }
        },
        // Project ID Integer Well Rescue/Research Protein
        // Heavy Chain Plasmid String Humanization Plasmids
        heavyChainHumanizationPlasmidId: DataTypes.INTEGER,
        // Heavy Chain Plasmid String Discovery Plasmids
        heavyChainDiscoveryPlasmidId: DataTypes.INTEGER,
        // Light Chain Plasmid String Humanization Plasmids
        lightChainHumanizationPlasmidId: DataTypes.INTEGER,
        // Light Chain Plasmid String Discovery Plasmids
        lightChainDiscoveryPlasmidId: DataTypes.INTEGER,
        // Chain Version String Humanization Plasmids
        // Harvest Concentration (ug/mL) Double Humanization Plasmids
        harvestConcentration: DataTypes.DOUBLE,
        // Harvest Date Date Date Picker
        harvestDate: DataTypes.DATE,
        // Notes String
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

    HumanizationTransfection.associate = function (models) {
        models.HumanizationTransfection.belongsTo(models.HumanizationPlasmid, {
            as: 'heavyChainHumanizationPlasmid',
            foreignKey: 'heavyChainHumanizationPlasmidId',
            targetKey: 'id'
        });
        models.HumanizationTransfection.belongsTo(models.HumanizationPlasmid, {
            as: 'lightChainHumanizationPlasmid',
            foreignKey: 'lightChainHumanizationPlasmidId',
            targetKey: 'id'
        });
        models.HumanizationTransfection.belongsTo(models.DiscoveryPlasmid, {
            as: 'heavyChainDiscoveryPlasmid',
            foreignKey: 'heavyChainDiscoveryPlasmidId',
            targetKey: 'id'
        });
        models.HumanizationTransfection.belongsTo(models.DiscoveryPlasmid, {
            as: 'lightChainDiscoveryPlasmid',
            foreignKey: 'lightChainDiscoveryPlasmidId',
            targetKey: 'id'
        });
        models.HumanizationTransfection.belongsTo(models.WellRescue, {
            foreignKey: 'wellRescueId',
            targetKey: 'id'
        });
    };

    return HumanizationTransfection;
};
