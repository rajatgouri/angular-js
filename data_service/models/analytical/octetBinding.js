'use strict';

module.exports = function (sequelize, DataTypes) {
    const BindingData = sequelize.define('BindingData', {
        purificationId: DataTypes.INTEGER,
        transfectionId: DataTypes.INTEGER,
        // Manual
        type: DataTypes.ENUM('Affinity', 'Avidity'),
        realResponse: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        lowResponse: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        notes: DataTypes.TEXT,
        // From Excel Parse
        sensorType: DataTypes.STRING,
        sensorId: DataTypes.STRING,
        loadingSensorId: DataTypes.STRING,
        concentration: DataTypes.DOUBLE,
        response: DataTypes.DOUBLE,
        kd: DataTypes.DOUBLE,
        kdError: DataTypes.DOUBLE,
        kon: DataTypes.DOUBLE,
        konError: DataTypes.DOUBLE,
        kdis: DataTypes.DOUBLE,
        kdisError: DataTypes.DOUBLE,
        rMax: DataTypes.DOUBLE,
        rMaxError: DataTypes.DOUBLE,
        kobs: DataTypes.DOUBLE,
        req: DataTypes.DOUBLE,
        fullX2: DataTypes.DOUBLE,
        fullR2: DataTypes.DOUBLE,
        startDate: DataTypes.DATE,
        fittingType: DataTypes.STRING,
        modelType: DataTypes.STRING,
        instrumentType: DataTypes.STRING,
        associationStart: DataTypes.INTEGER,
        associationEnd: DataTypes.INTEGER,
        disassociationStart: DataTypes.INTEGER,
        disassociationEnd: DataTypes.INTEGER,
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
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    BindingData.associate = function (models) {
        models.BindingData.belongsTo(models.ProteinPurification, { foreignKey: 'purificationId', sourceKey: 'id' });
    };

    return BindingData;
};
