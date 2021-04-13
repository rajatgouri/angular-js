Select
  # Summary
  t.`name` as 'Transfection #',
  pur.`name` as 'Purification #',
  pro.`name` as 'Protein Name',
  pro.ENUM_moleculeType as 'Molecule Type',
  pro.description as 'Protein Description',
  proj.`name` as 'Project',
  tr.ENUM_transfectionPurificationMethod as 'Purification Type',
  tr.requestStatus as 'Request Status',
  tr.ENUM_transfectionTag AS 'Transfection Tag',
  tr.ENUM_transfectionCellLine AS 'Cell Line',
  tr.ENUM_transfectionPurificationMethod AS 'Purification Method',
  Date(tr.createdAt) as 'Request Date',
  reqBy.displayName AS 'Requested By',
  Date(pur.purificationDate) as 'Purification Date',
  DATE(t.transfectionDate) AS 'Transfection Date',
  Date(t.harvestDate) as 'Harvest Date',
  tr.ENUM_transfectionTag as 'Purification Tag',
  tr.ENUM_transfectionScale as 'Transfection Scale',
  tr.purifyOrNot AS 'Purify?',
  tr.dnaReady AS 'DNA Ready?',
  tr.notes AS 'Request Notes',
  apprBy.displayName AS 'Approved By',
  pur.BEX as 'Buffer Exchange',
  # First Step
  Round(MAX(IF(col.notes LIKE 'First Step', col.loadVolume, NULL)),2) as 'First Step Load Volume [mL]',
  t.octetTiter as 'Titer [ug/mL]',
  Round(MAX(IF(col.notes LIKE 'First Step', col.loadVolume, NULL)) * (t.octetTiter / 1000), 2) as 'First Step Load Mass [mg]',
  Round(MAX(IF(col.notes LIKE 'First Step', col.elutionConcentration, NULL)),2) as 'First Step Eluate Concentration [mg/mL]',
  Round(MAX(IF(col.notes LIKE 'First Step', col.elutionVolume, NULL)),2) as 'First Step Eluate Volume [mL]',
  Round(MAX(IF(col.notes LIKE 'First Step', col.elutionConcentration, NULL)) * MAX(IF(col.notes LIKE 'First Step', col.elutionVolume, NULL)), 2) as 'First Step Eluate Mass [mg]',
  Round(100*
      (MAX(IF(col.notes LIKE 'First Step', col.elutionConcentration, NULL)) * MAX(IF(col.notes LIKE 'First Step', col.elutionVolume, NULL)))
      / (MAX(IF(col.notes LIKE 'First Step', col.loadVolume, NULL)) * (t.octetTiter / 1000)),
  2) as 'First Step Recovery %',
  # Post First Step SEC
  Round(MAX(IF(sec.`type` LIKE 'Post First Step', sec.mp, NULL)),2) as 'First Step POI %',
  Round(MAX(IF(sec.`type` LIKE 'Post First Step', sec.hmw, NULL)),2) as 'First Step HMW %',
  Round(MAX(IF(sec.`type` LIKE 'Post First Step', sec.lmw, NULL)),2) as 'First Step LMW %',
  # PSEC
  Round(MAX(IF(col.notes LIKE 'PSEC', col.loadVolume, NULL)),2) as 'PSEC Load Volume [mL]',
  Round(MAX(IF(col.notes LIKE 'PSEC', col.loadConcentration, NULL)),2) as 'PSEC Load Concentration [mg/mL]',
  Round(MAX(IF(col.notes LIKE 'PSEC', col.loadVolume, NULL)) * (t.octetTiter / 1000), 2) as 'PSEC Load Mass [mg]',
  Round(MAX(IF(col.notes LIKE 'PSEC', col.elutionConcentration, NULL)),2) as 'PSEC Eluate Concentration [mg/mL]',
  Round(MAX(IF(col.notes LIKE 'PSEC', col.elutionVolume, NULL)),2) as 'PSEC Eluate Volume [mL]',
  Round(MAX(IF(col.notes LIKE 'PSEC', col.elutionConcentration, NULL)) * MAX(IF(col.notes LIKE 'PSEC', col.elutionVolume, NULL)), 2) as 'PSEC Eluate Mass [mg]',
  Round(100*
      (MAX(IF(col.notes LIKE 'PSEC', col.elutionConcentration, NULL)) * MAX(IF(col.notes LIKE 'PSEC', col.elutionVolume, NULL)))
      / (MAX(IF(col.notes LIKE 'First Step', col.elutionConcentration, NULL)) * MAX(IF(col.notes LIKE 'First Step', col.elutionVolume, NULL))),
  2) as 'PSEC Recovery %',
  # Post Second Step SEC
  Round(MAX(IF(sec.`type` LIKE 'Post Second Step', sec.mp, NULL)),2) as 'Second Step POI %',
  Round(MAX(IF(sec.`type` LIKE 'Post Second Step', sec.hmw, NULL)),2) as 'Second Step HMW %',
  Round(MAX(IF(sec.`type` LIKE 'Post Second Step', sec.lmw, NULL)),2) as 'Second Step LMW %',
  # Final
  pur.finalVolume as 'Final Volume [mL]',
  pur.finalConcentration as 'Final Concentration [mg/mL]',
  Round(pur.finalVolume * pur.finalConcentration, 2) as 'Final Mass [mg]',
  Round(100*
      (pur.finalVolume * pur.finalConcentration)
      / (MAX(IF(col.notes LIKE 'First Step', col.elutionConcentration, NULL)) * MAX(IF(col.notes LIKE 'First Step', col.elutionVolume, NULL))),
  2) as 'Final Recovery %',
  # notes
  pur.notes as 'Purification Notes',
  pBy.displayName AS 'Purified By',
  tBy.displayName AS 'Transfected By'

From Proteins pro
Inner Join TransfectionRequests tr on pro.id = tr.proteinId and tr.isDeleted = 0
Left Join Transfections t on tr.id = t.trqId and t.isDeleted = 0
Left Join ProteinPurifications pur on t.id = pur.transfectionId and pur.isDeleted = 0
Left Join SECData sec on sec.proteinPurificationId = pur.id
Left Join ColumnPurificationData col on col.proteinPurificationId = pur.id
Left Join Users reqBy on tr.requesterId = reqBy.id
LEFT JOIN Users apprBy ON tr.approvedBy = apprBy.id
LEFT JOIN Users tBy ON t.createdBy = tBy.id
LEFT JOIN Users pBy ON pur.purifiedBy = pBy.id
Left join Projects proj on pro.projectId = proj.id
Where pro.isDeleted = 0
group by t.id