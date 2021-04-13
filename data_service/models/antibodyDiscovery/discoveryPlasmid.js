'use strict';

module.exports = function (sequelize, DataTypes) {
    const DiscoveryPlasmid = sequelize.define('DiscoveryPlasmid', {
        // specific
        name: DataTypes.STRING,
        // Well Rescue ID Integer (foreign key)
        wellRescueId: {
            type: DataTypes.INTEGER,
            references: { model: 'WellRescues', key: 'id' }
        },
        // Project Derived
        // VH/VL ENUM
        lcOrHc: DataTypes.ENUM('LC', 'HC'),
        clone: DataTypes.INTEGER,
        version: DataTypes.INTEGER,
        // Version # Derived
        // Concentration Double
        concentration: DataTypes.DOUBLE,
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

    DiscoveryPlasmid.associate = function (models) {
        models.DiscoveryPlasmid.belongsTo(models.WellRescue, { foreignKey: 'wellRescueId', targetKey: 'id' });
        models.DiscoveryPlasmid.hasMany(models.HumanizationPlasmid, {
            foreignKey: 'discoveryPlasmidId',
            sourceKey: 'id'
        });
        models.DiscoveryPlasmid.hasMany(models.DiscoveryTransfection, {
            as: 'heavyChainPlasmid',
            foreignKey: 'heavyChainDiscoveryPlasmidId',
            targetKey: 'id'
        });
        models.DiscoveryPlasmid.hasMany(models.DiscoveryTransfection, {
            as: 'lightChainPlasmid',
            foreignKey: 'lightChainDiscoveryPlasmidId',
            targetKey: 'id'
        });
        models.DiscoveryPlasmid.hasMany(models.HumanizationTransfection, {
            as: 'heavyChainDiscoveryPlasmid',
            foreignKey: 'heavyChainDiscoveryPlasmidId',
            targetKey: 'id'
        });
        models.DiscoveryPlasmid.hasMany(models.HumanizationTransfection, {
            as: 'lightChainDiscoveryPlasmid',
            foreignKey: 'lightChainDiscoveryPlasmidId',
            targetKey: 'id'
        });
    };

    return DiscoveryPlasmid;
};
