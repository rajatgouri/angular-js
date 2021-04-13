'use strict';

module.exports = function (sequelize, DataTypes) {
    const AntigenReagent = sequelize.define('AntigenReagent', {
        name: DataTypes.STRING,
        proteinId: DataTypes.INTEGER,
        vendor: DataTypes.STRING,
        catalogId: DataTypes.STRING,

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

    AntigenReagent.associate = function (models) {
        AntigenReagent.belongsTo(models.Protein, { foreignKey: 'proteinId', sourceKey: 'id' });
    };

    return AntigenReagent;
};
