'use strict';

// ADE -- BCCPlate
module.exports = function (sequelize, DataTypes) {
    const BCCPlate = sequelize.define('BCCPlate', {
        name: DataTypes.STRING,
        sortId: DataTypes.INTEGER,
        status: {
            type: DataTypes.ENUM('Not Sorted', 'Sorted'),
            defaultValue: 'Not Sorted'
        },
        // Time Sorted Date/time Recorded when status is updated to "sorted"
        timeSorted: DataTypes.DATE,

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

    BCCPlate.associate = function (models) {
        BCCPlate.hasOne(models.SupernatentPlate, { foreignKey: 'bCCPlateId', sourceKey: 'id' });
        BCCPlate.belongsTo(models.Sort, { foreignKey: 'sortId', targetKey: 'id' });
    };

    return BCCPlate;
};
