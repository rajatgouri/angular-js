'use strict';

// Research
module.exports = function (sequelize, DataTypes) {
    const ProteinAnalysisRequest = sequelize.define('ProteinAnalysisRequest', {
        name: DataTypes.STRING,
        proteinPurificationId: DataTypes.INTEGER,
        // Sample Submission Date DATE
        sampleSubmissionDate: DataTypes.DATE,
        concentrationOverride: DataTypes.DOUBLE,
        // per request, convert methods into array
        methods: DataTypes.STRING,

        // Requestor ENUM
        requestorUserId: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        // Notes TEXT
        notes: DataTypes.TEXT,
        // Status ENUM  Submitted,In Process, Completed
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

    ProteinAnalysisRequest.associate = function (models) {
        models.ProteinAnalysisRequest.belongsTo(models.ProteinPurification, {
            foreignKey: 'proteinPurificationId',
            sourceKey: 'id'
        });
    };

    return ProteinAnalysisRequest;
};
