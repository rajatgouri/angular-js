'use strict';

module.exports = function (sequelize, DataTypes) {
    const ADTransfectionRequest = sequelize.define('ADTransfectionRequest', {
        // Name
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        // Plasmid
        plasmidId: DataTypes.INTEGER,
        // Notes
        date: DataTypes.DATE,
        // Status
        status: DataTypes.ENUM('Pending', 'Completed'),

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

    ADTransfectionRequest.associate = function (models) {
        ADTransfectionRequest.belongsTo(models.Plasmid, { foreignKey: 'plasmidId', targetKey: 'id' });
    };

    return ADTransfectionRequest;
};
