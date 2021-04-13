'use strict';

module.exports = function (sequelize, DataTypes) {
    const pHData = sequelize.define('pHData', {
        SampleId: DataTypes.STRING,
        SensorId: DataTypes.STRING,
        InstrumentFriendlyName: DataTypes.STRING,
        SerialNumber: DataTypes.STRING,
        InstrumentType: DataTypes.STRING,
        PcDateTime: DataTypes.DATE,
        Temperature: DataTypes.DOUBLE,
        TemperatureUnit: DataTypes.STRING,
        Result: DataTypes.DOUBLE,
        ResultUnit: DataTypes.STRING,
        LastCalibration: DataTypes.DATE,
        MethodId: DataTypes.STRING,
        Status: DataTypes.STRING,
        ModuleType: DataTypes.STRING,
        ModuleSerialNumber: DataTypes.STRING
    }, {
        updatedAt: false
    });

    return pHData;
};
