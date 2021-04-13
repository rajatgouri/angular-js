'use strict';
// This table doesn't get updated by the data service

module.exports = function (sequelize, DataTypes) {
    const PlasmidAnnotation = sequelize.define('PlasmidAnnotation', {
        plasmidId: DataTypes.INTEGER,
        description: DataTypes.STRING,
        type: DataTypes.STRING,
        start: DataTypes.INTEGER,
        end: DataTypes.INTEGER
    }, {
        updatedAt: false
    });

    PlasmidAnnotation.associate = function (models) {
        models.PlasmidAnnotation.belongsTo(models.Plasmid, { foreignKey: 'plasmidId', sourceKey: 'id' });
    };

    return PlasmidAnnotation;
};
