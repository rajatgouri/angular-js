'use strict';

module.exports = function (sequelize, DataTypes) {
    const AcidTreatmentData = sequelize.define('AcidTreatmentData', {
        // cellLinePurificationId Cell Line Purificiation Yes Int (Foreign Key)
        cellLinePurificationId: DataTypes.INTEGER,
        // bioreactorPurificationId Bioreactor Purification Yes Int (Foreign Key)  Bioreactor Purifications
        bioreactorPurificationId: DataTypes.INTEGER,
        // Sample Name
        sampleName: DataTypes.STRING,
        // eluateVolume ProA Eluate Vol. (L) Yes Float
        sampleVolume: DataTypes.FLOAT,
        // eluateConcentration ProA Eluate Conc. (g/L) Yes Float
        sampleConcentration: DataTypes.FLOAT,
        //  ProA Eluate Mass (g)    Vol * Conc
        // eluatepH ProA Eluate pH Yes Float
        samplepH: DataTypes.FLOAT,
        // acidAdded Added Acid Vol, L Yes Float
        acidAdded: DataTypes.FLOAT,
        //  AT Vol. (L)    Added Acid Vol + Eluate Vol
        // acidTreatmentConcentration AT Conc. (g/L) Yes Float
        acidTreatmentConcentration: DataTypes.FLOAT,
        //  AT mass (g)    AT Vol * Conc
        //  AT recovery (%)    Eluate Mass / AT Mass
        //  Spiked Acid Vol. (%)    Added Acid Vol / Eluate Vol * 100
        // viPh VI pH Yes Float
        viPh: DataTypes.FLOAT,
        // HMW % acid treatment
        atHMW: DataTypes.FLOAT,
        // spikedBaseVolume Spiked Base Vol. (L) Yes Float
        spikedBaseVolume: DataTypes.FLOAT,
        //  Spiked Base %     SB Volume / Eluate Volume
        // neutralizedPh Neutralized pH Yes Float
        neutralizedPh: DataTypes.FLOAT,
        // pavinVol PAVIN Vol. (L) Yes Float
        pavinVol: DataTypes.FLOAT,
        // pavinConcentration PAVIN Conc. (g/L) Yes Float
        pavinConcentration: DataTypes.FLOAT,
        //  PAVIN Mass (g)    Mass * Concentration
        //  Yield%    Pavin Mass / Eluate Mass *100
        // hmw neutralization HMW % Yes Float
        nHMW: DataTypes.FLOAT,
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

    AcidTreatmentData.associate = function (models) {
        models.AcidTreatmentData.belongsTo(models.BioreactorPurification, {
            foreignKey: 'bioreactorPurificationId',
            sourceKey: 'id'
        });
        models.AcidTreatmentData.belongsTo(models.CellLinePurification, {
            foreignKey: 'cellLinePurificationId',
            sourceKey: 'id'
        });
    };

    return AcidTreatmentData;
};
