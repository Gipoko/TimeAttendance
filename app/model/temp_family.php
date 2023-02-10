<?php

class temp_family extends DB\SQL\Mapper {

	protected $allowed_fields = array(
		"temp_family_id",
		"temp_id",
		"temp_family_rrelation_id",
		"temp_family_first",
		"temp_family_mid",
		"temp_family_last",
		"temp_family_suffix_id",
		"temp_family_dob",
		"temp_family_created",
		"temp_family_updated"
	);

	protected $f3;

	private function sanitizeInput(array $data, array $fieldNames) { //sanitize input - with thanks to richgoldmd
	   return array_intersect_key($data, array_flip($fieldNames));
	}

	public function __construct(DB\SQL $db)  {
		$f3=Base::instance();
		$this->f3= $f3;
		parent::__construct($db,'temp_family');

	}

	//add
	public function add( $unsanitizeddata ) {
		$this->getCurrentDateTime();
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$data['temp_family_created']=$this->getCurrentDateTime();
		$data['temp_family_updated']=$this->getCurrentDateTime();
		// var_dump($data);
		// die;
		$this->copyFrom($data);
		$this->insert();

		return $this->GET('_id');
	}

	//update
	public function edit($id, $unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$data['temp_family_updated']=$this->getCurrentDateTime();
		$this->load(array('temp_family_id=?',$id));
		$this->copyFrom($data);
		$this->update();
		return $this->temp_family_id;
	}

	public function delete($id) {
		$this->load(array('temp_family_id=?',$id));
		$this->erase();
		return $id;
	}

	public function search($id) {
		$sql = "SELECT * FROM temp_family WHERE temp_family_id = ?";
        return $this->db->exec($sql, array(1=>$id));
	}

	public function getCurrentDateTime() {
		date_default_timezone_set('Asia/Manila');
		return date("Y-m-d H:i:s");
	}

	public function getCurrentDateOnly() {
		date_default_timezone_set('Asia/Manila');
		return date("Y-m-d");
	}

	public function updatePerson($id) {
		$this->load(array('tperson_id=?',$id));
		$this->copyFrom('POST');
		$this->update();
	}
	public function updatePersonUserID($id, $UserID) {
		$this->load(array('tperson_id=?',$id));
		$this->user_id = $UserID;
		$this->update();
	}

	public function deletePerson($id){
		$this->load(array('tperson_id=?',$id));
		$this->erase();
	}

	public function getAllFamilyMembers($id) {
        $sql = "SELECT * FROM temp_family WHERE temp_id = ?";
        return $this->db->exec($sql, array(1=>$id));
	}

	public function getPersonByUserID($id) {
		$sql = "SELECT * FROM tperson WHERE id = ?";
        return $this->db->exec($sql, array(1=>$id));
	}

	public function getPersonDetailsByHash($id) {
		$sql = "SELECT tperson.*, users.user_type
			FROM users users
			RIGHT OUTER JOIN tperson tperson
				ON (users.id = tperson.user_id)
		 WHERE tperson_hash = ?";
        return $this->db->exec($sql, array(1=>$id));
	}



	public function countRecords() {

		$sql = "SELECT COUNT(*) as totalRecords FROM temp_family";

		return $this->db->exec($sql);
	}



	public function getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage) {
		$sql="SELECT tp.temp_id,
		tp.temp_efn,
		tp.temp_first,
		tp.temp_last,
		trim(concat(tp.temp_first, ' ', tp.temp_mid,' ',tp.temp_last,' ', tp.rsuffix_id)) AS fullName,
		tp.philsys_id,
		tp.philsys_doi,
		tp.philsys_poi,
		tp.rgender_id,
		tp.temp_dob,
		tp.temp_marital_id,
		tp.temp_datejoined,
		tp.temp_hashcode,
		tp.temp_building_nameno,
		tp.temp_street,
		tp.temp_zone,
		(select refbrgy.brgydesc FROM refbrgy WHERE refbrgy.brgycode = tp.brgycode) AS brgydesc,
		(select refcitymun.citymundesc FROM refcitymun WHERE refcitymun.citymuncode = tp.citymuncode) AS citymundesc,
		(select refprovince.provdesc FROM refprovince WHERE refprovince.provcode = tp.provcode) AS provdesc,
		(select distinct refregion.regdesc FROM refregion WHERE refregion.regcode = tp.regcode) AS regdesc,
		tp.temp_mobile,
		rposition.rposition_desc
		FROM temp tp
		LEFT JOIN
	   (
		   SELECT temp_id, max(temp_position_id) as maxid FROM temp_position GROUP BY temp_id
	   ) temp_position ON ( temp_position.temp_id = tp.temp_id)
	   LEFT JOIN rposition rposition ON rposition.rposition_id = temp_position.maxid";

		$sql = $sql . " WHERE 1 ".$searchQuery." order by ".$columnName." ".$columnSortOrder." limit ".$row.",".$rowperpage;
		return $this->db->exec($sql);
	}



	public function findByHashCode($hc) {
		$sql = "SELECT * FROM temp WHERE temp_hashcode = ?";
		return $this->db->exec($sql, array(1=>$hc));
	}

	public function findEmployeeFamilyMembersByEmployeeID($temp_id) {
		$sql = "SELECT temp_family.*, 
		rrelation.rrelation_desc,
		concat(temp_family.temp_family_first, ' ', temp_family.temp_family_mid, ' ', temp_family.temp_family_last, ' ', if(temp_family_suffix_id='n/a', '',temp_family_suffix_id)) as fullName 
		FROM temp_family temp_family
		LEFT JOIN rrelation rrelation ON rrelation.rrelation_id = temp_family.temp_family_rrelation_id";
		
		$sql .= " WHERE temp_id = ?";
        return $this->db->exec($sql, array(1=>$temp_id));
	}

	public function findAFamilyMember($id) {
		$sql = "SELECT * FROM temp_family WHERE temp_family_id = ?";
		return $this->db->exec($sql, array(1=>$id));
	}
}
