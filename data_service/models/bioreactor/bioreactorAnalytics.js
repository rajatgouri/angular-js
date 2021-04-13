'use strict';

module.exports = function (sequelize, DataTypes) {
    const BioreactorAnalytics = sequelize.define('BioreactorAnalytics', {
        // Bioreactor Purification
        bioreactorPurificationId: DataTypes.INTEGER,
        // CE-SDS (NR) Type
        nrCESDSType: DataTypes.STRING,
        // CE-SDS (NR) MP %
        nrCESDSMP: DataTypes.FLOAT,
        // CE-SDS (NR) LMW %
        nrCESDSLMW: DataTypes.FLOAT,
        // CE-SDS (NR) HMW %
        nrCESDSHMW: DataTypes.FLOAT,
        // CE-SDS (NR) NG %
        nrCESDSNG: DataTypes.FLOAT,
        // CE-SDS (NR) Analyzed By
        nrCESDSAnalyzedBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
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
        // CE-SDS (R) NG %
        rCESDSNG: DataTypes.FLOAT,
        // CE-SDS (R) Analyzed By
        rCESDSAnalyzedBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        // cIEF Type
        cIEFType: DataTypes.STRING,
        // cIEF pI
        cIEFpI: DataTypes.FLOAT,
        // cIEF pI Range
        cIEFpIRange: DataTypes.STRING,
        // cIEF Analyzed By
        cIEFAnalyzedBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        // IEX Type
        iEXType: DataTypes.STRING,
        // IEX MP %
        iEXMP: DataTypes.FLOAT,
        // IEX Acidic %
        iEXAcidic: DataTypes.FLOAT,
        // IEX Basic %
        iEXBasic: DataTypes.FLOAT,
        // IEX Analyzed By
        iEXAnalyzedBy: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        // Other
        other: DataTypes.TEXT,
        // Analysis Date
        analysisDate: DataTypes.DATE,

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

    BioreactorAnalytics.associate = function (models) {
        models.BioreactorAnalytics.belongsTo(models.BioreactorPurification, {
            foreignKey: 'bioreactorPurificationId',
            targetKey: 'id'
        });
        models.BioreactorAnalytics.hasMany(models.SECData, {
            foreignKey: 'bioreactorAnalyticId',
            targetKey: 'id'
        });
    };

    return BioreactorAnalytics;
};
