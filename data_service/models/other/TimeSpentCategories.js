'use strict';

module.exports = function (sequelize, DataTypes) {
    const TimeSpentCategories = sequelize.define('TimeSpentCategories', {
        name: DataTypes.STRING,
        // common
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    TimeSpentCategories.associate = function (models) {
        models.TimeSpentCategories.hasMany(models.TimePerProject, { foreignKey: 'TimeCat', sourceKey: 'id' });
    };

    return TimeSpentCategories;
};
