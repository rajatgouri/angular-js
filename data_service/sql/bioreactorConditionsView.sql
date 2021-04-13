Select 
    bioexp.`name` as 'experiment',
    bio.`name` as 'bioreactor',
    bioexp.inoculationVolume,
    bioexp.inoculationDate,
    biocond.inoculationVCDTarget,
    biocond.ENUM_vesselScale as 'vesselScale',
    biocond.initialTemperature,
    biocond.tempShift1Hour,
    biocond.tempShift1Value,
    biocond.tempShift2Hour,
    biocond.tempShift2Value,
    biocond.phSetPoint,
    biocond.headspaceGasFlowRate,
    biocond.doSetpoint,
    biocond.ENUM_basalMedium as 'basalMedium',
    biocond.feedGlucoseConc,
    biocond.ENUM_feedMedium as 'feedMedium',
    bio.ENUM_harvestMethod as 'harvestMethod'

From Bioreactors bio 
Inner Join BioreactorConditions biocond on bio.bioreactorConditionId = biocond.id
Inner Join BioreactorExperiments bioexp on bio.bioreactorExperimentId = bioexp.id