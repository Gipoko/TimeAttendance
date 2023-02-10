<?php

class rgeneratepayroll extends DB\SQL\Mapper {



	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'temp');
	}

	public function all() { //get all users, admin only!
		$this->load();
		return $this->query;
	}

	public function countRecords() {
		$sql = "SELECT COUNT(*) as totalRecords FROM temp";
		return $this->db->exec($sql);
	}

	public function countRecordsWithFilter($filter) {
		$sql="select tmp.*,
		rp.rposition_desc,
		rdiv.rdivision_name,
		rdu.rdivision_sectionunit_name,
		emt.remployment_type_desc,
		trim(concat(tp.temp_first, ' ', tp.temp_mid,' ',tp.temp_last,' ',  IF(tp.temp_suffice = 'n/a', '', tp.temp_suffice))) AS reportingTo,
				trim(concat(tmp.temp_last,' ',  IF(tmp.temp_suffice = 'n/a', '', tmp.temp_suffice))) AS lastSuffix,
				(select refbrgy.brgydesc FROM refbrgy WHERE refbrgy.brgycode = tmp.brgycode) AS brgydesc,
	  (select refcitymun.citymundesc FROM refcitymun WHERE refcitymun.citymuncode = tmp.citymuncode) AS citymundesc,
	  (select refprovince.provdesc FROM refprovince WHERE refprovince.provcode = tmp.provcode) AS provdesc,
	  (select distinct refregion.regdesc FROM refregion WHERE refregion.regcode = tmp.regcode) AS regdesc,
	  (select rbank.rbank_name FROM rbank WHERE rbank.rbank_id = tmp.rbank_id) AS rbank_name
from temp tmp

	 left join (
				   select tw2.*
					 from temp_work tw2
						  inner join (
									   select tw3.temp_id
										   ,max(tw3.temp_work_id) temp_work_id
										 from temp_work tw3
									   group by tw3.temp_id
									 ) twg on twg.temp_work_id = tw2.temp_work_id
			   ) tw on tmp.temp_id = tw.temp_id
left join rposition rp on tw.rposition_id = rp.rposition_id
LEFT JOIN rdivision rdiv ON rdiv.rdivision_id = tw.rdivision_id
LEFT JOIN rdivision_unit rdu ON rdu.rdivision_sectionunit_id = tw.rdivunit_id
LEFT JOIN remployment_type emt ON emt.remployment_type_id = tw.remployment_type_id
LEFT join temp tp ON TP.temp_id = tw.temp_work_reporting_to_id";

		$sql = $sql . " WHERE 1 $filter";

		$result = $this->db->exec($sql);

		return count($result);
	}

	public function getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage) {
		$sql="select tmp.*,
		rp.rposition_desc,
		rdiv.rdivision_name,
		rdu.rdivision_sectionunit_name,
		emt.remployment_type_desc,
		trim(concat(tp.temp_first, ' ', tp.temp_mid,' ',tp.temp_last,' ',  IF(tp.temp_suffice = 'n/a', '', tp.temp_suffice))) AS fullName,
				trim(concat(tmp.temp_last,' ',  IF(tmp.temp_suffice = 'n/a', '', tmp.temp_suffice))) AS lastSuffix,
				(select refbrgy.brgydesc FROM refbrgy WHERE refbrgy.brgycode = tmp.brgycode) AS brgydesc,
	  (select refcitymun.citymundesc FROM refcitymun WHERE refcitymun.citymuncode = tmp.citymuncode) AS citymundesc,
	  (select refprovince.provdesc FROM refprovince WHERE refprovince.provcode = tmp.provcode) AS provdesc,
	  (select distinct refregion.regdesc FROM refregion WHERE refregion.regcode = tmp.regcode) AS regdesc,
	  (select rbank.rbank_name FROM rbank WHERE rbank.rbank_id = tmp.rbank_id) AS rbank_name
from temp tmp

	 left join (
				   select tw2.*
					 from temp_work tw2
						  inner join (
									   select tw3.temp_id
										   ,max(tw3.temp_work_id) temp_work_id
										 from temp_work tw3
									   group by tw3.temp_id
									 ) twg on twg.temp_work_id = tw2.temp_work_id
			   ) tw on tmp.temp_id = tw.temp_id
left join rposition rp on tw.rposition_id = rp.rposition_id
LEFT JOIN rdivision rdiv ON rdiv.rdivision_id = tw.rdivision_id
LEFT JOIN rdivision_unit rdu ON rdu.rdivision_sectionunit_id = tw.rdivunit_id
LEFT JOIN remployment_type emt ON emt.remployment_type_id = tw.remployment_type_id
LEFT join temp tp ON TP.temp_id = tw.temp_work_reporting_to_id";

		$sql = $sql . " WHERE 1 ".$searchQuery." order by ".$columnName." ".$columnSortOrder." limit ".$row.",".$rowperpage;

		return $this->db->exec($sql);
	}

	//set current date and time in philippines
	public function getCurrentDateTime() {
		date_default_timezone_set('Asia/Manila');
		return date("Y-m-d H:i:s");
	}


	
}