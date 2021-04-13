'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Reagent', {
        channel: DataTypes.INTEGER,
        channelRef: DataTypes.STRING,
        channelFilter: DataTypes.STRING,
        dichroic: DataTypes.STRING,
        channelLaser: DataTypes.STRING,
        excitationWavelength: DataTypes.INTEGER,
        flourochrome: DataTypes.STRING,
        analyte: DataTypes.STRING,
        vendor: DataTypes.STRING,
        sku: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });
};
