'use strict';

module.exports = function (sequelize, DataTypes) {
    const PayPeriods = sequelize.define('PayPeriods', {
        name: DataTypes.STRING,
        endDate: DataTypes.STRING,
        available: DataTypes.DATE,
        
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    PayPeriods.associate = function (models) {
        models.PayPeriods.hasMany(models.TimePerProject, { foreignKey: 'PayPeriodID', sourceKey: 'id' });
    };

    return PayPeriods;
};
