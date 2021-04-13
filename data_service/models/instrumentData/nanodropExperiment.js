'use strict';

module.exports = function (sequelize, DataTypes) {
    const NanodropExperiment = sequelize.define('NanodropExperiment', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        experimentName: DataTypes.STRING,
        equipmentSerial: DataTypes.STRING,
        applicationType: DataTypes.STRING
    }, {
        updatedAt: false
    });

    NanodropExperiment.associate = function (models) {
        models.NanodropExperiment.hasMany(models.NanodropData, {
            foreignKey: 'experimentId',
            targetKey: 'id'
        });
    };

    return NanodropExperiment;
};
