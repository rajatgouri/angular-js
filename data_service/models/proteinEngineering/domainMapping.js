'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('DomainMapping', {
        domain: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        antigen: DataTypes.STRING,
        fto: DataTypes.ENUM('Y','C','N')
    });
};
