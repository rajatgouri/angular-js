'use strict';

// ADE -- activation
module.exports = function (sequelize, DataTypes) {
    const Activation = sequelize.define('Activation', {
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        projectId: {
            type: DataTypes.INTEGER,
            references: { model: 'Projects', key: 'id' }
        },
        date: DataTypes.DATE,
        // Common
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

    Activation.associate = function (models) {
        models.Activation.belongsTo(models.Project, { foreignKey: 'projectId', targetKey: 'id' });
        models.Activation.hasMany(models.BCellSource, { foreignKey: 'activationId', sourceKey: 'id' });
        models.Activation.hasMany(models.MixCondition, { foreignKey: 'activationId', sourceKey: 'id' });
        models.Activation.hasMany(models.Sort, { foreignKey: 'activationId', sourceKey: 'id' });
    };

    return Activation;
};
