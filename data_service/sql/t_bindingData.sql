Select
	pur.`name` as 'Purification #',
	CONCAT_WS('', pro.`name`, pro2.`name`) as 'Protein Name',
	bind.sensorType as 'Sensor Type',
	bind.sensorId as 'Sensor',
	bind.`type` AS 'Experiment Type',
	bind.loadingSensorId as 'Loading Sensor',
	bind.concentration as 'Molar Concentration (nM)',
	CASE When bind.lowResponse = 1 Then 'Yes' When bind.lowResponse = 0 then 'No' ELSE NULL END AS 'Low Response?',
	CASE When bind.realResponse = 1 Then 'Yes' When bind.realResponse = 0 then 'No' ELSE NULL END AS 'Real Response?',
	bind.response as 'Response',
	bind.kd as 'KD - Affinity Constant (1/Ms)',
	bind.kdError as 'KD Error',
	bind.kon as 'kon - Rate of Association (1/s)',
	bind.konError as 'kon Error',
	bind.kdis as 'kdis - Rate of Disassociation (1/s)',
	bind.kdisError as 'kdis Error',
	bind.rMax as 'Rmax - Maximum Response',
	bind.rMaxError as 'RMax Error',
	bind.kobs as 'kobs - Observed Binding Rate',
	bind.req as 'req - Response at equilibrium',
	bind.fullX2 as 'Full X^2',
	bind.fullR2 as 'Full R^2',
	bind.startDate as 'Experiment Date',
	bind.fittingType as 'Fitting Type',
	bind.instrumentType as 'Instrument',
	bind.notes AS 'Notes',
	created.displayName as 'Analyzed By'


From BindingData bind
Left Join ProteinPurifications pur on bind.purificationId = pur.id
Left Join Transfections t on pur.transfectionId = t.id
Left Join TransfectionRequests tr on t.trqId = tr.id
Left Join Proteins pro on tr.proteinId = pro.id
Left Join Transfections t2 ON bind.transfectionId = t2.id
Left Join TransfectionRequests tr2 ON t2.trqId = tr2.id
Left Join Proteins pro2 on tr2.proteinId = pro2.id
Left Join Users created on created.id = bind.createdBy
Where bind.isDeleted = 0