'use strict';

module.exports = function (sequelize, DataTypes) {
    const MALSData = sequelize.define('MALSData', {
        // Protein Purification
        proteinPurificationId: {
            type: DataTypes.INTEGER,
            unique: 'uniquePeakPur'
        },
        peakNum: {
            type: DataTypes.INTEGER,
            unique: 'uniquePeakPur'
        },
        // Measurements
        molecularWeight: DataTypes.DOUBLE,
        uncertainty: DataTypes.DOUBLE,
        massFraction: DataTypes.DOUBLE,

        // common
        analyzedBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        date: DataTypes.DATE,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    MALSData.associate = function (models) {
        models.MALSData.belongsTo(models.ProteinPurification, {
            foreignKey: 'proteinPurificationId',
            sourceKey: 'id'
        });
    };

    return MALSData;
};
