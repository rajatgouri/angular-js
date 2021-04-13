'use strict';

module.exports = function (sequelize, DataTypes) {
    const BioreactorVCDDataImport = sequelize.define('BioreactorVCDDataImport', {
        // Bioreactor ID
        bioreactorId: DataTypes.INTEGER,
        // Sample ID
        sampleId: DataTypes.STRING,
        // Sample Time
        sampleTime: DataTypes.DATE,
        // Total Density
        totalDensity: DataTypes.FLOAT,
        // Viable Density
        viableDensity: DataTypes.FLOAT,
        // Viability
        viability: DataTypes.FLOAT,
        // Titer
        titer: DataTypes.FLOAT,
        // Live Diameter
        avgLiveDiameter: DataTypes.FLOAT,

        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isImported: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    BioreactorVCDDataImport.associate = function (models) {
        models.BioreactorVCDDataImport.belongsTo(models.Bioreactor, {
            foreignKey: 'bioreactorId',
            targetKey: 'id'
        });
    };

    return BioreactorVCDDataImport;
};
