'use strict';

module.exports = function (sequelize, DataTypes) {
    const FreezerSection = sequelize.define('FreezerSection', {
        name: DataTypes.STRING,
        parentId: DataTypes.INTEGER,

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
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    FreezerSection.associate = function (models) {
        FreezerSection.belongsTo(FreezerSection, { as: 'Parent', foreignKey: 'parentId' });
        FreezerSection.hasMany(models.FreezerLogEntry, { foreignKey: 'freezerSectionId' });
    };

    return FreezerSection;
};
