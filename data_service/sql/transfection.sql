select t1.name as "Transfection", t2.name as "Req #", t2.requestStatus as "Status", t3.name as "Protein",
t3.description as "Protein Description", t3.ENUM_moleculeType as "Molecule Type",
SPLIT_STR(Group_concat(distinct Concat(t5.name, ' - ', t5.description)) , ',', 1) as 'DNA #1',
SPLIT_STR(Group_concat(distinct Concat(t5.name, ' - ', t5.description) ), ',', 2) as 'DNA #2',
SPLIT_STR(Group_concat(t5.concentration ), ',', 1) as 'DNA # 1 Conc',
SPLIT_STR(Group_concat(t5.concentration ), ',', 2) as 'DNA # 2 Conc'

From TransfectionRequests t2
Left Join Transfections t1 on t2.id = t1.trqId
Inner Join Proteins t3 on t2.proteinId = t3.id
Inner Join ProteinPlasmidMappings t4 on t3.id = t4.proteinId
Inner Join Plasmids t5 on t5.id = t4.plasmidId

Where (t2.requestStatus = "In Progress" or t2.requestStatus = "Pending") and t2.isDeleted = 0
Group by t2.id