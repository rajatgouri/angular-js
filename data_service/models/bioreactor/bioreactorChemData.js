'use strict';

module.exports = function (sequelize, DataTypes) {
    const BioreactorChemData = sequelize.define('BioreactorChemData', {
        // Bioreactor ID
        bioreactorId: DataTypes.INTEGER,
        vesselId: DataTypes.INTEGER,
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
        // Working Volume
        sampleVolume: DataTypes.FLOAT,

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

    BioreactorChemData.associate = function (models) {
        models.BioreactorChemData.belongsTo(models.Bioreactor, { foreignKey: 'bioreactorId', targetKey: 'id' });
        models.BioreactorChemData.belongsTo(models.CTVessel, { foreignKey: 'vesselId', targetKey: 'id' });
    };

    return BioreactorChemData;
};
