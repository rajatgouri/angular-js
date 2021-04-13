'use strict';

module.exports = function (sequelize, DataTypes) {
    const CellLineExperiment = sequelize.define('CellLineExperiment', {
        // specific
        name: DataTypes.STRING,
        // Stable Cell Line Yes Foreign Key
        stableCellLineId: DataTypes.INTEGER,
        // Project Yes Foreign Key
        // Experiment Type ENUM
        experimentType: DataTypes.ENUM('Minipool', 'Single Clone'),
        // Single Clone - Minipool Reference Yes
        minipoolReference: DataTypes.INTEGER,
        // Scale Yes Integer
        scale: DataTypes.INTEGER,
        // Culture Media Yes String
        ENUM_cultureMedia: DataTypes.STRING,
        // Inoculation Date Yes Datetime
        inoculationDate: DataTypes.DATE,

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

    CellLineExperiment.associate = function (models) {
        models.CellLineExperiment.belongsTo(models.StableCellLine, {
            foreignKey: 'stableCellLineId',
            targetKey: 'id'
        });
        models.CellLineExperiment.hasMany(models.CLDHarvest, {
            as: 'experiment',
            foreignKey: 'cellLineExperimentId',
            targetKey: 'id'
        });
        models.CellLineExperiment.belongsTo(models.CLDHarvest, {
            as: 'minipool',
            foreignKey: 'minipoolReference',
            targetKey: 'id',
            constraints: false
        });
    };

    return CellLineExperiment;
};
