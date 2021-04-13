select
    `plate`.`id` AS 'Plate',
    # Acitvation
    DATE(`act`.`date`) AS 'Activation Date', `proj`.`name` AS 'Project', `act`.`description` AS 'Description',
    # B Cell Source
    `bcs`.`rabbitIdNumber` AS 'Rabbit ID',`bcs`.`ENUM_tissue` AS 'Tissue',
    DATE(`bcs`.`dateSampleObtained`) AS 'Sample Obtained Date', `bcs`.`numberOfVialsThawed` AS 'Num. of Vials Thawed',
    TIME(`bcs`.`timeOfThaw`) AS 'Time of Thaw',`bcs`.`liveDeadCount` AS 'Live Dead Count',
    `bcsop`.`displayName` AS 'BCS Operator',`bcs`.`ENUM_stainType` AS 'Stain Type',
    `bcs`.`ENUM_enrichmentType` AS 'Enrichment Type',`bcs`.`lysis` AS 'Lysis?',
    `bcs`.`sampleThawNotes` as 'Sample Thaw Notes', `bcs`.`stainEnrichmentTimeFinished` AS 'Stain Enrichment Time Finished',
    # Sort
    TIME(`sort`.`timeSortStarted`) AS 'Sort Start Time',`sort`.`ENUM_sortMode` AS 'Sort Mode',
    `sort`.`ENUM_population` AS 'Population Sorted', `sort`.`ENUM_antigenSpecificity` AS 'Antigen Specificity',
    `sort`.`cellsSeeded` AS 'Cells Seeded', `sort`.`ENUM_sorterUsed` AS 'Sorter Used',
    `sortop`.`displayName` AS 'Sort Operator', TIME(`sort`.`timeFinished`) AS 'Time Finished',
    # Mix Conditions
    `feederop`.`displayName` AS 'Feeder Operator',`mixop`.`displayName` AS 'Mix Making Operator',
    `plateop`.`displayName` AS 'Plating Operator',`mix`.`ENUM_eL4B5Lot` AS 'EL4-B5Lot',
    `mix`.`ENUM_tsnLotNumber` AS 'TSN Lot #',`mix`.`perOfTsn` AS '% TSN',`mix`.`eL4B5well` AS 'EL4-B5 Well',
    `mix`.`ENUM_fbsLot` AS 'FBS Lot',`mix`.`ENUM_plateType` AS 'Plate Type', `mix`.`daysInCulture` AS 'Days in Culture',
    `mix`.`feederConcentration` AS 'Feeder Concentration', `mix`.`mlPerPlate` AS 'mL Per Plate',
    # Supernatent Plates
    `sup`.`dayOfHarvest` AS 'Day of Harvest', `sup`.`harvestVolume` AS 'Volume Removed',
    `sup`.`ENUM_reagent` AS 'Reagent', `sup`.`reagentVolume` AS 'Reagent Volume', `sup`.`ENUM_methodOfHarvest` AS 'Method of Harvest',
    `harvestOp`.`displayName`AS 'Harvest Operator', `sup`.`notes` AS 'Harvest Notes',
    # Other
    `wr`.`name` AS 'Well Rescue'

from `BCCPlates` `plate`
left join `Sorts` `sort` on(`plate`.`sortId` = `sort`.`id`)
left join `MixConditions` `mix` on(`sort`.`mixConditionId` = `mix`.`id`)
left join `BCellSources` `bcs` on(`sort`.`bCellSourceId` = `bcs`.`id`)
left join `Activations` `act` on(`sort`.`activationId` = `act`.`id`)
left join `Projects` `proj` on(`act`.`projectId` = `proj`.`id`)
left join `SupernatentPlates` `sup` on(`plate`.`id` = `sup`.`bCCPlateId`)
left join `Users` `bcsop` on (`bcs`.`operator` = `bcsop`.`id`)
left join `Users` `sortop` on (`sort`.`operatorUserId` = `sortop`.`id`)
left join `Users` `feederop` on (`mix`.`feederOperator` = `feederop`.`id`)
left join `Users` `mixop` on (`mix`.`mixMakingOperator` = `mixop`.`id`)
left join `Users` `plateop` on (`mix`.`platingOperator` = `plateop`.`id`)
left join `Users` `harvestOp` on (`sup`.`operator` = `harvestOp`.`id`)
left join `WellRescues` `wr` on (`sup`.id = `wr`.supernatentPlateId)
order by plate.id
