'use strict';

module.exports = function (sequelize, DataTypes) {
    const CLAnalytics = sequelize.define('CLAnalytics', {
        name: DataTypes.STRING,
        // Purification
        cellLinePurificationId: DataTypes.INTEGER,
        // CE-SDS (NR) Type
        nrCESDSType: DataTypes.STRING,
        // CE-SDS (NR) MP %
        nrCESDSMP: DataTypes.FLOAT,
        // CE-SDS (NR) LMW %
        nrCESDSLMW: DataTypes.FLOAT,
        // CE-SDS (NR) HMW %
        nrCESDSHMW: DataTypes.FLOAT,
        // CE-SDS (R) Type
        rCESDSType: DataTypes.STRING,
        // CE-SDS (R) LC %
        rCESDSLC: DataTypes.FLOAT,
        // CE-SDS (R) HC %
        rCESDSHC: DataTypes.FLOAT,
        // CE-SDS (R) LMW %
        rCESDSLMW: DataTypes.FLOAT,
        // CE-SDS (R) HMW %
        rCESDSHMW: DataTypes.FLOAT,
        // cIEF Type
        cIEFType: DataTypes.STRING,
        // cIEF pI
        cIEFpI: DataTypes.FLOAT,
        // cIEF pI Range
        cIEFpIRange: DataTypes.STRING,
        // IEX Type
        iEXType: DataTypes.STRING,
        // IEX MP %
        iEXMP: DataTypes.FLOAT,
        // IEX Acidic %
        iEXAcidic: DataTypes.FLOAT,
        // IEX Basic %
        iEXBasic: DataTypes.FLOAT,
        // Other
        other: DataTypes.TEXT,

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

    CLAnalytics.associate = function (models) {
        models.CLAnalytics.belongsTo(models.CellLinePurification, {
            foreignKey: 'cellLinePurificationId',
            targetKey: 'id'
        });
        models.CLAnalytics.hasMany(models.SECData, { foreignKey: 'cellLineAnalyticId', targetKey: 'id' });
    };

    return CLAnalytics;
};
