SELECT
	plas.NAME AS 'Plasmid',
	lot.orderRef AS 'Order Ref #',
	lot.concentration AS 'Concentration [ug/mL]',
	lot.volume AS 'Original Volume [mL]',
	lot.volume AS 'Volume Left [mL]',
	Date(lot.prepDate) AS 'Prep Date',
	lot.notes AS 'Notes',
	lot.operator AS 'Operator'

FROM PlasmidLots lot
INNER JOIN Plasmids plas ON lot.plasmidId = plas.id
LEFT JOIN Users u ON u.id = lot.operator