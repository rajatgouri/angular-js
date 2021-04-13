## Split String function, used in transfection query
## Splits a string into two columns
CREATE DEFINER=`root`@`localhost` FUNCTION `SPLIT_STR`(
    `x` VARCHAR(255),
    `delim` VARCHAR(12),
    `pos` INT

)
RETURNS varchar(255) CHARSET utf8 COLLATE utf8_unicode_ci
LANGUAGE SQL
DETERMINISTIC
CONTAINS SQL
SQL SECURITY DEFINER
COMMENT ''
BEGIN
    RETURN REPLACE(SUBSTRING(SUBSTRING_INDEX(x, delim, pos),
       LENGTH(SUBSTRING_INDEX(x, delim, pos -1)) + 1),
       delim, '');
END