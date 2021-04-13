'use strict';

module.exports = function (sequelize, DataTypes) {
    const NanodropData = sequelize.define('NanodropData', {
        experimentId: DataTypes.STRING,
        date: DataTypes.DATE,
        sampleName: DataTypes.STRING,
        sampleType: DataTypes.STRING,
        measurementType: DataTypes.STRING,
        measurementValue: DataTypes.FLOAT,
        measurementUnit: DataTypes.STRING
    }, {
        updatedAt: false
    });

    NanodropData.associate = function (models) {
        models.NanodropData.belongsTo(models.NanodropExperiment, {
            foreignKey: 'experimentId',
            targetKey: 'id'
        });
    };

    return NanodropData;
};
