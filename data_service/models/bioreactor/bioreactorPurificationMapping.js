'use strict';

module.exports = function (sequelize, DataTypes) {
    const BioreactorPurificationMapping = sequelize.define('BioreactorPurificationMapping', {
        bioreactorId: {
            type: DataTypes.INTEGER,
            unique: 'purificationId_bioreactorId_unique'
        },
        bioreactorPurificationId: {
            type: DataTypes.INTEGER,
            unique: 'purificationId_bioreactorId_unique'
        }
    });

    BioreactorPurificationMapping.associate = function (models) {
        models.BioreactorPurificationMapping.belongsTo(models.Bioreactor, {
            foreignKey: 'bioreactorId',
            targetKey: 'id'
        });
        models.BioreactorPurificationMapping.belongsTo(models.BioreactorPurification, {
            foreignKey: 'bioreactorPurificationId',
            targetKey: 'id'
        });
    };

    return BioreactorPurificationMapping;
};
