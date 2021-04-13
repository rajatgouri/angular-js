Select
	pur.`name` as "Purification #",
	pro.`name` as "Protein Name",
	pro.description as "Protein Description",
	proj.`name` as "Project Name",
	pro.`pI` as "pI",
	pro.ENUM_moleculeType as "Molecule Type",
	pro.molecularWeight as "Molecular Weight",
	postSecond.mp as "Post Second Step POI %", postSecond.`date` as "Post Second Step Date", lastSec.mp as "Last SEC POI %", lastSec.`date` as "Last SEC Date",
	ROUND(100 * (lastSec.mp - postSecond.mp) / postSecond.mp, 2) as "% Change",
	ROUND(lastSec.mp - postSecond.mp, 2) as "Change"

From ProteinPurifications pur
Inner Join Transfections t on pur.transfectionId = t.id and t.isDeleted = 0
Inner Join TransfectionRequests tr on t.trqId = tr.id and tr.isDeleted = 0
Inner Join Proteins pro on tr.proteinId = pro.id and pro.isDeleted = 0
Inner Join Projects proj on pro.projectId = proj.id
Inner Join (
	Select sec3.proteinPurificationId, sec3.mp, sec3.`date`
	From SECData sec3
	Where sec3.`type` LIKE "Post Second Step" and sec3.isDeleted = 0
) postSecond on pur.id = postSecond.proteinPurificationId
Left Join (
	Select  sec.proteinPurificationId, sec.mp, sec.`date`
	From SECData sec
	Left Join SECData sec2
	  on (sec.proteinPurificationId = sec2.proteinPurificationId and sec.date < sec2.date)
	Where sec.proteinPurificationId is not null and sec2.mp is null and sec.type LIKE "Stability" and sec.isDeleted = 0
) lastSec on pur.id = lastSec.proteinPurificationId
Where pur.isDeleted = 0
Group by pur.id