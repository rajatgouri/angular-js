'use strict';

module.exports = function (sequelize, DataTypes) {
    const Reservation = sequelize.define('Reservation', {
        // name: {
        //     type: DataTypes.STRING,
        //     unique: true
        // },
        projectId: DataTypes.INTEGER,
        startDate: DataTypes.DATE,
        endDate: DataTypes.DATE,
        instrumentId: DataTypes.INTEGER,
        allDay: DataTypes.BOOLEAN,
        assignedTo: DataTypes.INTEGER,

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

    Reservation.associate = function (models) {
        models.Reservation.belongsTo(models.Project, { foreignKey: 'projectId', sourceKey: 'id' });
        models.Reservation.belongsTo(models.Instrument, { foreignKey: 'instrumentId', sourceKey: 'id' });
        models.Reservation.belongsTo(models.User, { foreignKey: 'assignedTo', sourceKey: 'id' });
    };

    return Reservation;
};
