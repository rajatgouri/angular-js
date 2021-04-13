'use strict';

module.exports = function (sequelize, DataTypes) {
    const Protein = sequelize.define('Protein', {
        name: { type: DataTypes.STRING, unique: true },
        // projectId: DataTypes.STRING,
        projectId: {
            type: DataTypes.INTEGER,
            references: { model: 'Projects', key: 'id' }
        },
        ENUM_moleculeType: DataTypes.STRING,
        typeCode: DataTypes.STRING,
        // rank is the last number in the name part.
        rank: DataTypes.INTEGER,
        description: DataTypes.TEXT,
        molecularWeight: DataTypes.BIGINT,
        molarExtCoefficient: DataTypes.BIGINT,
        pI: DataTypes.DOUBLE,

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

    Protein.associate = function (models) {
        models.Protein.belongsTo(models.Project, { foreignKey: 'projectId', sourceKey: 'id' });
        models.Protein.hasMany(models.TransfectionRequest, { foreignKey: 'proteinId', sourceKey: 'id' });
        models.Protein.hasMany(models.DiscoveryTransfection, { foreignKey: 'proteinId', sourceKey: 'id' });
        models.Protein.hasMany(models.StableCellLine, { foreignKey: 'proteinId', targetKey: 'id' });
        models.Protein.hasOne(models.ProteinAntigen, { foreignKey: 'proteinId', targetKey: 'id' });
        models.Protein.belongsToMany(models.Plasmid, {
            through: {
                model: models.ProteinPlasmidMapping
            },
            foreignKey: 'proteinId',
            otherKey: 'plasmidId'
        });
    };

    return Protein;
};
