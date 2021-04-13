'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('EnumConfig', {
        tableName: {
            type: DataTypes.STRING,
            unique: true
        },
        properties: DataTypes.TEXT
    });
};
