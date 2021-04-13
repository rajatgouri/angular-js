Select 
	pur.`name` as 'Purification #',
	pro.`name` as 'Protein #',
	reqUser.displayName as 'Requested By',
	initial.start as 'Starting Volume (mL)',
	pur.volumeRemaining as 'Volume Remaining (mL)',
	req.volumeUsed / 1000 as 'Volume Used (mL)',
	req.status as 'Status'
From ProteinRequests req
Left Join ProteinPurifications pur on req.proteinPurificationId = pur.id
Left Join (
	Select pur.id as 'id', (pur.volumeRemaining + SUM(req.volumeUsed/1000)) as 'start'
	From ProteinRequests req
	Inner Join ProteinPurifications pur on req.proteinPurificationId = pur.id
) initial on pur.id = initial.id
Left Join Transfections t on pur.transfectionId = t.id and t.isDeleted = 0
Left Join TransfectionRequests tr on t.trqId = tr.id and tr.isDeleted = 0
Left Join Proteins pro on tr.proteinId = pro.id and pro.isDeleted = 0 
Left Join Users reqUser on reqUser.id = req.createdBy
Where req.isDeleted = 0