'use strict';

module.exports = function (sequelize, DataTypes) {
    const WellRescue = sequelize.define('WellRescue', {
        // specific
        // Well String
        name: {
            type: DataTypes.STRING,
            unique: true
        },
        supernatentPlateId: DataTypes.INTEGER,
        ENUM_wellType: DataTypes.STRING,
        ENUM_wellIndex: DataTypes.INTEGER,
        // Date Date
        date: DataTypes.DATE,
        ENUM_pCRBlock: DataTypes.STRING,
        // VL Boolean
        VL: DataTypes.ENUM('Yes', 'No'),
        // VH Boolean
        VH: DataTypes.ENUM('Yes', 'No'),
        // Success Boolean Derived
        // Cloned Boolean
        cloned: DataTypes.ENUM('Yes', 'No'),

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

    WellRescue.associate = function (models) {
        WellRescue.belongsTo(models.SupernatentPlate, {
            foreignKey: 'supernatentPlateId',
            targetKey: 'id'
        });
        WellRescue.hasMany(models.HumanizationTransfection, {
            foreignKey: 'wellRescueId',
            sourceKey: 'id'
        });
        WellRescue.hasMany(models.DiscoveryTransfection, { foreignKey: 'wellRescueId', sourceKey: 'id' });
        WellRescue.hasOne(models.CloningAndSequence, { foreignKey: 'wellRescueId', sourceKey: 'id' });
        WellRescue.hasMany(models.DiscoveryPlasmid, { foreignKey: 'wellRescueId', sourceKey: 'id' });
        WellRescue.hasMany(models.HumanizationPlasmid, { foreignKey: 'wellRescueId', sourceKey: 'id' });
    };

    return WellRescue;
};
