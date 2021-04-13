'use strict';

module.exports = function (sequelize, DataTypes) {
    const CTVessel = sequelize.define('CTVessel', {
        name: DataTypes.STRING,
        experimentId: DataTypes.INTEGER,
        cellThawId: DataTypes.INTEGER,
        // Vessel Type
        vesselTypeId: DataTypes.INTEGER,
        // Cells Seeded
        cellsSeeded: DataTypes.INTEGER,
        // Stimulation
        purificationId: DataTypes.INTEGER,
        stimulationNotes: DataTypes.STRING,
        // Dose
        dose: DataTypes.STRING,
        // Seed Volume
        seedVolume: DataTypes.FLOAT,

        wellColumn: DataTypes.CHAR,
        wellRow: DataTypes.INTEGER,

        notes: DataTypes.TEXT,

        //common
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
        },
    });

    CTVessel.associate = function (models) {
        models.CTVessel.belongsTo(models.CTExperiment, { foreignKey: 'experimentId', sourceKey: 'id' });
        models.CTVessel.belongsTo(models.CellThaw, { foreignKey: 'cellThawId', sourceKey: 'id' });
        models.CTVessel.belongsTo(models.CTVesselType, { foreignKey: 'vesselTypeId', sourceKey: 'id' });
        models.CTVessel.hasMany(models.BioreactorChemData, { foreignKey: 'vesselId', targetKey: 'id' })
    };

    return CTVessel;
};
