'use strict';

// ADE -- supernatentPlate
module.exports = function (sequelize, DataTypes) {
    const SupernatentPlate = sequelize.define('SupernatentPlate', {
        name: {
            type: DataTypes.STRING,
            unique: true
        },
        bCCPlateId: DataTypes.INTEGER,
        // Day of harvest Date Date Picker
        dayOfHarvest: DataTypes.DATE,
        // Operator String User name search
        operator: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        // Method of Harvest ENUM
        ENUM_methodOfHarvest: DataTypes.STRING,
        // Volume of Harvest Integer
        harvestVolume: DataTypes.INTEGER,
        // Reagent added to well ENUM
        ENUM_reagent: DataTypes.STRING,
        // Volume of reagent Integer
        reagentVolume: DataTypes.INTEGER,
        // notes String
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

    SupernatentPlate.associate = function (models) {
        SupernatentPlate.belongsTo(models.BCCPlate, { foreignKey: 'bCCPlateId', targetKey: 'id' });
        SupernatentPlate.hasMany(models.WellRescue, { foreignKey: 'supernatentPlateId', sourceKey: 'id' });
    };

    return SupernatentPlate;
};
