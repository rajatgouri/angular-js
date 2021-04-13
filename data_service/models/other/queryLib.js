'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('queryLib', {
        name: { type: DataTypes.STRING, unique: true },
        query: DataTypes.TEXT,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        group: DataTypes.TEXT
    });
};
