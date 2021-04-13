'use strict';

// BCC -- B Cell Source
module.exports = function (sequelize, DataTypes) {
    const BCellSource = sequelize.define('BCellSource', {
        name: DataTypes.STRING,
        // Activation ID Integer Activation Table  Yes
        activationId: DataTypes.INTEGER,
        // Rabbit ID Number String   Yes
        rabbitIdNumber: DataTypes.STRING,
        // Tissue ENUM  PBMC, Spleen Yes
        ENUM_tissue: DataTypes.STRING,
        // Date sample obtained Date
        dateSampleObtained: DataTypes.DATE,
        // Number of vials thawed Integer
        numberOfVialsThawed: DataTypes.INTEGER,
        // Operator String User name search
        operator: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        // Stain type ENUM Stain Type Table  Yes
        ENUM_stainType: DataTypes.STRING,
        // Enrichment Type ENUM Enrichement Table  No
        ENUM_enrichmentType: DataTypes.STRING,
        // Lysis Boolean   Yes
        lysis: DataTypes.STRING,
        // Sample Thaw Notes String
        sampleThawNotes: DataTypes.TEXT,
        // Time of thaw String Time Picker
        timeOfThaw: DataTypes.DATE,
        // Live/dead count Integer
        liveDeadCount: DataTypes.INTEGER,
        // Stain/Enrichment Time Finished String Time Picker  No
        stainEnrichmentTimeFinished: DataTypes.DATE,
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

    BCellSource.associate = function (models) {
        models.BCellSource.belongsTo(models.Activation, { foreignKey: 'activationId', targetKey: 'id' });
        models.BCellSource.hasMany(models.Sort, { foreignKey: 'bCellSourceId', sourceKey: 'id' });
    };

    return BCellSource;
};
