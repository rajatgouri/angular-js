'use strict';

module.exports = function (sequelize, DataTypes) {
    const Notification = sequelize.define('Notification', {
        user: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        activityType: DataTypes.INTEGER,
        sourceId: DataTypes.INTEGER,
        emailSent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return Notification;
};
