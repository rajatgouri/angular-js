'use strict';

/**
 * Role Model
 */
module.exports = function (sequelize, DataTypes) {
    const Email = sequelize.define('Email', {
        subject: {
            type: DataTypes.STRING,
        },
        text: DataTypes.TEXT,
        recipient: DataTypes.TEXT,
        createdBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
    }
    );
    

    return Email;
};
