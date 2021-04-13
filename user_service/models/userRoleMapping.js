'use strict';

/**
 * UserRoleMapping Model
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('UserRoleMapping', {
        roleId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER
    });
};
