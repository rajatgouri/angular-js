'use strict';

module.exports = function (sequelize, DataTypes) {
    const Task = sequelize.define('Task', {
        name: DataTypes.STRING,
        startDate: DataTypes.DATE,
        endDate: DataTypes.DATE,
        projectId: DataTypes.INTEGER,
        priority: DataTypes.ENUM('Y', 'N'),
        ENUM_instrument: DataTypes.STRING,
        ENUM_taskType: DataTypes.STRING,
        resource: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        status: DataTypes.STRING,

        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        createdBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        }
    });

    Task.associate = function (models) {
        Task.belongsTo(models.Project, { foreignKey: 'projectId', sourceKey: 'id' });
    };

    return Task;
};
