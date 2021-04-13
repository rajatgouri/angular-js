'use strict';

module.exports = function (sequelize, DataTypes) {
    const TransfectionRequest = sequelize.define('TransfectionRequest', {
        name: DataTypes.STRING,
        requestStatus: DataTypes.STRING,
        proteinId: DataTypes.INTEGER,

        ENUM_transfectionTag: DataTypes.STRING,
        ENUM_transfectionScale: DataTypes.STRING,
        ENUM_transfectionType: DataTypes.STRING,
        ENUM_transfectionCellLine: DataTypes.STRING,
        ENUM_transfectionPurificationMethod: DataTypes.STRING,

        bufferExchange: DataTypes.ENUM('Yes', 'No'),
        purifyOrNot: DataTypes.ENUM('Yes', 'No'),
        requestedDate: DataTypes.DATE,
        requestedHarvestDate: DataTypes.DATE,
        requesterNotes: DataTypes.TEXT,
        requesterId: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        approvedBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        dnaReady: {
            type: DataTypes.ENUM('Yes', 'No'),
            defaultValue: 'No'
        },
        notes: DataTypes.TEXT,

        // common
        properties: DataTypes.TEXT,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        createdBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        }
    });

    TransfectionRequest.associate = function (models) {
        TransfectionRequest.belongsTo(models.Protein, { foreignKey: 'proteinId', sourceKey: 'id' });
        TransfectionRequest.hasMany(models.Transfection, { foreignKey: 'trqId', sourceKey: 'id' });
    };

    return TransfectionRequest;
};
