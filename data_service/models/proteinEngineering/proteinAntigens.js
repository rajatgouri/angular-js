'use strict';

// Table gets updated from the CacheProteinAntigens Stored Procedure
// Doesn't get manipulated from the Data API

module.exports = function (sequelize, DataTypes) {
    const ProteinAntigen = sequelize.define('ProteinAntigen', {
        proteinId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        pos1Domain: DataTypes.STRING,
        pos2Domain: DataTypes.STRING,
        pos3Domain: DataTypes.STRING,
        pos4Domain: DataTypes.STRING,
        pos1Antigen: DataTypes.STRING,
        pos2Antigen: DataTypes.STRING,
        pos3Antigen: DataTypes.STRING,
        pos4Antigen: DataTypes.STRING,
        pos1Class: DataTypes.STRING,
        pos2Class: DataTypes.STRING,
        pos3Class: DataTypes.STRING,
        pos4Class: DataTypes.STRING,
        fabLocation: DataTypes.INTEGER
    });

    ProteinAntigen.associate = function (models) {
        models.ProteinAntigen.belongsTo(models.Protein, { foreignKey: 'proteinId', targetKey: 'id' });
    };

    return ProteinAntigen;
};
