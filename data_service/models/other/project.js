'use strict';

module.exports = function (sequelize, DataTypes) {
    const Project = sequelize.define('Project', {
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        // Targets
        targets: DataTypes.STRING,
        // Goals
        goals: DataTypes.STRING,
        platforms: DataTypes.STRING,
        status: DataTypes.STRING,
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

    Project.associate = function (models) {
        models.Project.hasMany(models.Activation, { foreignKey: 'projectId', sourceKey: 'id' });
        models.Project.hasMany(models.Plasmid, { foreignKey: 'projectId', sourceKey: 'id' });
        models.Project.hasMany(models.Protein, { foreignKey: 'projectId', sourceKey: 'id' });
        models.Project.hasMany(models.TimePerProject, { foreignKey: 'ProjectID', sourceKey: 'id'});
        models.Project.belongsToMany(models.User, {
            through: {
                model: models.ProjectStage
            },
            foreignKey: 'projectId',
            otherKey: 'userId'
        });
    };

    return Project;
};
