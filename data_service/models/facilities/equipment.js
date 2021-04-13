'use strict';

module.exports = function (sequelize, DataTypes) {
    const Equipment = sequelize.define('Equipment', {
        name: DataTypes.STRING,
        usage: DataTypes.FLOAT,
        circuitId: DataTypes.INTEGER,
        network: DataTypes.STRING,
        notes: DataTypes.TEXT,
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
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    Equipment.associate = function (models) {
        models.Equipment.belongsTo(models.Circuit, { foreignKey: 'circuitId', targetKey: 'id' });
    };

    return Equipment;
};
