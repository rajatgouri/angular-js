'use strict';

module.exports = function (sequelize, DataTypes) {
    const UFDFData = sequelize.define('UFDFData', {
        // bioreactorPurificationId Bioreactor Purification Yes Int (Foreign Key)  Bioreactor Purifications
        bioreactorPurificationId: DataTypes.INTEGER,
        // Sample Name
        sampleName: DataTypes.STRING,
        // membraneSize Membrane Size (cm2) Yes Float
        membraneSize: DataTypes.FLOAT,
        // loadConcentration Load conc. (g/L) Yes Float
        loadConcentration: DataTypes.FLOAT,
        // loadVolume Load Volume (L) Yes Float
        loadVolume: DataTypes.FLOAT,
        //  Load Mass (g)    Load Conc * Mass
        // productVolume Product volume (L) Yes Float
        productVolume: DataTypes.FLOAT,
        // productConcentration Product conc. (g/L) Yes Float
        productConcentration: DataTypes.FLOAT,
        //  Product mass (g)    Product Vol * Concentration
        //  Loading (g/m2)    Load Mass / Membrane Size * 10000
        //  Yield    Product Mass / Load Mass * 100
        // hmw HMW% Yes Float
        hmw: DataTypes.FLOAT,
        // Date
        date: DataTypes.DATE,
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

    UFDFData.associate = function (models) {
        UFDFData.belongsTo(models.BioreactorPurification, {
            foreignKey: 'bioreactorPurificationId',
            sourceKey: 'id'
        });
    };

    return UFDFData;
};
