<?php

class rdepartment extends DB\SQL\Mapper {

	protected $allowed_fields = array(
		"rdepartment_id",
		"rdepartment_code",
		"rdepartment_name",
		
		"rdepartment_created",
		"rdepartment_updated"
	);

	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'rdepartment');
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
		$sql = "UPPER(rdepartment_code) = ?";
		return array_map(array($this,'cast'),$this->find(array($sql, strtoupper($bn))));
	}

	public function countRecords() {
		$sql = "SELECT COUNT(*) as totalRecords FROM rdepartment";
		return $this->db->exec($sql);
	}

	public function countRecordsWithFilter($filter) {
		$sql = "SELECT count(*) as totalFilteredRecords FROM rdepartment WHERE 1 $filter";
		return $this->db->exec($sql);
	}

	public function getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage) {
		$sql = "SELECT * from rdepartment ";
		$sql = $sql . "WHERE 1 ".$searchQuery." order by ".$columnName." ".$columnSortOrder." limit ".$row.",".$rowperpage;
		return $this->db->exec($sql);
		// AND rdepartment_is_active = 'Active' 
	}

	//set current date and time in philippines
	public function getCurrentDateTime() {
		date_default_timezone_set('Asia/Manila');
		return date("Y-m-d H:i:s");
	}


	public function add($unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$data['rdepartment_created']=$this->getCurrentDateTime();
		$data['rdepartment_updated']=$this->getCurrentDateTime();
		$this->copyFrom($data);
		$this->insert();
		return $this->GET('rdepartment_id');
	}

	public function edit($id, $unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$this->load(array('rdepartment_id=?',$id));
		$this->copyFrom('POST');
		$data['rdepartment_updated']=$this->getCurrentDateTime();

		$this->update();
	}

	public function delete($id) {
		$this->load(array('rdepartment_id=?',$id));
		$this->erase();
	}

	public function list() {
		$sql= "SELECT * FROM rdepartment WHERE rdepartment_is_active = 'Active' ORDER BY rdepartment_id";
		return $this->db->exec($sql);
	}
}