'use strict';

module.exports = function (sequelize, DataTypes) {
    const HumanizationPlasmid = sequelize.define('HumanizationPlasmid', {
        // specific
        name: DataTypes.STRING,
        // Well Rescue ID Integer (foreign key)
        discoveryPlasmidId: {
            type: DataTypes.INTEGER
            // references: { model: 'DiscoveryPlasmids', key: 'id' }
        },

        // TODO: evaluate if to copy the id around. it could result other problems
        wellRescueId: {
            type: DataTypes.INTEGER,
            references: { model: 'WellRescues', key: 'id' }
        },
        vhOrVl: DataTypes.ENUM('VH', 'VL'),

        version: DataTypes.INTEGER,
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

    HumanizationPlasmid.associate = function (models) {
        models.HumanizationPlasmid.belongsTo(models.DiscoveryPlasmid, {
            foreignKey: 'discoveryPlasmidId',
            targetKey: 'id'
        });
        models.HumanizationPlasmid.belongsTo(models.WellRescue, { foreignKey: 'wellRescueId', targetKey: 'id' });
        models.HumanizationPlasmid.hasMany(models.HumanizationTransfection, {
            as: 'heavyChainHumanizationPlasmid',
            foreignKey: 'heavyChainHumanizationPlasmidId',
            targetKey: 'id'
        });
        models.HumanizationPlasmid.hasMany(models.HumanizationTransfection, {
            as: 'lightChainHumanizationPlasmid',
            foreignKey: 'lightChainHumanizationPlasmidId',
            targetKey: 'id'
        });
    };

    return HumanizationPlasmid;
};
