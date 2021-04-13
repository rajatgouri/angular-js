'use strict';

/**
 * Role Model
 */
module.exports = function (sequelize, DataTypes) {
    const EmailTemplate = sequelize.define('EmailTemplate', {
        subject: {
            type: DataTypes.STRING,
        },
        text: DataTypes.TEXT,
        
    }
    );
    
    return EmailTemplate;
};
