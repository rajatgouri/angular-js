'use strict';

module.exports = function (sequelize, DataTypes) {
    const KineticRequestMapping = sequelize.define('KineticRequestMapping', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        kineticRequestId: DataTypes.INTEGER,
        proteinPurificationId: DataTypes.INTEGER,
        transfectionId: DataTypes.INTEGER,
        antigenId: DataTypes.INTEGER,
        bioreactorPurificationId: DataTypes.INTEGER,
        cellLinePurificationId: DataTypes.INTEGER
    }, {
        indexes: [{
            name: 'purificationUnique',
            unique: true,
            fields: ['kineticRequestId', 'proteinPurificationId']
        }, {
            name: 'transfectionUnique',
            unique: true,
            fields: ['kineticRequestId', 'transfectionId']
        }, {
            name: 'antigenUnique',
            unique: true,
            fields: ['kineticRequestId', 'antigenId']
        }, {
            name: 'reactorUnique',
            unique: true,
            fields: ['kineticRequestId', 'bioreactorPurificationId']
        }, {
            name: 'cloneUnique',
            unique: true,
            fields: ['kineticRequestId', 'cellLinePurificationId']
        }]
    });

    KineticRequestMapping.associate = function (models) {
        models.KineticRequestMapping.belongsTo(models.KineticRequest, {
            foreignKey: 'kineticRequestId',
            targetKey: 'id'
        });
        models.KineticRequestMapping.belongsTo(models.ProteinPurification, {
            foreignKey: 'proteinPurificationId',
            targetKey: 'id'
        });
        models.KineticRequestMapping.belongsTo(models.Transfection, {
            foreignKey: 'transfectionId',
            targetKey: 'id'
        });
        models.KineticRequestMapping.belongsTo(models.AntigenReagent, {
            foreignKey: 'antigenId',
            targetKey: 'id'
        });
        models.KineticRequestMapping.belongsTo(models.Bioreactor, {
            foreignKey: 'bioreactorPurificationId',
            targetKey: 'id'
        });
        models.KineticRequestMapping.belongsTo(models.CLDHarvest, {
            foreignKey: 'cellLinePurificationId',
            targetKey: 'id'
        });
    };

    return KineticRequestMapping;
};
