'use strict';

module.exports = function (sequelize, DataTypes) {
    const IntactMassData = sequelize.define('IntactMassData', {
        // Foreign Key
        cellLinePurificationId: DataTypes.INTEGER,
        bioreactorPurificationId: DataTypes.INTEGER,
        pdAnalysisId: DataTypes.INTEGER,
        // Response
        // Observed Mass
        observed: DataTypes.FLOAT,
        expected: DataTypes.FLOAT,
        massError: DataTypes.FLOAT,
        // Needed?
        retentionTime: DataTypes.FLOAT,

        // Date
        date: DataTypes.DATE,
        // sample prep notes
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
        references: DataTypes.TEXT,
        properties: DataTypes.TEXT,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    IntactMassData.associate = function (models) {
        models.IntactMassData.belongsTo(models.PDAnalytics, {
            foreignKey: 'pdAnalysisId',
            sourceKey: 'id'
        });
        models.IntactMassData.belongsTo(models.CellLinePurification, {
            foreignKey: 'cellLinePurificationId',
            sourceKey: 'id'
        });
        models.IntactMassData.belongsTo(models.BioreactorPurification, {
            foreignKey: 'bioreactorPurificationId',
            sourceKey: 'id'
        });
        models.IntactMassData.belongsTo(models.ProteinPurification, {
            foreignKey: 'proteinPurificationId',
            sourceKey: 'id'
        });
    };

    return IntactMassData;
};
