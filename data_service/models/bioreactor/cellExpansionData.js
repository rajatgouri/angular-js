'use strict';

module.exports = function (sequelize, DataTypes) {
    const CellExpansionData = sequelize.define('CellExpansionData', {
        // Passage #
        name: DataTypes.STRING,
        // Cell Expansion
        cellExpansionId: DataTypes.INTEGER,
        // Sample Time
        sampleTime: DataTypes.DATE,
        // VCD
        vcd: DataTypes.FLOAT,
        // Viability
        viability: DataTypes.FLOAT,
        // Split
        split: {
            type: DataTypes.ENUM('Yes', 'No'),
            defaultValue: 'No'
        },
        // Volume of Culture
        volumeOfCulture: DataTypes.FLOAT,
        // Volume of Medium
        volumeOfMedium: DataTypes.FLOAT,

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

    CellExpansionData.associate = function (models) {
        models.CellExpansionData.belongsTo(models.CellExpansion, {
            foreignKey: 'cellExpansionId',
            targetKey: 'id'
        });
        models.CellExpansionData.hasMany(models.Bioreactor, { foreignKey: 'cellPassageId', targetKey: 'id' });
    };

    return CellExpansionData;
};
