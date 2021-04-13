'use strict';

module.exports = function (sequelize, DataTypes) {
    const FreezerProLog = sequelize.define('FreezerProLog', {
        User: DataTypes.STRING,
        Date: DataTypes.STRING,
        Time: DataTypes.STRING,
        Object: DataTypes.STRING,
        ArchiveRecord: DataTypes.STRING,
        Comment: DataTypes.STRING,
        
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return FreezerProLog;
};
