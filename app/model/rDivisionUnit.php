<?php

class rDivisionUnit extends DB\SQL\Mapper {
	

	protected $allowed_fields = array(
		"rdivision_sectionunit_id",
		"rdivision_id",
		"rdivision_sectionunit_code",
		"rdivision_sectionunit_name",
		
		"rdivision_sectionunit_created",
		"rdivision_sectionunit_updated"
	);

	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'rdivision_unit');
	}



	public function all() { //get all users, admin only!
		$this->load();
		return $this->query;
	}

	//accept only declared fields
	private function sanitizeInput(array $data, array $fieldNames) { //sanitize input - with thanks to richgoldmd
		return array_intersect_key($data, array_flip($fieldNames));
	 }

	//find earning name
	public function findByName($bn) {
		$sql = "UPPER(rdivision_sectionunit_code) = ?";
		return array_map(array($this,'cast'),$this->find(array($sql, strtoupper($bn))));
	}

	public function countRecords() {
		$sql = "SELECT COUNT(*) as totalRecords FROM rdivision_unit";
		return $this->db->exec($sql);
	}

	public function countRecordsWithFilter($filter) {
		$sql = "SELECT count(*) as totalFilteredRecords FROM rdivision_unit WHERE 1 $filter";
		return $this->db->exec($sql);
	}

	public function getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage) {
		$sql = "SELECT * from rdivision_unit INNER JOIN rdivision
		ON rdivision_unit.rdivision_id = rdivision.rdivision_id ";
		$sql = $sql . "WHERE 1 ".$searchQuery." order by ".$columnName." ".$columnSortOrder." limit ".$row.",".$rowperpage;
		return $this->db->exec($sql);
		// AND rdivision_is_active = 'Active' 
	}

	//set current date and time in philippines
	public function getCurrentDateTime() {
		date_default_timezone_set('Asia/Manila');
		return date("Y-m-d H:i:s");
	}


	public function add($unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$data['rdivision_sectionunit_created']=$this->getCurrentDateTime();
		$data['rdivision_sectionunit_updated']=$this->getCurrentDateTime();
		$this->copyFrom($data);
		// var_dump($data);
		// die;
		$this->insert();
		return $this->GET('rdivision_sectionunit_id');
	}

	public function edit($id, $unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$this->load(array('rdivision_sectionunit_id=?',$id));
		$this->copyFrom('POST');
		$data['rdivision_sectionunit_updated']=$this->getCurrentDateTime();

		$this->update();
	}

	public function delete($id) {
		$this->load(array('rdivision_sectionunit_id=?',$id));
		$this->erase();
	}

	// public function list() {
	// 	$sql= "SELECT * FROM rdivision_section WHERE rdivision_is_active = 1 ORDER BY rdivision_id";
	// 	return $this->db->exec($sql);
	// }








	public function getDivisionUnitByDivisionID($divId) {
		$sql = "SELECT * FROM rdivision_unit WHERE rdivision_id = ?";
		return $this->db->exec($sql, array(1=>$divId));
	}

}