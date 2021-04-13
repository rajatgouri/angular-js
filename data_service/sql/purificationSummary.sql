BEGIN
    Select
        # Summary
        t.name as 'transfection',
        pro.name as 'protein',
        pro.description as 'proteinDesc',
        pro.ENUM_moleculeType as 'proteinType',
        pur.name as 'purification',
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
        # Post First Step SEC
        Round(MAX(IF(sec.`type` LIKE 'Post First Step', sec.mp, NULL)),2) as 'firstStepPOI',
        Round(MAX(IF(sec.`type` LIKE 'Post First Step', sec.hmw, NULL)),2) as 'firstStepHMW',
        Round(MAX(IF(sec.`type` LIKE 'Post First Step', sec.lmw, NULL)),2) as 'firstStepLMW',
        # PSEC
        Round(MAX(IF(col.notes LIKE 'PSEC', col.loadVolume, NULL)),2) as 'PSECLoadVolume',
        Round(MAX(IF(col.notes LIKE 'PSEC', col.loadConcentration, NULL)),2) as 'PSECLoadConc',
        Round(MAX(IF(col.notes LIKE 'PSEC', col.loadVolume * col.loadConcentration, NULL)), 2) as 'PSECLoadMass',
        Round(MAX(IF(col.notes LIKE 'PSEC', col.elutionConcentration, NULL)),2) as 'PSECEluateConc',
        Round(MAX(IF(col.notes LIKE 'PSEC', col.elutionVolume, NULL)),2) as 'PSECEluateVolume',
        Round(MAX(IF(col.notes LIKE 'PSEC', col.elutionConcentration, NULL)) * MAX(IF(col.notes LIKE 'PSEC', col.elutionVolume, NULL)), 2) as 'PSECEluateMass',
        Round(100*
            (MAX(IF(col.notes LIKE 'PSEC', col.elutionConcentration, NULL)) * MAX(IF(col.notes LIKE 'PSEC', col.elutionVolume, NULL)))
            / (MAX(IF(col.notes LIKE 'First Step', col.elutionConcentration, NULL)) * MAX(IF(col.notes LIKE 'First Step', col.elutionVolume, NULL))),
        2) as 'PSECRecovery',
        # Post Second Step SEC
        Round(MAX(IF(sec.`type` LIKE 'Post Second Step', sec.mp, NULL)),2) as 'secondStepPOI',
        Round(MAX(IF(sec.`type` LIKE 'Post Second Step', sec.hmw, NULL)),2) as 'secondStepHMW',
        Round(MAX(IF(sec.`type` LIKE 'Post Second Step', sec.lmw, NULL)),2) as 'secondStepLMW',
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
    Left Join SECData sec on sec.proteinPurificationId = pur.id
    Left Join ColumnPurificationData col on col.proteinPurificationId = pur.id
    Where
        (tr.requestStatus LIKE 'Completed' or tr.requestStatus LIKE 'Failed')
        and tr.isDeleted = 0
        and pur.isDeleted = 0
        and pur.purificationDate >= startDate
        and pur.purificationDate <= DATE_ADD(endDate, INTERVAL 1 Day)

    group by pur.id
    ;
End