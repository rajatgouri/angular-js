SELECT 
    bioexp.`name`,
    bio.`name`,
    ROUND(TIMESTAMPDIFF(SECOND, bioexp.inoculationDate, chemData.sampleTime)/60/60/24) as `day`,
    chemData.pH,
    chemData.pO2,
    chemData.pCO2,
    chemData.gln,
    chemData.glu,
    chemData.gluc,
    chemData.lac,
    chemData.NH4,
    chemData.na,
    chemData.k,
    chemData.osmolality,
    chemData.vesselTemp,
    chemData.spargingO2,
    chemData.pHTemp,
    chemData.pO2Temp,
    chemData.pCO2Temp,
    chemData.o2Saturation,
    chemData.cO2Saturation,
    chemData.hCO3

From BioreactorChemData chemData
Inner Join Bioreactors bio on chemData.bioreactorId = bio.id
Inner Join BioreactorExperiments bioexp on bio.bioreactorExperimentId = bioexp.id
Where chemData.isDeleted = 0