Select
  main.name as 'Purification',
  DATE_FORMAT(main.purificationDate, '%m-%d-%Y') as 'Purification Date',
  Round(weeksOld) as 'Weeks Old',
  Round(monthsOld) as 'Months Old'
  
From (
  Select pur.name, pur.purificationDate, 
  DATEDIFF(NOW(), pur.purificationDate)/7  AS weeksOld,
    TIMESTAMPDIFF(MONTH, pur.purificationDate, now()) +
    DATEDIFF(
      now(),
      pur.purificationDate + INTERVAL
        TIMESTAMPDIFF(MONTH, pur.purificationDate, now())
      MONTH
    ) /
    DATEDIFF(
      pur.purificationDate + INTERVAL
        TIMESTAMPDIFF(MONTH, pur.purificationDate, now()) + 1
      MONTH,
      pur.purificationDate + INTERVAL
        TIMESTAMPDIFF(MONTH, pur.purificationDate, now())
      MONTH
    ) as monthsOld
  From ProteinPurifications pur
  Where pur.isDeleted = 0 and pur.purificationDate >= now() - INTERVAL 12 Month
) as main

Where 
  (monthsOld > 11.75 and monthsOld < 12.10) or
  (monthsOld > 9.75 and monthsOld < 10.10) or
  (monthsOld > 7.75 and monthsOld < 8.10) or
  (monthsOld > 5.75 and monthsOld < 6.10) or
  (monthsOld > 3.75 and monthsOld < 4.10) or
  (monthsOld > 1.75 and monthsOld < 2.10) or
  (monthsOld > 0.75 and monthsOld < 1.10) or
  (weeksOld > 1.5 and weeksOld < 2.5)
Order by monthsOld asc