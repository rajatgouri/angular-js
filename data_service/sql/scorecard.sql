Select u.displayName,
plas.num as 'plasmids', plasLot.num as 'plasmidLots', pro.num as 'proteins', tr.num as 'transfectionRequests',
t.num as 'transfections', pur.num as 'purifications', sec.num as 'sec', mals.num as 'mals', dls.num as 'dls',
cief.num as 'cIEF',  bind.num 'binding', scl.num as 'stableCellLines', cl.num as 'cellLineHarvests', clp.num as 'clPackage', clpd.num as 'clPurificationData',
bio.num as 'bioreactor', bioc.num as 'bioreactorChem', biov.num as 'bioreactorVCD', sp.num as 'supernatentPlates', sort.num as 'bccSorts',
dp.num as 'discoveryPlasmids', hp.num as 'humanizationPlasmids', wr.num as 'wellRescues',

(
ifnull(plas.num,0) + ifnull(plasLot.num,0)  + ifnull(pro.num,0) + ifnull(t.num,0) + ifnull(pur.num,0) + IFNULL(1.5*sec.num,0) +
IFNULL(1.5*mals.num,0) + IFNULL(1.5*dls.num,0) + IFNULL(1.5*cief.num,0) + ifnull(bind.num,0) +
ifnull(cl.num,0) + ifnull(clp.num,0) + ifnull(clpd.num,0) +	ifnull(bio.num,0) + ifnull(bioc.num,0) + ifnull(biov.num,0) +
ifnull(sp.num,0) + ifnull(sort.num,0) + ifnull(dp.num,0) + ifnull(hp.num,0) + ifnull(wr.num,0) )

as total

From Users u
Left Join (Select createdBy, count(*) as num
		From Plasmids
		Where updatedBy != 6
		Group By createdBy
	) plas on plas.createdBy = u.id
Left Join (Select createdBy, count(*) as num
		From PlasmidLots
		Group By createdBy
	) plasLot on plasLot.createdBy = u.id
Left Join (Select createdBy, count(*) as num
		From Proteins
		Where updatedBy != 6
		Group By createdBy
	) pro on pro.createdBy = u.id
Left Join (Select createdBy, count(*) as num
		From TransfectionRequests
		Where updatedBy != 6
		Group By createdBy
	) tr on tr.createdBy = u.id
Left Join (Select createdBy, count(*) as num
		From Transfections
		Where updatedBy != 6 AND octetTiter IS NOT null
		Group By createdBy
	) t on t.createdBy = u.id
Left Join (Select createdBy, count(*) as num
		From ProteinPurifications
		Group By createdBy
	) pur on pur.createdBy = u.id
#Left Join (Select createdBy, count(*) as num
#		From ProteinAnalytics
#		Group By createdBy
#	) pa on pa.createdBy = u.id
Left Join (SELECT t1.analyzedBy, count(*) as num
		From (Select analyzedBy From SECData WHERE updatedAt < '2018-07-20 00:00:00' Group By createdAt) as t1
		Group BY t1.analyzedBy
	) sec on sec.analyzedBy = u.id
Left Join (Select analyzedBy, count(*) as num
		From cIEFData
		Group By analyzedBy
	) cief on cief.analyzedBy = u.id
Left Join (SELECT t1.analyzedBy, count(*) as num
		From (Select analyzedBy From DLSData Group By createdAt) as t1
		Group BY t1.analyzedBy
	) dls on dls.analyzedBy = u.id
Left Join (Select analyzedBy, count(*) as num
		From (Select analyzedBy From MALSData Group By createdAt) as t1
		Group By analyzedBy
	) mals on mals.analyzedBy = u.id
Left Join (Select createdBy, count(*) as num
		From BindingData
		Group by createdBy
	) bind on bind.createdBy = u.id
Left Join (Select createdBy, count(*) as num
		From StableCellLines
		WHERE updatedBy != 4
		Group By createdBy
	) scl on scl.createdBy = u.id
Left Join (Select createdBy, count(*) as num
		From CLDHarvests
		Where updatedBy != 6
		Group By createdBy
	) cl on cl.createdBy = u.id
Left Join (Select createdBy, count(*) as num
		From CellLinePackages
		Where (updatedBy != 6 or createdBy = 6)
		Group By createdBy
	) clp on clp.createdBy = u.id
Left Join (Select createdBy, count(*) as num
		From CellLinePurificationData
		Where (updatedBy != 6 or createdBy = 6)
		Group By createdBy
	) clpd on clpd.createdBy = u.id
Left Join (Select createdBy, count(*) as num
		From Bioreactors
		Where (updatedBy != 6 or createdBy = 6)
		Group By createdBy
	) bio on bio.createdBy = u.id
Left Join (Select t1.createdBy, count(*) as num
		From (Select createdBy, updatedBy From BioreactorChemData Group By bioreactorId) as t1
		Where (t1.updatedBy != 6 or t1.createdBy = 6)
		Group By t1.createdBy
	) bioc on bioc.createdBy = u.id
Left Join (Select t1.createdBy, count(*) as num
		From (Select createdBy, updatedBy From BioreactorVCDData Group By bioreactorId) as t1
		Where (t1.updatedBy != 6 or t1.createdBy = 6)
		Group By t1.createdBy
	) biov on biov.createdBy = u.id
Left Join (Select updatedBy, count(*) as num
		From (Select createdBy, updatedBy From SupernatentPlates Group By createdAt) as t1
		Where (updatedBy != 6 or createdBy = 6)
		Group By updatedBy
	) sp on sp.updatedBy = u.id
Left Join (Select createdBy, count(*) as num
		From Sorts
		Where (updatedBy != 6 or createdBy = 6)
		Group By createdBy
	) sort on sort.createdBy = u.id
Left Join (Select createdBy, count(*) as num
		From WellRescues
		Where (updatedBy != 6 or createdBy = 6)
		Group By createdBy
	) wr on wr.createdBy = u.id
Left Join (Select createdBy, count(*) as num
		From DiscoveryPlasmids
		Where (updatedBy != 6 or createdBy = 6)
		Group By createdBy
	) dp on dp.createdBy = u.id
Left Join (Select createdBy, count(*) as num
		From HumanizationPlasmids
		Where (updatedBy != 6 or createdBy = 6)
		Group By createdBy
	) hp on hp.createdBy = u.id
Where u.isDeleted = 0
Order by total DESC