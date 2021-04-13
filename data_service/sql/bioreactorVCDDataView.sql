SELECT 
    bioexp.`name`,
    bio.`name`,
    ROUND(TIMESTAMPDIFF(SECOND, bioexp.inoculationDate, vcdData.sampleTime)/60/60/24) as `day`,
    vcdData.totalDensity,
    vcdData.viableDensity,
    vcdData.viability,
    vcdData.titer

From BioreactorVCDData vcdData
Inner Join Bioreactors bio on vcdData.bioreactorId = bio.id
Inner Join BioreactorExperiments bioexp on bio.bioreactorExperimentId = bioexp.id
Where vcdData.isDeleted = 0