'use strict';

// Research
module.exports = function (sequelize, DataTypes) {
    const ProteinRequest = sequelize.define('ProteinRequest', {
        name: DataTypes.STRING,
        requestStatus: {
            type: DataTypes.ENUM('Submitted', 'Completed', 'Denied'),
            defaultValue: 'Submitted'
        },
        proteinPurificationId: DataTypes.INTEGER,
        proteinId: DataTypes.INTEGER,
        // Amount
        massAmount: DataTypes.DOUBLE,
        volumeAmount: DataTypes.DOUBLE,
        // Volume used in fulfillment
        volumeUsed: DataTypes.DOUBLE,
        // Notes TEXT
        notes: DataTypes.TEXT,
        // common
        createdBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    ProteinRequest.associate = function (models) {
        models.ProteinRequest.belongsTo(models.ProteinPurification, {
            foreignKey: 'proteinPurificationId',
            sourceKey: 'id'
        });
        models.ProteinRequest.belongsTo(models.Protein, { foreignKey: 'proteinId', sourceKey: 'id' });
    };

    return ProteinRequest;
};
