'use strict';

module.exports = function (sequelize, DataTypes) {
    const FreezerLogEntry = sequelize.define('FreezerLogEntry', {
        sample: DataTypes.STRING,
        freezerSectionId: DataTypes.INTEGER,
        row: DataTypes.INTEGER,
        column: DataTypes.INTEGER,
        description: DataTypes.STRING,
        sampleOwner: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        date: DataTypes.DATE,
        sampleType: DataTypes.STRING,
        sampleGroups: DataTypes.STRING,

        // common
        createdBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        references: DataTypes.TEXT,
        properties: DataTypes.TEXT,
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    FreezerLogEntry.associate = function (models) {
        FreezerLogEntry.belongsTo(models.FreezerSection, { foreignKey: 'freezerSectionId' });
    };

    return FreezerLogEntry;
};
