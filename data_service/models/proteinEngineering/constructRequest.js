'use strict';

module.exports = function (sequelize, DataTypes) {
    const ConstructRequest = sequelize.define('ConstructRequest', {
        name: DataTypes.STRING,
        projectId: DataTypes.INTEGER,
        notes: DataTypes.TEXT,
        requestedBy: DataTypes.INTEGER,
        estimatedTimeline: DataTypes.DATE,
        newSequence: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        numConstructs: DataTypes.INTEGER,
        approvedBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Approved', 'In Progress', 'Completed', 'On Hold'),
            defaultValue: 'Pending'
        },

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
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    ConstructRequest.associate = function (models) {
        ConstructRequest.belongsTo(models.Project, {
            foreignKey: 'projectId',
            sourceKey: 'id',
            as: 'requestProject'
        });
        ConstructRequest.belongsTo(models.User, { foreignKey: 'requestedBy', sourceKey: 'id' });
        ConstructRequest.hasMany(models.ConstructStatus, { foreignKey: 'constructRequestId', targetKey: 'id' });
    };

    return ConstructRequest;
};
