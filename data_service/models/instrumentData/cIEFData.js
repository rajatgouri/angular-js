'use strict';

module.exports = function (sequelize, DataTypes) {
    const cIEFData = sequelize.define('cIEFData', {
        // Protein Purification
        proteinPurificationId: DataTypes.INTEGER,
        cellLinePurificationId: DataTypes.INTEGER,
        bioreactorPurificationId: DataTypes.INTEGER,
        // Measurements
        mp: DataTypes.DOUBLE,
        rangeLow: DataTypes.DOUBLE,
        rangeHigh: DataTypes.DOUBLE,
        sharp: DataTypes.ENUM('Yes', 'No'),
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

    cIEFData.associate = function (models) {
        models.cIEFData.belongsTo(models.ProteinPurification, {
            foreignKey: 'proteinPurificationId',
            sourceKey: 'id'
        });
        models.cIEFData.belongsTo(models.CellLinePurification, {
            foreignKey: 'cellLinePurificationId',
            sourceKey: 'id'
        });
        models.cIEFData.belongsTo(models.BioreactorPurification, {
            foreignKey: 'bioreactorPurificationId',
            sourceKey: 'id'
        });
    };

    return cIEFData;
};
