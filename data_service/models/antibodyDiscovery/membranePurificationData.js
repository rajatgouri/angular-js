'use strict';

module.exports = function (sequelize, DataTypes) {
    const MembranePurificationData = sequelize.define('MembranePurificationData', {
        // cellLinePurificationId Cell Line Purificiation Yes Int (Foreign Key)
        cellLinePurificationId: DataTypes.INTEGER,
        // bioreactorPurificationId Bioreactor Purification Yes Int (Foreign Key)  Bioreactor Purifications
        bioreactorPurificationId: DataTypes.INTEGER,
        // Sample name (bioreactor purifications if not proa)
        sampleName: DataTypes.STRING,
        // Membrane Type
        membraneType: DataTypes.STRING,
        // membraneVolume Membrane Volume (mL) Yes Float
        membraneVolume: DataTypes.FLOAT,
        // loadPh Load pH Yes Float
        loadPh: DataTypes.FLOAT,
        // loadConductivity Load cond. (ms/cm) Yes Float
        loadConductivity: DataTypes.FLOAT,
        // loadConcentration Load Conc.  (g/L) Yes Float
        loadConcentration: DataTypes.FLOAT,
        // loadVolume Load Volume (L) Yes Float
        loadVolume: DataTypes.FLOAT,
        //  Load Mass (g)    Load Conc * Mass
        //  Loading (g/Lm)    Load Mass / 75 * 1000
        // eluateConcentration Eluate Conc.  (g/L) Yes Float
        eluateConcentration: DataTypes.FLOAT,
        // eluateVolume Eluate volume (L) Yes Float
        eluateVolume: DataTypes.FLOAT,
        //  Eluate mass (g)    Eluate Conc * Volume
        //  Yield %    Eluate Mass / Load Mass * 100
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

    MembranePurificationData.associate = function (models) {
        models.MembranePurificationData.belongsTo(models.BioreactorPurification, {
            foreignKey: 'bioreactorPurificationId',
            sourceKey: 'id'
        });
        models.MembranePurificationData.belongsTo(models.CellLinePurification, {
            foreignKey: 'cellLinePurificationId',
            sourceKey: 'id'
        });
    };

    return MembranePurificationData;
};
