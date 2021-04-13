'use strict';

// ADP -- BCC
module.exports = function (sequelize, DataTypes) {
    const Sort = sequelize.define('Sort', {
        // specific
        name: DataTypes.STRING,
        activationId: DataTypes.INTEGER,
        mixConditionId: DataTypes.INTEGER,
        bCellSourceId: DataTypes.INTEGER,

        operatorUserId: {
            type: DataTypes.INTEGER,
            references: { model: 'Users', key: 'id' }
        },
        // Number of Plates Integer
        numberOfPlates: DataTypes.INTEGER,
        // sort operator String User name search
        // mode of sort Enum?
        ENUM_sortMode: DataTypes.STRING,
        // Population sorted Enum
        ENUM_population: DataTypes.STRING,
        // Antigen Specificity ENUM
        ENUM_antigenSpecificity: DataTypes.STRING,
        // cells seeded Integer
        cellsSeeded: DataTypes.INTEGER,
        // sorter used Enum
        ENUM_sorterUsed: DataTypes.STRING,
        // Time sort was started String Time picker
        timeSortStarted: DataTypes.DATE,
        // Time finished String Time picker
        timeFinished: DataTypes.DATE,

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

    Sort.associate = function (models) {
        Sort.belongsTo(models.Activation, { foreignKey: 'activationId', targetKey: 'id' });
        Sort.belongsTo(models.BCellSource, { foreignKey: 'bCellSourceId', targetKey: 'id' });
        Sort.belongsTo(models.MixCondition, { foreignKey: 'mixConditionId', targetKey: 'id' });
        Sort.hasMany(models.BCCPlate, { foreignKey: 'sortId', sourceKey: 'id' });
    };

    return Sort;
};
