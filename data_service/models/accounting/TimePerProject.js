'use strict';

module.exports = function (sequelize, DataTypes) {
    const TimePerProject = sequelize.define('TimePerProject', {

        TimeCat: {
            type: DataTypes.INTEGER,
            references: { model: 'TimeSpentCategories', key: 'id' }
        },
        ProjectID: {
            type: DataTypes.INTEGER,
            references: { model: 'Projects', key: 'id' }
        },
        PayPeriodID: {
            type: DataTypes.INTEGER,
            references: { model: 'PayPeriods', key: 'id'}
        },
        TimeSpent: DataTypes.INTEGER,
        PercentTime: DataTypes.STRING,
        Notes: DataTypes.STRING,
        createdBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        // common
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    TimePerProject.associate = function (models) {
        models.TimePerProject.belongsTo(models.Project, { foreignKey: 'ProjectID', sourceKey: 'id' });
        models.TimePerProject.belongsTo(models.PayPeriods, { foreignKey: 'PayPeriodID', sourceKey: 'id' });
        models.TimePerProject.belongsTo(models.TimeSpentCategories, {foreignKey: 'TimeCat', sourceKey: 'id' });
    };

    return TimePerProject;
};
