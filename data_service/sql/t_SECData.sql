Select
	pur.`name` as 'Purification #',
	convert_tz(sec.`date`,'+00:00','America/Vancouver') as 'SEC Date',
	round((to_days(`sec`.`date`) - to_days(`pur`.`purificationDate`)) / 7, 1) AS `age`,
	Case 
		When sec.`type` = "Post First Step" Then -1
		When sec.`type` = "Post Second Step" Then 0
		Else round((to_days(`sec`.`date`) - to_days(`pur`.`purificationDate`)) / 7)
	end as "Age (Weeks)",

	sec.`type` as 'SEC Type',
	analyzedBy.displayName as 'Analyzed By',
	sec.mp as 'POI %',
	sec.hmw as 'HMW %',
	sec.lmw as 'LMW %',
	replace(json_extract(pa.`references`, '$[0].url'), '"', '') as 'Chromatagram'


From SECData sec
Inner Join ProteinPurifications pur on sec.proteinPurificationId = pur.id and pur
Left Join ProteinAnalyticsMappings map on pur.id = map.proteinPurificationId
Left Join ProteinAnalytics pa on pa.id = map.proteinAnalysisId and pa.isDeleted = 0 and date(pa.createdAt) = date(sec.createdAt)
Left Join Users analyzedBy on analyzedBy.id = sec.analyzedBy
Where sec.isDeleted = 0
group by sec.id