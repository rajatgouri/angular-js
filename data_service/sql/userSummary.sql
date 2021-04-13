select `t1`.`id` AS `User ID`,`t1`.`displayName` AS `Name`,`t1`.`email` AS `Email`,
convert_tz(`t1`.`updatedAt`,'+00:00','America/Vancouver') AS `Last Activity`,`t1`.`tableHistories` AS `Table History`
from `Users` `t1`
where `t1`.`email` is not null and `t1`.`isDeleted` = 0
order by `t1`.`updatedAt` desc