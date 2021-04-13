'use strict';

module.exports = function (sequelize, DataTypes) {
    const ProteinPlasmidMapping = sequelize.define('ProteinPlasmidMapping', {
        proteinId: DataTypes.INTEGER,
        plasmidId: DataTypes.INTEGER,
        // common
        createdBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    ProteinPlasmidMapping.associate = function (models) {
        models.ProteinPlasmidMapping.belongsTo(models.Protein, {
            foreignKey: 'proteinId',
            targetKey: 'id'
        });
        models.ProteinPlasmidMapping.belongsTo(models.Plasmid, {
            foreignKey: 'plasmidId',
            targetKey: 'id'
        });
    };

    return ProteinPlasmidMapping;
};
