'use strict';

module.exports = function (sequelize, DataTypes) {
    const KineticRequest = sequelize.define('KineticRequest', {
        // FKs
        // proteinAnalysisRequestId: DataTypes.INTEGER,
        // transfectionId: DataTypes.INTEGER,
        // proteinPurificationId: DataTypes.INTEGER,
        name: DataTypes.STRING,
        otherSample: DataTypes.STRING,

        // Requester Input
        type: DataTypes.ENUM('Affinity', 'Avidity', 'Both'),
        fullKinetics: DataTypes.BOOLEAN,
        epitopeBinning: DataTypes.BOOLEAN,
        quantitation: DataTypes.BOOLEAN,
        // testAntigens: DataTypes.TEXT,
        taskNotes: DataTypes.TEXT,

        // Scientist Input
        approvalDate: DataTypes.DATE,
        approvedBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        methodDevProgress: DataTypes.STRING,
        expProgress: DataTypes.ENUM('Submitted', 'In-line', 'Done'),
        expType: DataTypes.STRING,
        assignedTo: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        timeline: DataTypes.STRING,

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

    KineticRequest.associate = function (models) {
        KineticRequest.belongsToMany(models.ProteinPurification, {
            through: {
                model: models.KineticRequestMapping,
                // Created unique keys in mappings table because of length bug
                unique: false
            },
            foreignKey: 'kineticRequestId',
            otherKey: 'proteinPurificationId'
        });
        KineticRequest.belongsToMany(models.Transfection, {
            through: {
                model: models.KineticRequestMapping,
                // Created unique keys in mappings table because of length bug
                unique: false
            },
            foreignKey: 'kineticRequestId',
            otherKey: 'transfectionId'
        });
        KineticRequest.belongsToMany(models.AntigenReagent, {
            through: {
                model: models.KineticRequestMapping,
                // Created unique keys in mappings table because of length bug
                unique: false
            },
            foreignKey: 'kineticRequestId',
            otherKey: 'antigenId'
        });
        KineticRequest.belongsToMany(models.BioreactorPurification, {
            through: {
                model: models.KineticRequestMapping,
                // Created unique keys in mappings table because of length bug
                unique: false
            },
            foreignKey: 'kineticRequestId',
            otherKey: 'bioreactorPurificationId'
        });
        KineticRequest.belongsToMany(models.CellLinePurification, {
            through: {
                model: models.KineticRequestMapping,
                // Created unique keys in mappings table because of length bug
                unique: false
            },
            foreignKey: 'kineticRequestId',
            otherKey: 'cellLinePurificationId'
        });
    };

    return KineticRequest;
};
