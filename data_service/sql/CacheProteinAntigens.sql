BEGIN
Truncate `ProteinAntigens`;
Insert Into `ProteinAntigens` (`proteinId`, pos1Domain, pos1Antigen, pos1Class, pos2Domain, pos2Antigen, pos2Class, pos3Domain, pos3Antigen, pos3Class, pos4Domain, pos4Antigen, pos4Class, fabLocation)
Select
    `t1`.id as proteinId,
    `pos1Domain`.domain AS pos1Domain,
    IFNULL(`pos1Domain`.antigen, `pos1ClassAlt`.antigen) as pos1Antigen,
    IFNULL(`pos1Class`.class, `pos1ClassAlt`.class) as pos1Class,
    `pos2Domain`.domain AS pos2Domain,
    `pos2Domain`.antigen as pos2Antigen,
    `pos2Class`.class as pos2Class,
    `pos3Domain`.domain AS pos3Domain,
    `pos3Domain`.antigen as pos3Antigen,
    `pos3Class`.class as pos3Class,
    `pos4Domain`.domain AS pos4Domain,
    `pos4Domain`.antigen as pos4Antigen,
    `pos4Class`.class as pos4Class,

    Case
        When `t1`.`pos1` LIKE "%Fab%" then 1
        When `t1`.`pos2` LIKE "%Fab%" then 2
        When `t1`.`pos3` LIKE "%Fab%" then 3
      else null
    end as fabLocation

From (
    select
    `pro`.`id` AS `id`,
    `pro`.`name` AS `protein`,
    `pro`.`ENUM_moleculeType` AS `moleculeType`,
    `pro`.`description` AS `desc`,
    CASE
        WHEN `pro`.`description` like '% x %' Then
            `SPLIT_STR`(`pro`.`description`, 'x ', 1)
        ELSE
            pro.description
    END AS `pos1`,
    `SPLIT_STR`(`pro`.`description`, ' x ', 2) AS `pos2`,
    `SPLIT_STR`(`pro`.`description`, ' x ', 3) AS `pos3`,
    `SPLIT_STR`(`pro`.`description`, ' x ', 4) AS `pos4` 
    from
        `Proteins` `pro` 
) t1
Left Join DomainMappings pos1Domain on `t1`.`pos1` LIKE CONCAT('%', `pos1Domain`.domain, '%')
Left Join DomainMappings pos2Domain on `t1`.`pos2` LIKE CONCAT('%', `pos2Domain`.domain, '%')
Left Join DomainMappings pos3Domain on `t1`.`pos3` LIKE CONCAT('%', `pos3Domain`.domain, '%')
Left Join DomainMappings pos4Domain on `t1`.`pos4` LIKE CONCAT('%', `pos4Domain`.domain, '%')
Left Join AntigenClasses pos1Class on `pos1Domain`.antigen = `pos1Class`.antigen
Left Join AntigenClasses pos2Class on `pos2Domain`.antigen = `pos2Class`.antigen
Left Join AntigenClasses pos3Class on `pos3Domain`.antigen = `pos3Class`.antigen
Left Join AntigenClasses pos4Class on `pos4Domain`.antigen = `pos4Class`.antigen
Left Join AntigenClasses pos1ClassAlt ON `t1`.`pos1` LIKE CONCAT('%', `pos1ClassAlt`.antigen, '%')
Group by id;
END