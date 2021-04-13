'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('AntigenClass', {
        antigen: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        class: DataTypes.STRING
    });
};
