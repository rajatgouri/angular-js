 select
     `cr`.`name` AS `Request #`,
     cs.id AS `Construct #`,
     `cr`.`notes` AS `Request Notes`,
     IFNULL(`plasProj`.`name`, `crProj`.`name`) AS `Project`,
     IFNULL(`plasProj`.`description`, `crProj`.`description`) AS `Project Description`,
     `req`.`displayName` AS `Requester`,
     `req`.department AS `Department`,
     `cs`.`priority` AS `Priority`,
     `cs`.`description` AS `Construct Description`,
     cast(`cr`.`createdAt` as date) AS `Request Date`,
     to_days(current_timestamp()) - to_days(`cr`.`createdAt`) AS `Age`,
     `assign`.`displayName` AS `Assigned To`,
     (100*(cs.sequenceReviewed + cs.designed + cs.ordered + cs.cloned + cs.maxiprep + cs.sequenceVerified)/6) AS `Progress`,
     `cs`.`sequenceReviewed` AS `Seq Reviewed`,
     `cs`.`designed` AS `Designed`,
     `cs`.`ordered` AS `Ordered`,
     `cs`.`cloned` AS `Cloned`,
     `cs`.`maxiprep` AS `Maxiprep`,
     `cs`.`sequenceVerified` AS `Seq Verified`,
     `cs`.`completed` AS `Completed`,
     IF(`cs`.onHold, "On Hold", `cs`.`status`) AS `Status`,
     `cs`.`adminNotes` AS `Admin Notes`,
     `plas`.`name` AS `Plasmid #`,
     GROUP_CONCAT(DISTINCT `pro`.`name`) AS `Protein Name`,
     `plas`.`ENUM_vector` AS `Vector`,
     `plas`.`description` AS `Plasmid Description`,
     `lot`.`orderRef` AS `Geneious Order Ref #`,
	  `lot`.`prepDate` AS `Plasmid Lot Prep Date`,
     `op`.`displayName` AS `Plasmid Lot Operator`,
     `lot`.`notes` AS `Plasmid Lot Notes`,
     to_days(current_timestamp()) - to_days(`cs`.`updatedAt`) AS `Last Updated Age`
FROM ConstructStatuses cs
LEFT JOIN ConstructRequests cr ON cs.constructRequestId = cr.id
LEFT JOIN Plasmids plas ON plas.constructStatusId = cs.id
LEFT JOIN Projects crProj ON cr.projectId = crProj.id
LEFT JOIN Projects plasProj ON plas.projectId = plasProj.id
LEFT JOIN PlasmidLots lot ON lot.plasmidId = plas.id
LEFT JOIN ProteinPlasmidMappings map ON map.plasmidId = plas.id
LEFT JOIN Proteins pro ON pro.id = map.proteinId
LEFT JOIN Users assign ON assign.id = cs.assignedTo
LEFT JOIN Users req ON req.id = cr.requestedBy
LEFT JOIN Users op ON op.id = lot.operator
Group by plas.id, cs.id