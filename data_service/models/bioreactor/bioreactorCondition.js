'use strict';

module.exports = function (sequelize, DataTypes) {
    const BioreactorCondition = sequelize.define('BioreactorCondition', {
        name: DataTypes.STRING,
        // Inoculation VCD Target (x106/mL)
        inoculationVCDTarget: DataTypes.FLOAT,
        // Vessel Scale
        ENUM_vesselScale: DataTypes.INTEGER,
        // Agitation
        agitation: DataTypes.INTEGER,
        // Initial Temp
        initialTemperature: DataTypes.FLOAT,
        // Temp Shift 1 Hour
        tempShift1Hour: DataTypes.FLOAT,
        // Temp Shift 1 Value
        tempShift1Value: DataTypes.FLOAT,
        // Temp Shift 1 Hour
        tempShift2Hour: DataTypes.FLOAT,
        // Temp Shift 1 Value
        tempShift2Value: DataTypes.FLOAT,
        // pH Set Point
        phSetPoint: DataTypes.FLOAT,
        // Headspace Gas Flow Rate
        headspaceGasFlowRate: DataTypes.FLOAT,
        // DO Setpoint (%)
        doSetpoint: DataTypes.FLOAT,
        // Basal Medium
        ENUM_basalMedium: DataTypes.STRING,
        // Feed Glucose Conc.
        feedGlucoseConc: DataTypes.FLOAT,
        // Feed Medium
        ENUM_feedMedium: DataTypes.STRING,
        // Feed Medium Timing
        feedMediumTiming: DataTypes.TEXT,

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

    BioreactorCondition.associate = function (models) {
        models.BioreactorCondition.hasMany(models.Bioreactor, {
            foreignKey: 'bioreactorConditionId',
            targetKey: 'id'
        });
    };

    return BioreactorCondition;
};
