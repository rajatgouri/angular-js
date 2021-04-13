'use strict';

// ADE -- mixCondition
module.exports = function (sequelize, DataTypes) {
    const MixCondition = sequelize.define('MixCondition', {
        name: DataTypes.STRING,

        // Mix Condition ID Integer Generated
        // Activation ID Integer Activation Table
        activationId: {
            type: DataTypes.INTEGER
        },
        // Feeder operator String User name search
        feederOperator: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        // Mix making operator String User name search
        mixMakingOperator: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        // Plating operator String User name search
        platingOperator: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        // EL4-B5 lot # ENUM View details only
        ENUM_eL4B5Lot: DataTypes.STRING,
        // TSN lot # ENUM
        ENUM_tsnLotNumber: DataTypes.STRING,
        // % TSN Float
        perOfTsn: DataTypes.FLOAT,
        // EL4-B5/well Integer View details only
        eL4B5well: DataTypes.INTEGER,

        // FBS Lot # ENUM View details only
        ENUM_fbsLot: DataTypes.STRING,
        // type of plate ENUM View details only
        ENUM_plateType: DataTypes.STRING,
        // Well Volume Integer View details only
        wellVolume: DataTypes.INTEGER,
        // days in culture Integer View details only
        daysInCulture: DataTypes.INTEGER,
        // ml/plate Float View details only
        mlPerPlate: DataTypes.FLOAT,
        // Number of Plates for Mix Integer
        numberOfPlatesForMix: DataTypes.INTEGER,
        // Notes String
        notes: DataTypes.TEXT,

        // volume Derived Number of plates for mix * ml/plate
        // feeder concentration Float
        feederConcentration: DataTypes.DOUBLE,
        // feeders per ml Derived EL4-B5/well * 5
        // total feeder needed Derived volume * feeders per ml
        // feeder volume Derived total feeder needed / feeder concentration
        // TSN volume Derived Volume * % TSN
        // Media Volume Derived Volume - ( Feeder Volume + TSN volume)

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

    MixCondition.associate = function (models) {
        models.MixCondition.belongsTo(models.Activation, { foreignKey: 'activationId', targetKey: 'id' });
        models.MixCondition.hasMany(models.Sort, { foreignKey: 'mixConditionId', sourceKey: 'id' });
    };

    return MixCondition;
};
