'use strict';

module.exports = function (sequelize, DataTypes) {
    const StableCellLine = sequelize.define('StableCellLine', {
        // Stable Cell Line # CHAR  ST#####
        name: { type: DataTypes.STRING },
        // Project ENUM
        // projectId: {
        //     type: DataTypes.INTEGER,
        //     references: { model: 'Projects', key: 'id' }
        // },
        // stableCellLineNumber: DataTypes.STRING,
        // Parental Cell Line ENUM
        ENUM_parentalCellLine: DataTypes.STRING,
        // Plasmid CHAR
        plasmidId: {
            type: DataTypes.INTEGER,
            references: { model: 'Plasmids', key: 'id' }
        },
        // Transfection Method ENUM
        ENUM_transfectionMethod: DataTypes.STRING,
        // Selection Marker ENUM
        ENUM_selectionMarker: DataTypes.STRING,
        // Protein Alias CHAR -- Changed to protein id key
        proteinAlias: DataTypes.STRING,
        // Research protein link
        proteinId: DataTypes.INTEGER,
        // time constant (ms) DOUBLE --> changed to programID STRING
        programId: DataTypes.STRING,
        // date of transfection  DATE
        transfectionDate: DataTypes.DATE,
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

    StableCellLine.associate = function (models) {
        StableCellLine.belongsTo(models.Plasmid, { foreignKey: 'plasmidId', sourceKey: 'id' });
        StableCellLine.belongsTo(models.Protein, { foreignKey: 'proteinId', targetKey: 'id' });
        StableCellLine.hasMany(models.CellLineExperiment, {
            foreignKey: 'stableCellLineId',
            sourceKey: 'id'
        });
        StableCellLine.hasMany(models.BioreactorExperiment, {
            foreignKey: 'stableCellLineId',
            targetKey: 'id'
        });
    };

    return StableCellLine;
};
