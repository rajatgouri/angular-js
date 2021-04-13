'use strict';

module.exports = function (sequelize, DataTypes) {
    const Transfection = sequelize.define('Transfection', {
        name: DataTypes.STRING,
        trqId: DataTypes.INTEGER,

        // Transfection Date
        transfectionDate: DataTypes.DATE,
        // Harvest Date
        harvestDate: DataTypes.DATE,
        // Octet Titer [ug/mL]
        octetTiter: DataTypes.DOUBLE,
        // Transfection Notes
        transfectionNotes: DataTypes.TEXT,
        // Approve for purification
        approved: DataTypes.ENUM('Yes', 'No'),

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

    Transfection.associate = function (models) {
        Transfection.belongsTo(models.TransfectionRequest, { foreignKey: 'trqId', sourceKey: 'id' });
        Transfection.hasMany(models.ProteinPurification, {
            foreignKey: 'transfectionId',
            sourceKey: 'id'
        });
    };

    return Transfection;
};
