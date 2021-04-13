'use strict';
// var Project = require('./project.js');

module.exports = function (sequelize, DataTypes) {
    const Plasmid = sequelize.define('Plasmid', {
        name: {
            type: DataTypes.STRING,
            unique: true
        },
        constructStatusId: DataTypes.INTEGER,
        projectId: {
            type: DataTypes.INTEGER,
            references: { model: 'Projects', key: 'id' }
        },
        description: DataTypes.TEXT,
        ENUM_vector: DataTypes.STRING,
        ENUM_bacteria: DataTypes.STRING,
        ENUM_plasmidTag: DataTypes.STRING,
        ENUM_mammalian: DataTypes.STRING,
        concentration: DataTypes.DOUBLE,
        completed: DataTypes.BOOLEAN, // Deprecated
        reprep: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        // userId: DataTypes.INTEGER,
        // User display name at the momemnt of plasmid creation.
        // userDisplayName: DataTypes.STRING,
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

    Plasmid.associate = function (models) {
        models.Plasmid.belongsTo(models.Project, { foreignKey: 'projectId', sourceKey: 'id' });
        models.Plasmid.hasMany(models.DiscoveryTransfection, {
            as: 'heavyChainPlasmid',
            foreignKey: 'heavyChainProteinPlasmidId',
            targetKey: 'id'
        });
        models.Plasmid.belongsTo(models.ConstructStatus, { foreignKey: 'constructStatusId', sourceKey: 'id' });
        models.Plasmid.hasOne(models.PlasmidData, { foreignKey: 'plasmidId', targetKey: 'id' });
        models.Plasmid.hasMany(models.PlasmidAnnotation, { foreignKey: 'plasmidId', targetKey: 'id' });
        models.Plasmid.hasMany(models.PlasmidLot, { foreignKey: 'plasmidId', targetKey: 'id' });
        models.Plasmid.hasMany(models.ADTransfectionRequest, { foreignKey: 'plasmidId', targetKey: 'id' });
        models.Plasmid.belongsToMany(models.Protein, {
            through: {
                model: models.ProteinPlasmidMapping
            },
            foreignKey: 'plasmidId',
            otherKey: 'proteinId'
        });
    };

    return Plasmid;
};
