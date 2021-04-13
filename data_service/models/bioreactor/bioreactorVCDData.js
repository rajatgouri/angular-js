'use strict';

module.exports = function (sequelize, DataTypes) {
    const BioreactorVCDData = sequelize.define('BioreactorVCDData', {
        // Bioreactor ID
        bioreactorId: DataTypes.INTEGER,
        // Sample Time
        sampleTime: DataTypes.DATE,
        // Sample ID
        sampleId: DataTypes.STRING,
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
        },
        isEdited: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    BioreactorVCDData.associate = function (models) {
        models.BioreactorVCDData.belongsTo(models.Bioreactor, { foreignKey: 'bioreactorId', targetKey: 'id' });
    };

    return BioreactorVCDData;
};
