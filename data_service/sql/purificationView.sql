Select
  # Summary
  pro.name as 'protein',
  pro.description as 'proteinDesc',
  pro.ENUM_moleculeType as 'proteinType',
  tr.ENUM_transfectionScale as 'transfectionScale',
  tr.ENUM_transfectionCellLine as 'cellLine',
  tr.ENUM_transfectionTag as 'transfectionTag',
  t.name as 'transfection',
  tBy.displayName as 'transfectedBy',
  t.octetTiter as 'titer',
  pur.name as 'purification',
  purBy.displayName as 'purifiedBy',
  pur.purificationDate as 'purificationDate',
  pur.BEX as 'bufferExchange',
  tr.ENUM_transfectionPurificationMethod as 'purificationType',
  # First Step
  Round(MAX(IF(col.notes LIKE 'First Step', col.loadVolume, NULL)),2) as 'firstStepLoadVolume',
  t.octetTiter as 'titer',
  Round(MAX(IF(col.notes LIKE 'First Step', col.loadVolume, NULL)) * (t.octetTiter / 1000), 2) as 'firstStepLoadMass',
  Round(MAX(IF(col.notes LIKE 'First Step', col.elutionConcentration, NULL)),2) as 'firstStepEluateConc',
  Round(MAX(IF(col.notes LIKE 'First Step', col.elutionVolume, NULL)),2) as 'firstStepEluateVolume',
  Round(MAX(IF(col.notes LIKE 'First Step', col.elutionConcentration, NULL)) * MAX(IF(col.notes LIKE 'First Step', col.elutionVolume, NULL)), 2) as 'firstStepEluateMass',
  Round(100*
      (MAX(IF(col.notes LIKE 'First Step', col.elutionConcentration, NULL)) * MAX(IF(col.notes LIKE 'First Step', col.elutionVolume, NULL)))
      / (MAX(IF(col.notes LIKE 'First Step', col.loadVolume, NULL)) * (t.octetTiter / 1000)),
  2) as 'firstStepRecovery',
  # PSEC
  Round(MAX(IF(col.notes LIKE 'PSEC', col.loadVolume, NULL)),2) as 'PSECLoadVolume',
  Round(MAX(IF(col.notes LIKE 'PSEC', col.loadConcentration, NULL)),2) as 'PSECLoadConc',
  Round(MAX(IF(col.notes LIKE 'PSEC', col.loadVolume, NULL)) * (t.octetTiter / 1000), 2) as 'PSECLoadMass',
  Round(MAX(IF(col.notes LIKE 'PSEC', col.elutionConcentration, NULL)),2) as 'PSECEluateConc',
  Round(MAX(IF(col.notes LIKE 'PSEC', col.elutionVolume, NULL)),2) as 'PSECEluateVolume',
  Round(MAX(IF(col.notes LIKE 'PSEC', col.elutionConcentration, NULL)) * MAX(IF(col.notes LIKE 'PSEC', col.elutionVolume, NULL)), 2) as 'PSECEluateMass',
  Round(100*
      (MAX(IF(col.notes LIKE 'PSEC', col.elutionConcentration, NULL)) * MAX(IF(col.notes LIKE 'PSEC', col.elutionVolume, NULL)))
      / (MAX(IF(col.notes LIKE 'First Step', col.elutionConcentration, NULL)) * MAX(IF(col.notes LIKE 'First Step', col.elutionVolume, NULL))),
  2) as 'PSECRecovery',
  # Final
  pur.finalVolume as 'finalVolume',
  pur.finalConcentration as 'finalConcentration',
  Round(pur.finalVolume * pur.finalConcentration, 2) as 'finalMass',
  Round(100*
      (pur.finalVolume * pur.finalConcentration)
      / (MAX(IF(col.notes LIKE 'First Step', col.elutionConcentration, NULL)) * MAX(IF(col.notes LIKE 'First Step', col.elutionVolume, NULL))),
  2) as 'finalRecovery',
  # notes
  pur.notes as 'notes'

From ProteinPurifications pur
Inner Join Transfections t on pur.transfectionId = t.id
Inner Join TransfectionRequests tr on t.trqId = tr.id
Inner Join Proteins pro on tr.proteinId = pro.id
Left Join ColumnPurificationData col on col.proteinPurificationId = pur.id
Inner Join Users purBy on pur.purifiedBy = purBy.id
Inner Join Users tBy on t.createdBy = tBy.id
Where 
  (tr.requestStatus LIKE 'Completed' or tr.requestStatus LIKE 'Failed')
  and tr.isDeleted = 0
  and pur.isDeleted = 0
group by pur.id