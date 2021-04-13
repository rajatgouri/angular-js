'use strict';

/**
 * Role Model
 */
module.exports = function (sequelize, DataTypes) {
    const Role = sequelize.define('Role', {
        name: {
            type: DataTypes.STRING,
            unique: true
        },
        permissions: DataTypes.TEXT
    }
    );
    Role.associate = function (models) {
        models.Role.belongsToMany(models.User, {
            through: { model: models.UserRoleMapping },
            foreignKey: 'roleId',
            otherKey: 'userId'
        });
    };

    return Role;
};
