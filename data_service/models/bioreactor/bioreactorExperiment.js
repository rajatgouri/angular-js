'use strict';

module.exports = function (sequelize, DataTypes) {
    const BioreactorExperiment = sequelize.define('BioreactorExperiment', {
        // Experiment Name
        name: DataTypes.STRING,
        // Stable Cell Line
        stableCellLineId: DataTypes.INTEGER,
        // Description
        description: DataTypes.STRING,
        // Inoculation Volume
        inoculationVolume: DataTypes.FLOAT,
        // Inoculation Date/Time
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

    BioreactorExperiment.associate = function (models) {
        models.BioreactorExperiment.belongsTo(models.StableCellLine, {
            foreignKey: 'stableCellLineId',
            targetKey: 'id'
        });
        models.BioreactorExperiment.hasMany(models.Bioreactor, {
            foreignKey: 'bioreactorExperimentId',
            targetKey: 'id'
        });
    };

    return BioreactorExperiment;
};
