Select 
	pro.`name` as `Protein Name`,
	pro.ENUM_moleculeType as `Molecule Type`,
	pro.description as `Protein Description`,
	pro.molecularWeight as `Molecular Weight [Da]`,
	pro.molarExtCoefficient as `Extinction Coefficient`,
	pro.`pI` as `pI`, 
	pro.`createdAt` as `Protein Creation Date`,
	proj.`name` as `Project Name`,
	proj.`description` as `Project Description`,
	SPLIT_STR(Group_concat(distinct plas.name), ',', 1) as 'DNA #1',
	SPLIT_STR(Group_concat(distinct plas.description), ',', 1) as 'DNA #1 Description',
	SPLIT_STR(Group_concat(plas.ENUM_vector), ',', 1) as 'DNA #1 Vector',
	SPLIT_STR(Group_concat(plas.ENUM_bacteria), ',', 1) as 'DNA #1 Bacteria',
	SPLIT_STR(Group_concat(plas.ENUM_plasmidTag), ',', 1) as 'DNA #1 Tag',
	SPLIT_STR(Group_concat(plas.ENUM_mammalian), ',', 1) as 'DNA #1 Selection',
	SPLIT_STR(Group_concat(distinct plas.name), ',', 2) as 'DNA #2',
	SPLIT_STR(Group_concat(distinct plas.description), ',', 2) as 'DNA #2 Description',
	SPLIT_STR(Group_concat(plas.ENUM_vector), ',', 2) as 'DNA #2 Vector',
	SPLIT_STR(Group_concat(plas.ENUM_bacteria), ',', 2) as 'DNA #2 Bacteria',
	SPLIT_STR(Group_concat(plas.ENUM_plasmidTag), ',', 2) as 'DNA #2 Tag',
	SPLIT_STR(Group_concat(plas.ENUM_mammalian), ',', 2) as 'DNA #2 Selection'

From Proteins pro
Left Join ProteinPlasmidMappings map on pro.id = map.proteinId
Left Join Plasmids plas on map.plasmidId = plas.id
Inner Join Projects proj on pro.projectId = proj.id
Where pro.isDeleted = 0 and plas.isDeleted  = 0
Group by pro.id