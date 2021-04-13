'use strict';

module.exports = function (sequelize, DataTypes) {
    const OsmoData = sequelize.define('OsmoData', {
        date: DataTypes.DATE,
        sampleId: DataTypes.STRING,
        value: DataTypes.FLOAT,
        unit: DataTypes.STRING,
    }, {
        updatedAt: false
    });

    return OsmoData;
};
