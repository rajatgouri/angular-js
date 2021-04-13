'use strict';

module.exports = function (sequelize, DataTypes) {
    const DiscoveryTransfection = sequelize.define('DiscoveryTransfection', {
        // specific
        name: DataTypes.STRING,
        // Rescue/Control Boolean
        rescueControl: DataTypes.ENUM('Rescue', 'Control'),
        // Well Rescue Name String Well Rescue
        // Control String Research Proteins
        // Well Rescue ID Integer (foreign key)
        proteinId: {
            type: DataTypes.INTEGER,
            references: { model: 'Proteins', key: 'id' }
        },
        wellRescueId: {
            type: DataTypes.INTEGER,
            references: { model: 'WellRescues', key: 'id' }
        },

        // Project ID Integer Well Rescue/Research Protein
        // Heavy Chain Plasmid String Research Protein or Discovery Plasmids
        heavyChainProteinPlasmidId: {
            type: DataTypes.INTEGER,
            references: { model: 'Plasmids', key: 'id' }
        },
        heavyChainDiscoveryPlasmidId: {
            type: DataTypes.INTEGER,
            references: { model: 'DiscoveryPlasmids', key: 'id' }
        },

        // Light Chain Plasmid String Research Protein or Discovery Plasmids
        lightChainProteinPlasmidId: {
            type: DataTypes.INTEGER,
            references: { model: 'Plasmids', key: 'id' }
        },
        lightChainDiscoveryPlasmidId: {
            type: DataTypes.INTEGER,
            references: { model: 'DiscoveryPlasmids', key: 'id' }
        },
        // Heavy Chain to add (ul) Double Discovery Plasmid: Concentration
        // heavyChainToAdd: DataTypes.DOUBLE,
        // Light Chain to add (ul) Double Discovery Plasmid: Concentration
        // lightChainToAdd: DataTypes.DOUBLE,
        // Harvest Concentration (ug/mL) Double
        harvestConcentration: DataTypes.DOUBLE,
        // Harvest Date Date Date Picker
        harvestDate: DataTypes.DATE,
        // Location String
        location: DataTypes.STRING,
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

    DiscoveryTransfection.associate = function (models) {
        models.DiscoveryTransfection.belongsTo(models.DiscoveryPlasmid, {
            as: 'heavyChainDiscoveryPlasmid',
            foreignKey: 'heavyChainDiscoveryPlasmidId',
            targetKey: 'id'
        });
        models.DiscoveryTransfection.belongsTo(models.DiscoveryPlasmid, {
            as: 'lightChainDiscoveryPlasmid',
            foreignKey: 'lightChainDiscoveryPlasmidId',
            targetKey: 'id'
        });
        models.DiscoveryTransfection.belongsTo(models.Plasmid, {
            as: 'heavyChainPlasmid',
            foreignKey: 'heavyChainProteinPlasmidId',
            targetKey: 'id'
        });
        models.DiscoveryTransfection.belongsTo(models.Plasmid, {
            as: 'lightChainPlasmid',
            foreignKey: 'lightChainProteinPlasmidId',
            targetKey: 'id'
        });
        models.DiscoveryTransfection.belongsTo(models.WellRescue, {
            foreignKey: 'wellRescueId',
            targetKey: 'id'
        });
        models.DiscoveryTransfection.belongsTo(models.Protein, { foreignKey: 'proteinId', targetKey: 'id' });
    };

    return DiscoveryTransfection;
};
