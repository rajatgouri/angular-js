'use strict';

module.exports = function (sequelize, DataTypes) {
    const ColumnPurificationData = sequelize.define('ColumnPurificationData', {
        // Protein Purification
        proteinPurificationId: DataTypes.INTEGER,
        // cellLinePurificationId Cell Line Purificiation Yes Int (Foreign Key) Cell Line Purifications
        cellLinePurificationId: DataTypes.INTEGER,
        // bioreactorPurificationId Bioreactor Purification Yes Int (Foreign Key) Bioreactor Purifications
        bioreactorPurificationId: DataTypes.INTEGER,
        // bioreactorId
        bioreactorId: DataTypes.INTEGER,
        // Sample name (bioreactor purifications if not proa)
        sampleName: DataTypes.STRING,
        // Column Type
        columnType: DataTypes.STRING,
        // columnDiameter Column Diameter (cm) Yes Float
        columnDiameter: DataTypes.FLOAT,
        // columnHeight Column Height (cm) Yes Float
        columnHeight: DataTypes.FLOAT,
        //  Column Volume (L)
        columnVolume: DataTypes.FLOAT,
        // Octet Titer (g/L)  Pulled from bioreactor/harvest
        // Load Concentration (g/L)  If not proA then use manual concentration
        loadConcentration: DataTypes.FLOAT,
        // loadVolume Load Volume (L) Yes Float
        loadVolume: DataTypes.FLOAT,
        //  Load Mass (g) Titer * Load Volume
        // elutionVolume Elution Volume (V) Yes Float
        elutionVolume: DataTypes.FLOAT,
        // Elution Volume (CV) Elution Volume / Column Volume
        // elutionConcentration Elution Concentration (g/L) Yes Float
        elutionConcentration: DataTypes.FLOAT,
        //  Elution Mass (g) Elution Volume * Elution Concentration
        //  Resin Loading Load Mass / Column Volume
        //  Yield % Elution Mass / Load (Mass) * 100
        // hmw HMW % Yes Float
        hmw: DataTypes.FLOAT,
        // Purification Date
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

    ColumnPurificationData.associate = function (models) {
        models.ColumnPurificationData.belongsTo(models.BioreactorPurification, {
            foreignKey: 'bioreactorPurificationId',
            sourceKey: 'id'
        });
        models.ColumnPurificationData.belongsTo(models.Bioreactor, {
            foreignKey: 'bioreactorId',
            sourceKey: 'id'
        });
        models.ColumnPurificationData.belongsTo(models.CellLinePurification, {
            foreignKey: 'cellLinePurificationId',
            sourceKey: 'id'
        });
        models.ColumnPurificationData.belongsTo(models.ProteinPurification, {
            foreignKey: 'proteinPurificationId',
            sourceKey: 'id'
        });
    };

    return ColumnPurificationData;
};
