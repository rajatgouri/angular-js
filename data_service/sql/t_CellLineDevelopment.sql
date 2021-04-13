Select
	# General
	proj.`name` as 'Project',
	proj.description as 'Project Description',
	pro.`name` as 'Protein Name',
	pro.description as 'Protein Description',
	pro.ENUM_moleculeType as 'Molecule Type',
	scl.`name` as 'Transfection #',
	scl.ENUM_parentalCellLine as 'Parental Cell Line',
	scl.ENUM_transfectionMethod as 'Transfection Kit',
	ex.experimentType as 'Experiment Type',
	ex.scale as 'Scale',
	ex.ENUM_cultureMedia as 'Culture Media',
	ex.inoculationDate as 'Inoculation Date',
	minipool.wellName as 'Minipool Ref',
	harvest.wellName as 'Well Name',
	harvest.harvestDate as 'Harvest Date',
	DATEDIFF(harvest.harvestDate, ex.inoculationDate) as 'Length of Culture',
	REPLACE(JSON_EXTRACT(harvest.ENUM_harvestMethod, '$[0]'), '"', '') as 'Harvest Method',
	harvest.harvestDayVCD as 'HD VCD',
	harvest.harvestDayViability 'HD Viability',
	harvest.titer as 'Titer',
	pur.yield as '95% Yield',
	pur.proAHMW as 'ProA HMW',
	pur.nPrAHMW as 'nPrA HMW',
	pur.nrCELMW as 'nrCE-SDS LMW',
	pur.rCELMW as 'rCE-SDS LMW',
	pur.cIEF as 'cIEF',
	pur.nglycan as 'N-Glycan'

From CLDHarvests harvest
Left Join CellLineExperiments ex on ex.id = harvest.cellLineExperimentId
Left Join CLDHarvests minipool on ex.minipoolReference = minipool.id
Left Join CellLinePurificationData pur on pur.cellLineHarvestId = harvest.id
Left Join CellLinePackages pack on pack.id = pur.cellLinePackageId
Left Join StableCellLines scl on scl.id = ex.stableCellLineId
Left Join Proteins pro on pro.id = scl.proteinId
Left Join Projects proj on pro.projectId = proj.id