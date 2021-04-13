'use strict';

module.exports = function (sequelize, DataTypes) {
    const AktaData = sequelize.define('AktaData', {
        SystemName: DataTypes.STRING,
        ResultID: DataTypes.INTEGER,
        Description: DataTypes.STRING,
        RunStartDate: DataTypes.DATE,
        ColumnUsed: DataTypes.STRING,
        ColumnVolume: DataTypes.FLOAT,
        ColumnUnits: DataTypes.STRING
    }, {
        updatedAt: false
    });

    return AktaData;
};
