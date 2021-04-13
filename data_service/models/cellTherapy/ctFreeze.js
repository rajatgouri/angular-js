'use strict';

module.exports = function (sequelize, DataTypes) {
    const CTFreeze = sequelize.define('CTFreeze', {
        // Donor
        donorId: DataTypes.INTEGER,
        // Cryo Date
        cryoDate: DataTypes.DATE,
        // Viabililty (Pre-Cryo)
        preCryoViability: DataTypes.FLOAT,
        cryoVial: DataTypes.STRING,
        cryoPreservative: DataTypes.STRING,

        //common
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
        },
    });

    CTFreeze.associate = function (models) {
        models.CTFreeze.belongsTo(models.Donor, { foreignKey: 'donorId', sourceKey: 'id' });
        models.CTFreeze.hasMany(models.CellThaw, { foreignKey: 'freezeId', targetKey: 'id' })
    };

    return CTFreeze;
};
