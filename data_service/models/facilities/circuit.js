'use strict';

module.exports = function (sequelize, DataTypes) {
    const Circuit = sequelize.define('Circuit', {
        name: DataTypes.STRING,
        location: DataTypes.STRING,
        voltage: DataTypes.INTEGER,
        capacity: DataTypes.FLOAT,
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

    Circuit.associate = function (models) {
        models.Circuit.hasMany(models.Equipment, { foreignKey: 'circuitId', targetKey: 'id' });
    };

    return Circuit;
};
