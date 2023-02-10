<?php

class rschedule extends DB\SQL\Mapper {

	protected $allowed_fields = array(
		"rsched_id",
        "rsched_name",
		"rsched_amtimein",
		"rsched_amtimeout",
        "rsched_pmtimein",
        "rsched_pmtimeout",
        "rsched_entry",
		"rsched_created",
		"rsched_updated"
	);

	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'rsched');
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
		$sql = "UPPER(rsched_name) = ?";
		return array_map(array($this,'cast'),$this->find(array($sql, strtoupper($bn))));
	}

	public function countRecords() {
		$sql = "SELECT COUNT(*) as totalRecords FROM rsched";
		return $this->db->exec($sql);
	}

	public function countRecordsWithFilter($filter) {
		$sql = "SELECT count(*) as totalFilteredRecords FROM rsched WHERE 1 $filter";
		return $this->db->exec($sql);
	}

	public function getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage) {
		$sql = "SELECT * from rsched ";
		$sql = $sql . "WHERE 1 ".$searchQuery." order by ".$columnName." ".$columnSortOrder." limit ".$row.",".$rowperpage;
		return $this->db->exec($sql);
		// AND rsched_is_active = 'Active' 
	}

	//set current date and time in philippines
	public function getCurrentDateTime() {
		date_default_timezone_set('Asia/Manila');
		return date("Y-m-d H:i:s");
	}


	public function add($unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$data['rsched_created']=$this->getCurrentDateTime();
		$data['rsched_updated']=$this->getCurrentDateTime();
		$this->copyFrom($data);
		$this->insert();
		return $this->GET('rsched_id');
	}

	public function edit($id, $unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$this->load(array('rsched_id=?',$id));
		$this->copyFrom('POST');
		$data['rsched_updated']=$this->getCurrentDateTime();

		$this->update();
	}

	public function delete($id) {
		$this->load(array('rsched_id=?',$id));
		$this->erase();
	}

	public function list() {
		$sql= "SELECT * FROM rsched WHERE rsched_is_active = 'Active' ORDER BY rsched_id";
		return $this->db->exec($sql);
	}
}