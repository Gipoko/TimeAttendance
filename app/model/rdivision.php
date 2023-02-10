<?php

class rdivision extends DB\SQL\Mapper {

	protected $allowed_fields = array(
		"rdivision_id",
		"rdivision_code",
		"rdivision_name",
		
		"rdivision_created",
		"rdivision_updated"
	);

	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'rdivision');
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
		$sql = "UPPER(rdivision_code) = ?";
		return array_map(array($this,'cast'),$this->find(array($sql, strtoupper($bn))));
	}

	public function countRecords() {
		$sql = "SELECT COUNT(*) as totalRecords FROM rdivision";
		return $this->db->exec($sql);
	}

	public function countRecordsWithFilter($filter) {
		$sql = "SELECT count(*) as totalFilteredRecords FROM rdivision WHERE 1 $filter";
		return $this->db->exec($sql);
	}

	public function getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage) {
		$sql = "SELECT * from rdivision ";
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
		$data['rdivision_created']=$this->getCurrentDateTime();
		$data['rdivision_updated']=$this->getCurrentDateTime();
		$this->copyFrom($data);
		// var_dump($data);
		// die;
		$this->insert();
		return $this->GET('rdivision_id');
	}

	public function edit($id, $unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$this->load(array('rdivision_id=?',$id));
		$this->copyFrom('POST');
		$data['rdivision_updated']=$this->getCurrentDateTime();

		$this->update();
	}

	public function delete($id) {
		$this->load(array('rdivision_id=?',$id));
		$this->erase();
	}

	public function list() {
		$sql= "SELECT * FROM rdivision WHERE rdivision_is_active = 1 ORDER BY rdivision_id";
		return $this->db->exec($sql);
	}


	public function getDivision(){
		$sql="SELECT * FROM rdivision";
		return $this->db->exec($sql);
		die;
	}
}