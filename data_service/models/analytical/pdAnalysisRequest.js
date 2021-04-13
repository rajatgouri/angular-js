'use strict';

// Research
module.exports = function (sequelize, DataTypes) {
    const PDAnalysisRequest = sequelize.define('PDAnalysisRequest', {
        name: DataTypes.STRING,

        methods: DataTypes.STRING,

        requestedBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        assignedTo: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        // Notes TEXT
        notes: DataTypes.TEXT,
        // Status ENUM  Submitted,In Progress, Completed
        status: DataTypes.ENUM("Submitted", "In Progress", "Completed"),
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

    PDAnalysisRequest.associate = function (models) {
        models.PDAnalysisRequest.belongsTo(models.CellLinePurification, {
            foreignKey: 'cellLinePurificationId',
            sourceKey: 'id'
        });
        models.PDAnalysisRequest.belongsTo(models.BioreactorPurification, {
            foreignKey: 'cellLinePurificationId',
            sourceKey: 'id'
        });
    };

    return PDAnalysisRequest;
};
