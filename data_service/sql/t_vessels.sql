SELECT
	experiment.`name` AS 'Experiment',
	vessel.`name` AS 'Vessel #',
	vessel.cellsSeeded AS 'Cells Seeded',
	vessel.stimulationNotes AS 'Stimulation',
	vessel.dose AS 'Dose (pM)',
	vessel.seedVolume AS 'Seed Volume (mL)',
	vessel.wellColumn AS 'Column',
	vessel.wellRow AS 'Row',
	vtype.`name` AS 'Vessel Type',
	Date(freeze.cryoDate) AS 'Cryo Date',
	freeze.preCryoViability AS 'Pre Cryo Viability',
	freeze.cryoPreservative AS 'Cryo Preservative',
	freeze.cryoVial AS 'Cryovial',
	donor.`name` AS 'Donor'

FROM CTVessels vessel
LEFT JOIN CTVesselTypes vtype ON vtype.id = vessel.vesselTypeId
LEFT JOIN CTFreezes freeze ON vessel.cellFreezeId = freeze.id
LEFT JOIN CTExperiments experiment ON vessel.experimentId = experiment.id
LEFT JOIN Donors donor ON freeze.donorId = donor.id