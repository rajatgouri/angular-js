'use strict';

module.exports = function (sequelize, DataTypes) {
    const PlasmidLot = sequelize.define('PlasmidLot', {
        plasmidId: DataTypes.INTEGER,
        orderRef: DataTypes.STRING,
        concentration: DataTypes.DOUBLE,
        originalVolume: DataTypes.DOUBLE,
        volume: DataTypes.DOUBLE,
        prepDate: DataTypes.DATE,
        notes: DataTypes.STRING,
        operator: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
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

    PlasmidLot.associate = function (models) {
        models.PlasmidLot.belongsTo(models.Plasmid, { foreignKey: 'plasmidId', sourceKey: 'id' });
    };

    return PlasmidLot;
};
