'use strict';

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define('User', {
        displayName: DataTypes.STRING,
        department: DataTypes.STRING,
        email: DataTypes.STRING,
        tableHistories: DataTypes.TEXT,
        
    });

    User.associate = function (models) {
        User.belongsToMany(models.Project, {
            through: {
                model: models.ProjectStage
            },
            foreignKey: 'userId',
            otherKey: 'projectId'
        });
        //User.belongsTo(models.TimePerProject, { foreignKey: 'id', sourceKey: 'UserID' });
        User.hasOne(models.UserPreference, {
            foreignKey: 'userId'
        });
    };

    return User;
};
