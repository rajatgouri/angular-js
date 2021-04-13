'use strict';

module.exports = function (sequelize, DataTypes) {
    const ViCellData = sequelize.define('ViCellData', {
        sampleId: DataTypes.STRING,
        logDate: DataTypes.DATE,
        runDate: DataTypes.DATE,
        fileDate: DataTypes.DATE,
        analysisVersion: DataTypes.STRING,
        // Results
        images: DataTypes.INTEGER,
        totalCells: DataTypes.INTEGER,
        viableCells: DataTypes.INTEGER,
        nonviableCells: DataTypes.INTEGER,
        viability: DataTypes.FLOAT,
        totalCellsPerMl: DataTypes.FLOAT,
        totalViableCellsPerMl: DataTypes.FLOAT,
        averageDiameter: DataTypes.FLOAT,
        averageCircularity: DataTypes.FLOAT,
        averageCellsPerImage: DataTypes.FLOAT,
        micronsPixelRatio: DataTypes.FLOAT,
        totalDiameterSum: DataTypes.FLOAT,
        totalCircularitySum: DataTypes.FLOAT,
        bkgIntensitySum: DataTypes.FLOAT,
        // Settings
        cellType: DataTypes.STRING,
        threshold: DataTypes.FLOAT,
        centerThreshold: DataTypes.FLOAT,
        minDiameter: DataTypes.FLOAT,
        maxDiameter: DataTypes.FLOAT,
        minCenterSize: DataTypes.FLOAT,
        minCircularity: DataTypes.FLOAT,
        frames: DataTypes.INTEGER,
        dilution: DataTypes.FLOAT,
        focusParameter: DataTypes.INTEGER,
        sampleFlushCycles: DataTypes.INTEGER,
        trypanBlue: DataTypes.INTEGER,
        internalDilution: DataTypes.FLOAT,
        declusterDegree: DataTypes.INTEGER,
        numBins: DataTypes.INTEGER,
        fov: DataTypes.STRING,
        sampleDepth: DataTypes.FLOAT,
        probeVolume: DataTypes.FLOAT,
        imgSize: DataTypes.STRING
        // Raw Data
        // sizeData: DataTypes.TEXT,
        // viableSizeData: DataTypes.TEXT,
        // circData: DataTypes.TEXT,
        // viableCircData: DataTypes.TEXT,
        // viabilityData: DataTypes.TEXT,
        // countData: DataTypes.TEXT,
        // viableCellsData: DataTypes.TEXT,
        // totalPerMlData: DataTypes.TEXT,
        // viablePerMlData: DataTypes.TEXT,
        // avgDiamData: DataTypes.TEXT,
        // avgCircData: DataTypes.TEXT,
        // bkgData: DataTypes.TEXT,
        // clusterSizeData: DataTypes.TEXT,
    }, {
        updatedAt: false
    });

    return ViCellData;
};
