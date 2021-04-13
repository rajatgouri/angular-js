'use strict';

module.exports = function (sequelize, DataTypes) {
    const CellThaw = sequelize.define('CellThaw', {
        // Freeze #
        freezeId: DataTypes.INTEGER,
        // Thaw Date
        thawDate: DataTypes.DATE,
        // Viabililty (Post-Thaw)
        viability: DataTypes.FLOAT,
        // Concentration (Post-Thaw)
        concentration: DataTypes.FLOAT,
        // Volume (Post-Thaw)
        volume: DataTypes.FLOAT,
        // Recovery (Post-Thaw)
        recovery: DataTypes.FLOAT,

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

    CellThaw.associate = function (models) {
        models.CellThaw.belongsTo(models.CTFreeze, { foreignKey: 'freezeId', sourceKey: 'id' });
        models.CellThaw.hasMany(models.CTVessel, { foreignKey: 'cellThawId', targetKey: 'id' })
    };

    return CellThaw;
};
