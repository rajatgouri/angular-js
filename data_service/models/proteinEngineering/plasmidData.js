'use strict';
// This table doesn't get updated by the data service

module.exports = function (sequelize, DataTypes) {
    const PlasmidData = sequelize.define('PlasmidData', {
        plasmidId: DataTypes.INTEGER,
        urn: DataTypes.STRING,
        dnaSequence: DataTypes.TEXT,
        aaSequence: DataTypes.TEXT,
        aaSeqStart: DataTypes.INTEGER,
        aaSeqEnd: DataTypes.INTEGER
    }, {
        updatedAt: false
    });

    PlasmidData.associate = function (models) {
        models.PlasmidData.belongsTo(models.Plasmid, { foreignKey: 'plasmidId', sourceKey: 'id' });
    };

    return PlasmidData;
};
