'use strict';

module.exports = function (sequelize, DataTypes) {
    const CloningAndSequence = sequelize.define('CloningAndSequence', {
        // specific
        name: DataTypes.STRING,
        wellRescueId: {
            type: DataTypes.INTEGER,
            references: { model: 'WellRescues', key: 'id' }
        },
        // VL 1 List<String>
        // VL 2 List<String>
        // VL 3 List<String>
        // VL 4 List<String>
        vlList: DataTypes.TEXT,
        // VL Comments String
        vlClone: DataTypes.INTEGER,
        vlComments: DataTypes.TEXT,
        // VH 1 List<String>
        // VH 2 List<String>
        // VH 3 List<String>
        // VH 4 List<String>
        vhList: DataTypes.TEXT,
        // VH Comments String
        vhClone: DataTypes.INTEGER,
        vhComments: DataTypes.TEXT,

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

    CloningAndSequence.associate = function (models) {
        models.CloningAndSequence.belongsTo(models.WellRescue, { foreignKey: 'wellRescueId', sourceKey: 'id' });
    };

    return CloningAndSequence;
};
