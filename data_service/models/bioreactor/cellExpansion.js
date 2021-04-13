'use strict';

module.exports = function (sequelize, DataTypes) {
    const CellExpansion = sequelize.define('CellExpansion', {
        // Name
        name: DataTypes.STRING,
        // Clone
        cellLineHarvestId: DataTypes.INTEGER,
        // Date Bank Frozen
        dateBankFrozen: DataTypes.DATE,
        // Notebook Ref
        notebookRef: DataTypes.STRING,

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

    CellExpansion.associate = function (models) {
        models.CellExpansion.belongsTo(models.CLDHarvest, { foreignKey: 'cellLineHarvestId', targetKey: 'id' });
        models.CellExpansion.hasMany(models.CellExpansionData, {
            foreignKey: 'cellExpansionId',
            targetKey: 'id'
        });
    };

    return CellExpansion;
};
