'use strict';

module.exports = function (sequelize, DataTypes) {
    const BioreactorChemDataImport = sequelize.define('BioreactorChemDataImport', {
        // Bioreactor ID, parsed from Sample ID
        bioreactorId: DataTypes.INTEGER,
        // Sample Time
        sampleTime: DataTypes.DATE,
        // Sample ID
        sampleId: DataTypes.STRING,
        // pH
        pH: DataTypes.FLOAT,
        // PO2
        pO2: DataTypes.FLOAT,
        // PCO2
        pCO2: DataTypes.FLOAT,
        // Gln
        gln: DataTypes.FLOAT,
        // Glu
        glu: DataTypes.FLOAT,
        // Gluc
        gluc: DataTypes.FLOAT,
        // Lac
        lac: DataTypes.FLOAT,
        // NH4
        NH4: DataTypes.FLOAT,
        // Na+
        na: DataTypes.FLOAT,
        // K+
        k: DataTypes.FLOAT,
        // Osmolality
        osmolality: DataTypes.INTEGER,
        // Vessel Temp (oC)
        vesselTemp: DataTypes.INTEGER,
        // Sparging O2%
        spargingO2: DataTypes.FLOAT,
        // pH @ Temp
        pHTemp: DataTypes.FLOAT,
        // PO2 @ Temp
        pO2Temp: DataTypes.FLOAT,
        // PCO2 @ Temp
        pCO2Temp: DataTypes.FLOAT,
        // O2 Saturation
        o2Saturation: DataTypes.FLOAT,
        // CO2 Saturation
        cO2Saturation: DataTypes.FLOAT,
        // HCO3
        hCO3: DataTypes.FLOAT,

        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isImported: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    BioreactorChemDataImport.associate = function (models) {
        models.BioreactorChemDataImport.belongsTo(models.Bioreactor, {
            foreignKey: 'bioreactorId',
            targetKey: 'id'
        });
    };

    return BioreactorChemDataImport;
};
