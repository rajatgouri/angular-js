'use strict';

/**
 * DataLog Model
 */
module.exports = function (sequelize, DataTypes) {
    const DataLog = sequelize.define('DataLog', {
        userId: DataTypes.INTEGER,
        actionType: DataTypes.ENUM('createEntry', 'insertEntries', 'updateEntry', 'updateExternalLink', 'deleteExternalLink', 'deleteEntry'),
        tableName: DataTypes.STRING,
        entryId: DataTypes.INTEGER,
        detail: DataTypes.TEXT
    });

    DataLog.prototype.toJson = function () {
        return this.get();
    };

    return DataLog;
};
