'use strict';

module.exports = function (sequelize, DataTypes) {
    const Instrument = sequelize.define('Instrument', {
        name: {
            type: DataTypes.STRING,
            unique: true
        },
        notes: DataTypes.TEXT,
        group: DataTypes.STRING,
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

    Instrument.associate = function (models) {
        Instrument.hasMany(models.Equipment, { foreignKey: 'equipmentId', targetKey: 'id' });
    };

    return Instrument;
};
