Select
    bioe.name as `Experiment`,
    proj.name as 'Project',
    bioe.description as `Description`,
    bio.name as `Bioreactor ID #`,
    scl.name as `Transfection ID #`,
    protein.name as `Protein`,
    protein.ENUM_moleculeType as `Molecule Type`,
    cond.ENUM_vesselScale as `Vessel Scale (L)`,
    Date(convert_tz(bioe.inoculationDate,'+00:00','America/Vancouver')) as `Inoculation Date`,
    cond.tempShift1Hour as `Temp Shift Hour`,
    peakvcd.viableDensity as `Peak VCD`,
    Round(peakvcd.day) as `Peak VCD Day`,
    Date(convert_tz(DATE_ADD(bioe.inoculationDate, INTERVAL (SELECT harvest.day) DAY),'+00:00','America/Vancouver')) as `Harvest Date`,
    ROUND(harvest.day) as `Harvest Day`,
    harvest.viability as `Viability at Harvest`,
    bio.hcfVolume as `HCF Volume`,
    harvest.titer as `Final BioRx Titer`,
    bio.hcfTiter as `HCF Titer`,
    bio.variable as `Variable`,
    bio.ENUM_primaryRecovery as `Primary Recovery`,
    bio.notes as `Notes`

From Bioreactors bio
Left Join BioreactorConditions cond on bio.bioreactorConditionId = cond.id
Inner Join BioreactorExperiments bioe on bio.bioreactorExperimentId = bioe.id
Inner Join CellLineExperiments cellex on bioe.cellLineExperimentId = cellex.id
Inner Join StableCellLines scl on cellex.stableCellLineId = scl.id
Inner Join Proteins protein on scl.proteinId = protein.id
Inner Join Projects proj on protein.projectId = proj.id
Left Join BioreactorChemData chem on chem.bioreactorId = bio.id
Left Join BioreactorVCDData vcd on vcd.bioreactorId = bio.id
# Get peak VCD and day from VCD Table
Left Join (
    Select a.bioreactorId, t2.viableDensity, TIMESTAMPDIFF(SECOND, c.inoculationDate, a.sampleTime)/60/60/24 as `day`
    From BioreactorVCDData a
    Inner Join Bioreactors b on a.bioreactorId = b.id
    Inner Join BioreactorExperiments c on b.bioreactorExperimentId = c.id
    Join (
        Select t1.bioreactorId, Max(t1.viableDensity) as viableDensity
        From BioreactorVCDData t1
        Group by t1.bioreactorId
    ) as t2
    On t2.bioreactorId = a.bioreactorId and t2.viableDensity = a.viableDensity
) peakvcd on peakvcd.bioreactorId = bio.id
# Get Harvest Date from last entry in Run data
Left Join (
    Select a.bioreactorId,
    TIMESTAMPDIFF(SECOND, c.inoculationDate, a.sampleTime)/60/60/24 as `day`,
    ROUND(a.viability, 1) as `viability`, 
    ROUND(a.titer, 1) as `titer`
    From BioreactorVCDData a
    Inner Join Bioreactors b on a.bioreactorId = b.id
    Inner Join BioreactorExperiments c on b.bioreactorExperimentId = c.id
    Join (
        Select d.bioreactorId, Max(d.sampleTime) as sampleTime
        From BioreactorVCDData d
        Group by d.bioreactorId
    ) as t2
    On t2.bioreactorId = a.bioreactorId and t2.sampleTime = a.sampleTime
    group by b.id
) as harvest on harvest.bioreactorId = bio.id
Group by bio.id
