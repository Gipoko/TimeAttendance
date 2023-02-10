<?php

class temp extends DB\SQL\Mapper {
	protected $allowed_fields = array(
		"temp_id",
		"philsys_id",
		"philsys_doi",
		"philsys_poi",
		"rtitle_id",
		"temp_last",
		"temp_mid",
		"temp_first",
		"temp_suffice",
		"temp_blood",
		"temp_gender",
		"temp_dob",
		"rreligion_id",
		"temp_marital",
		"temp_pob",
		"rcountry_code",
		"regcode",
		"provcode",
		"citymuncode",
		"brgycode",
		"temp_zone",
		"temp_street",
		"temp_bldgno",
		"temp_pobox",
		"temp_zipcode",
		"temp_landline",
		"temp_mobile",
		"temp_email",
		"temp_fb",
		"temp_whatsapp",
		"temp_viber",
		"rbank_id",
		"temp_bank_address",
		"temp_bank_account",
		"temp_bank_expire",
		"temp_datejoined",
		"temp_biometric_id",
		"temp_efn",
		"temp_hashcode",
		"temp_gsis",
		"temp_sss",
		"temp_birtin",
		"temp_philhealth",
		"temp_pagibig",
		"remployment_status_id",
		"tuser_id",
		"created_at",
		"updated_at"
	);

	protected $sql;
	protected $f3;

	private function sanitizeInput(array $data, array $fieldNames) { //sanitize input - with thanks to richgoldmd
	   return array_intersect_key($data, array_flip($fieldNames));
	}

	public function __construct(DB\SQL $db)  {
		$f3=Base::instance();
		$this->f3= $f3;
		parent::__construct($db,'temp');
		$this->sql = "SELECT tp.temp_efn,
		trim(concat(tp.temp_first, ' ', tp.temp_mid,' ',tp.temp_last,' ', tp.rsuffix_id)) AS fullName,
		tp.philsys_id,
		tp.philsys_doi,
		tp.philsys_poi,
		tp.rgender_id,
		tp.temp_dob,
		tp.rmarital_id,
		tp.temp_datejoined

	FROM temp tp";
	}

	public function all() { //get all users, admin only!
		$this->load();
		return $this->query;
	}
	public function searchByBioID($bioid) {
		$sql = "SELECT temp_id FROM temp WHERE temp_biometric_id = ?";
		return $this->db->exec($sql, array(1=>$bioid));
	}

	//add
	public function add( $unsanitizeddata ) {
		$this->getCurrentDateTime();
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$data['created_at']=$this->getCurrentDateTime();
		$data['updated_at']=$this->getCurrentDateTime();
		// var_dump($data);
		// die;
		$this->copyFrom($data);
		$this->insert();

		return $this->GET('_id');
	}

	//update
	public function edit($hash, $unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$data['updated_at']=$this->getCurrentDateTime();
		$this->load(array('tperson_hash=?',$hash));
		$this->copyFrom($data);
		$this->update();
		return $this->tperson_id;
	}

	public function delete($id) {
		$this->load(array('tperson_hash=?',$id));
		$id = $this->user_id;
		$this->erase();
		return $id;
	}

	public function deleteEmployee($id) {
		$this->load(array('temp_id=?',$id));
		$id = $this->temp_id;
		$this->erase();
		return $id;
	}

	public function getCurrentDateTime() {
		date_default_timezone_set('Asia/Manila');
		return date("Y-m-d H:i:s");
	}

	public function getCurrentDateOnly() {
		date_default_timezone_set('Asia/Manila');
		return date("Y-m-d");
	}



	public function checkduplicateName($first, $mid, $last, $id=0) {
		$this->load(array('upper(tperson_first) = ? AND upper(tperson_mid) = ? AND upper(tperson_last) = ?',$first,$mid, $last));
		if(!$this->dry())
		{
			if ($id ==0 && $this->tperson_id != $id) {
				return true;
			} else if (($id != 0 && $this->tperson_id != $id)) {
				return true;
			}
			return false;
		}
		return false;
	}

	public function updatePerson($id) {
		$this->load(array('temp_id=?',$id));
		$this->copyFrom('POST');
		$this->update();
	}
	public function updatePersonUserID($id, $UserID) {
		$this->load(array('temp_id=?',$id));
		$this->tuser_id = $UserID;
		$this->update();
	}

	public function deletePerson($id){
		$this->load(array('temp_id=?',$id));
		$this->erase();
	}

	public function getPersonDetails($id) {
        $sql = "SELECT * FROM tperson WHERE tperson_id = ?";
        return $this->db->exec($sql, array(1=>$id));
	}
public function getEmployeeList(){
		$sql="SELECT tp.temp_id,
				     /* tp.temp_suffice, */
					 trim(concat(tp.temp_first, ' ', tp.temp_mid,' ',tp.temp_last,' ',  IF(tp.temp_suffice = 'n/a', '', tp.temp_suffice))) AS fullName
		FROM temp tp";
		return $this->db->exec($sql);
	}
	
	public function getPersonByUserID($id) {
		$sql = "SELECT * FROM tperson WHERE id = ?";
        return $this->db->exec($sql, array(1=>$id));
	}

	public function getByHash($hash) {
		$this->load(array('temp_hashcode=?', $hash));
	}

	public function getPersonDetailsByHash($id) {
		$sql = "SELECT tperson.*, users.user_type
			FROM users users
			RIGHT OUTER JOIN tperson tperson
				ON (users.id = tperson.user_id)
		 WHERE tperson_hash = ?";
        return $this->db->exec($sql, array(1=>$id));
	}

	public function getUserInfoByUserID($userID) {
		$this->load(array('tuser_id=?', $userID));
	}

	public function getGroupId($userID){
		$sql = "SELECT * from tuser
	 WHERE tusers_id= ?";
	return $this->db->exec($sql, array(1=>$id));
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

	public function countRecords() {

		$sql = "SELECT COUNT(*) as totalRecords FROM temp";

		return $this->db->exec($sql);
	}
	public function getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage) {
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

		$sql = $sql . " WHERE 1 ".$searchQuery." order by ".$columnName." ".$columnSortOrder." limit ".$row.",".$rowperpage;

		return $this->db->exec($sql);
	}

	public function getAllEmployeeShortDetails() {
		$sql = $this->sql;
		return $this->db->exec($sql);
	}

	public function findByHashCode($hc) {
		$sql = "select tmp.*,
		rp.rposition_desc,
		rdiv.rdivision_name,
		rdu.rdivision_sectionunit_name,
		emt.remployment_type_desc,
		(select rreligion.rreligion_desc FROM rreligion WHERE rreligion.rreligion_id = tmp.rreligion_id) AS rreligion_desc,
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
LEFT join temp tp ON TP.temp_id = tw.temp_work_reporting_to_id
		WHERE tmp.temp_hashcode = ?";
		return $this->db->exec($sql, array(1=>$hc));
	}

	public function findEmployeeByUserID($id) {
		$sql = "SELECT tp.*,
					trim(concat(tp.temp_first, ' ', tp.temp_mid,' ',tp.temp_last,' ', tp.rsuffix_id)) AS fullName,
					(select rreligion.rreligion_desc FROM rreligion WHERE rreligion.rreligion_id = tp.rreligion_id) AS religionDesc,
					(select refbrgy.brgydesc FROM refbrgy WHERE refbrgy.brgycode = tp.brgycode) AS brgydesc,
					(select refcitymun.citymundesc FROM refcitymun WHERE refcitymun.citymuncode = tp.citymuncode) AS citymundesc,
					(select refprovince.provdesc FROM refprovince WHERE refprovince.provcode = tp.provcode) AS provdesc,
					(select distinct refregion.regdesc FROM refregion WHERE refregion.regcode = tp.regcode) AS regdesc,
					(select rbank.rbank_name FROM rbank WHERE rbank.rbank_id = tp.rbank_id) AS rbank_name,

					tp.temp_mobile,
					concat(tp.temp_building_nameno, ' ', tp.temp_street,' st., Zone ', tp.temp_zone) as shortAddress
					FROM temp tp ";
		$sql .= "WHERE user_id = ?";
        return $this->db->exec($sql, array(1=>$id));
	}

	public function getWorkByTempID($tid) {
		$sql= "SELECT m1.*,
		(SELECT remployment_type.remployment_type_desc FROM remployment_type WHERE remployment_type.remployment_type_id = m1.remployment_type_id) AS EmploymentTypeName,

		(SELECT rposition.rposition_desc FROM rposition WHERE rposition.rposition_id = m1.rposition_id) AS positionName,
		rdiv.rdivision_name,
		(SELECT rdivision_unit.rdivision_sectionunit_name FROM rdivision_unit WHERE rdivision_unit.rdivision_sectionunit_id = m1.rdivunit_id) AS unitName

		FROM temp_work m1
		LEFT JOIN temp_work m2 ON (m1.temp_id = m2.temp_id AND m1.temp_work_id < m2.temp_work_id)
		LEFT JOIN rdivision rdiv ON (rdiv.rdivision_id = m1.rdivision_id)

		WHERE m2.temp_work_id IS NULL AND m1.temp_id =?";
		 return $this->db->exec($sql, array(1=>$tid));
	}

	public function getReportingTo($active, $excludeSelf = '') {
		$sql = "SELECT tp.temp_id,
					tp.temp_efn,
					trim(concat(tp.temp_first, ' ', tp.temp_mid,' ',tp.temp_last,' ',  IF(tp.temp_suffice = 'n/a', '', tp.temp_suffice))) AS fullName
			FROM TEMP tp
		WHERE tp.remployment_status_id = ? ";
		if ($excludeSelf != '') {
			$sql .= " AND temp_efn <> ";
			return $this->db->exec($sql, array(1=>$active, 2=>$excludeSelf));
		} else {
			return $this->db->exec($sql, array(1=>$active));
		}
	}

	public function findFieldValue($fieldName, $fieldValue) {
		$sql = "SELECT * FROM temp WHERE $fieldName = '$fieldValue'";
		return $this->db->exec($sql);
	}

	public function findHash($hashCode) {
		$sql = "SELECT * FROM temp WHERE temp_hashcode = ?";
		return $this->db->exec($sql, array(1=>$hashCode));
	}

	public function findDuplicate($fldName, $fldVal, $currentTempID) {
		$foundDuplicate = false;
		$sql = "SELECT * FROM temp WHERE $fldName = '$fldVal'";
		$res = $this->db->exec($sql);

		$totalFound = count($res);
		if ( $totalFound == 0 && $currentTempID ==0 ) {
			return $foundDuplicate;
		}
		if ($totalFound > 0 && $currentTempID == $res[0]['temp_id']) {
			return $foundDuplicate;
		}

		if ($totalFound > 0 && $currentTempID != $res[0]['temp_id']) {
			return !$foundDuplicate;
		}
	}

	public function findDuplicateName($first, $mid, $last, $suffix, $dob) {
		$sql = "SELECT * FROM temp WHERE ";
		$sql .= "temp_first = ? AND temp_mid = ? AND temp_last = ? AND temp_suffice = ? AND temp_dob = ?";
		return $this->db->exec($sql, array(1=>$first, 2=>$mid, 3=>$last, 4=>$suffix, 5=>$dob));
	}
}
