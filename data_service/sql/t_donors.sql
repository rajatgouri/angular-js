SELECT
	donor.`name` AS 'Name',
	donor.sampleId AS 'Sample ID',
	DATE(donor.collectionDate) AS 'Collection Date',
	donor.bloodType AS 'Blood Type',
	donor.age AS 'Age',
	donor.gender AS 'Gender',
	donor.cmvStatus AS 'CMV Status',
	cs.orderType AS 'Type',
	cs.vendor AS 'Vendor',
	DATE(cs.deliveryDate) AS 'Delivery Date',
	cs.diversionPouchCollection AS 'Diversion Pouch Collection',
	cs.preparedBy AS 'Prepared By',
	cs.purchaseOrder AS 'PO #',
	cs.cost AS 'Cost',
	cs.orderNumber AS 'Order #'

FROM Donors donor
INNER JOIN CellSources cs ON donor.cellSourceId = cs.id
WHERE donor.isDeleted = 0 AND cs.isDeleted = 0