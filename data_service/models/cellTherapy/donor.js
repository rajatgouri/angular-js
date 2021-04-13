'use strict';

module.exports = function (sequelize, DataTypes) {
    const Donor = sequelize.define('Donor', {
        // Name
        name: DataTypes.STRING,
        cellSourceId: DataTypes.INTEGER,
        sampleId: DataTypes.STRING,
        collectionDate: DataTypes.DATE,
        bloodType: DataTypes.STRING,
        age: DataTypes.INTEGER,
        gender: DataTypes.STRING,
        cmvStatus: DataTypes.STRING,
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

    Donor.associate = function (models) {
        models.Donor.belongsTo(models.CellSource, { foreignKey: 'cellSourceId', targetKey: 'id' });
    };

    return Donor;
};
