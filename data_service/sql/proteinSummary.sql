Select
    pro.id as `id`,
    pro.name as `name`,
    proj.name as `project`,
    proj.description as `projectDescription`,
    pro.ENUM_moleculeType as `moleculeType`,
    pro.description as `description`,
    group_concat(distinct pur.`name` separator ', ') AS `purifications`,
    group_concat(distinct plas.`name` separator ', ') AS `plasmids`,
    group_concat(distinct plas.`description` separator ', ') AS `plasmidDescription`,
    group_concat(distinct plas.`ENUM_plasmidTag` separator ', ') AS `tags`,
    group_concat(distinct t.`name` separator ', ') AS `transfections`,
    group_concat(distinct t.`octetTiter` separator ', ') AS `octetTiter`,
    group_concat(distinct pur.`finalConcentration` separator ', ') AS `concentration`,
    round(pro.`molarExtCoefficient` / pro.`molecularWeight` * 10,2) AS `nanoDrop`,
    pro.`molecularWeight` AS `molecularWeight`,
    group_concat(distinct sec.mp separator ', ') AS `poi`,
    pro.`pI` AS `pI`,
    max(cast(pur.purificationDate as date)) AS `purificationDate`,
    case
        when group_concat(distinct `pur`.`finalConcentration` separator ',') is not null
            then 'Purified'
        when group_concat(distinct `pur`.`purificationDate` separator ',') is not null
            then 'Purified'
        else 'Not Purified'
    end AS `purified` 

From `Proteins` pro
left join `TransfectionRequests` `tr` on tr.proteinId = pro.id
left join `Transfections` `t` on t.trqId = tr.id
left join `ProteinPurifications` pur on (pur.transfectionId = t.id and pur.isDeleted = 0)
left join `SECData` `sec` on (sec.proteinPurificationId = pur.id and sec.isDeleted = 0)
left join `ProteinPlasmidMappings` map on pro.id = map.proteinId
left join `Plasmids` plas on plas.id = map.plasmidId
join `Projects` proj on pro.projectId = proj.id
group by pro.id