Select
	pur.`name` as 'Purification #',
	pro.`name` as 'Protein Name',
	pro.description as 'Protein Description',
	pro.ENUM_moleculeType as 'Molecule Type',
	pro.molecularWeight as 'Molecular Weight',
	pro.molarExtCoefficient as 'Extinction Coefficient',
	proj.`name` as 'Project Name',
	Date(convert_tz(pur.purificationDate,'+00:00','America/Vancouver')) as 'Purification Date',
	t.octetTiter as 'Titer',
	Date(convert_tz(sec.`date`,'+00:00','America/Vancouver')) as 'SEC Date',
	round((to_days(`sec`.`date`) - to_days(`pur`.`purificationDate`)) / 7, 1) AS `Age`,
	Case 
		When sec.`type` = "Post First Step" Then -1
		When sec.`type` = "Post Second Step" Then 0
		Else round((to_days(`sec`.`date`) - to_days(`pur`.`purificationDate`)) / 7)
	end as "Age (Weeks)",
	sec.`type` as 'SEC Type',
	analyzedBy.displayName as 'Analyzed By',
	purifiedBy.displayName as 'Purified By',
	sec.mp as 'POI %',
	sec.hmw as 'HMW %',
	sec.lmw as 'LMW %',
	
	dls.diameter as 'Diameter',
	dls.pd as '% PD',
	dls.molecularWeight as 'DLS Molecular Weight',
	dls.`aggregate` as 'Aggregation Onset Temp',
	dls.meltingTemp as 'Melting Temp',
	
	cief.mp as 'cIEF Main Peak',
	cief.rangeLow as 'cIEF Range Low',
	cief.rangeHigh as 'cIEF Range High',
	cief.sharp as 'cIEF Sharp Peak?',
	
	Round(MAX(IF(mals.peakNum = 1, mals.molecularWeight, NULL)),2) as 'MALS Peak 1 Molecular Weight',
	Round(MAX(IF(mals.peakNum = 1, mals.uncertainty, NULL)),2) as 'MALS Peak 1 Uncertainty %',
	Round(MAX(IF(mals.peakNum = 1, mals.massFraction, NULL)),2) as 'MALS Peak 1 Mass Fraction %',
	Round(MAX(IF(mals.peakNum = 2, mals.molecularWeight, NULL)),2) as 'MALS Peak 2 Molecular Weight',
	Round(MAX(IF(mals.peakNum = 2, mals.uncertainty, NULL)),2) as 'MALS Peak 2 Uncertainty %',
	Round(MAX(IF(mals.peakNum = 2, mals.massFraction, NULL)),2) as 'MALS Peak 2 Mass Fraction %',
	Round(MAX(IF(mals.peakNum = 3, mals.molecularWeight, NULL)),2) as 'MALS Peak 3 Molecular Weight',
	Round(MAX(IF(mals.peakNum = 3, mals.uncertainty, NULL)),2) as 'MALS Peak 3 Uncertainty %',
	Round(MAX(IF(mals.peakNum = 4, mals.massFraction, NULL)),2) as 'MALS Peak 3 Mass Fraction %'

From SECData sec
Inner Join ProteinPurifications pur on sec.proteinPurificationId = pur.id and pur.isDeleted = 0
Left Join DLSData dls on pur.id = dls.proteinPurificationId and dls.isDeleted = 0
Left Join MALSData mals on pur.id = mals.proteinPurificationId and mals.isDeleted = 0
Left Join cIEFData cief on pur.id = cief.proteinPurificationId and cief.isDeleted = 0
Inner Join Transfections t on pur.transfectionId = t.id and t.isDeleted = 0
Inner Join TransfectionRequests tr on t.trqId = tr.id and tr.isDeleted = 0
Inner Join Proteins pro on tr.proteinId = pro.id and pro.isDeleted = 0
Inner Join Projects proj on pro.projectId = proj.id
Left Join Users analyzedBy on analyzedBy.id = sec.analyzedBy
Left Join Users purifiedBy on purifiedBy.id = pur.purifiedBy
Where sec.isDeleted = 0
group by sec.id