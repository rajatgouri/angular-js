'use strict';

module.exports = function (sequelize, DataTypes) {
    const CTExperiment = sequelize.define('CTExperiment', {
        name: DataTypes.STRING,
        // Inoculation Date
        startDate: DataTypes.DATE,
        purpose: DataTypes.STRING,
        notes: DataTypes.TEXT,
        //common
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
        },
    });

    CTExperiment.associate = function (models) {
        models.CTExperiment.hasMany(models.CTVessel, { foreignKey: 'experimentId', targetKey: 'id' });
    };

    return CTExperiment;
};
