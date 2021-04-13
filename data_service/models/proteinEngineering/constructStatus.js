'use strict';

module.exports = function (sequelize, DataTypes) {
    const ConstructStatus = sequelize.define('ConstructStatus', {
        name: DataTypes.STRING,
        // Requester fills this out
        constructRequestId: DataTypes.INTEGER,
        description: DataTypes.STRING,

        // Edit, filled out by molecular biology
        priority: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        assignedTo: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        sequenceReviewed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        designed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        ordered: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        cloned: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        maxiprep: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        sequenceVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        onHold: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        status: DataTypes.STRING,
        adminNotes: DataTypes.STRING,
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

    ConstructStatus.associate = function (models) {
        ConstructStatus.belongsTo(models.ConstructRequest, {
            foreignKey: 'constructRequestId',
            sourceKey: 'id'
        });
        ConstructStatus.hasOne(models.Plasmid, {
            foreignKey: 'constructStatusId',
            targetKey: 'id'
        });
    };

    return ConstructStatus;
};
