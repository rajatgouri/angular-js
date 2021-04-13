'use strict';

module.exports = function (sequelize, DataTypes) {
    const CTVesselType = sequelize.define('CTVesselType', {
        name: DataTypes.STRING,
        vendor: DataTypes.STRING,
        pn: DataTypes.STRING,
        wellSize: DataTypes.INTEGER,
        wellVolume: DataTypes.INTEGER,
        rows: DataTypes.INTEGER,
        columns: DataTypes.INTEGER,
        notes: DataTypes.TEXT,

        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    });

    CTVesselType.associate = function (models) {
        models.CTVesselType.hasMany(models.CTVessel, { foreignKey: 'vesselTypeId', targetKey: 'id' })
    };

    return CTVesselType;
};
