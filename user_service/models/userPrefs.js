'use strict';

module.exports = function (sequelize, DataTypes) {
    const UserPreference = sequelize.define('UserPreference', {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        homeLayout: DataTypes.TEXT,
        ctLayout: DataTypes.TEXT
    });

    UserPreference.associate = function (models) {
        UserPreference.belongsTo(models.User, {
            foreignKey: 'userId'
        });
    };

    return UserPreference;
};
