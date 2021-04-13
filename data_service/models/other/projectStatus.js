'use strict';

module.exports = function (sequelize, DataTypes) {
    const ProjectStage = sequelize.define('ProjectStage', {
        projectId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
        stage: DataTypes.STRING,
        updatedBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        }
    });

    ProjectStage.associate = function (models) {
        models.ProjectStage.belongsTo(models.User, { foreignKey: 'userId', sourceKey: 'id' });
        models.ProjectStage.belongsTo(models.Project, { foreignKey: 'projectId', sourceKey: 'id' });
    };

    return ProjectStage;
};
