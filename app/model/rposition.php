<?php

class rposition extends DB\SQL\Mapper {

	protected $allowed_fields = array(
		"rposition_id",
		"rposition_code",
		"rposition_desc",
		"rposition_name",
		"rgradestep_gradeno",
		"rgradestep_stepno",
		"rposition_is_active",

		"rposition_created",
		"rposition_updated"
	);

	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'rposition');
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
		$sql = "UPPER(rposition_code) = ?";
		return array_map(array($this,'cast'),$this->find(array($sql, strtoupper($bn))));
	}

	public function countRecords() {
		$sql = "SELECT COUNT(*) as totalRecords FROM rposition";
		return $this->db->exec($sql);
	}

	public function countRecordsWithFilter($filter) {
		$sql = "SELECT count(*) as totalFilteredRecords FROM rposition WHERE 1 $filter";
		return $this->db->exec($sql);
	}

	public function getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage) {
		$sql = "SELECT * from rposition ";
		$sql = $sql . "WHERE 1 ".$searchQuery." order by ".$columnName." ".$columnSortOrder." limit ".$row.",".$rowperpage;
		return $this->db->exec($sql);
		// AND rposition_is_active = 'Active' 
	}

	//set current date and time in philippines
	public function getCurrentDateTime() {
		date_default_timezone_set('Asia/Manila');
		return date("Y-m-d H:i:s");
	}


	public function add($unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$data['rposition_created']=$this->getCurrentDateTime();
		$data['rposition_updated']=$this->getCurrentDateTime();
		$this->copyFrom($data);
		$this->insert();
		return $this->GET('rposition_id');
	}

	public function edit($id, $unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$this->load(array('rposition_id=?',$id));
		$this->copyFrom('POST');
		$data['rposition_updated']=$this->getCurrentDateTime();

		$this->update();
	}

	public function delete($id) {
		$this->load(array('rposition_id=?',$id));
		$this->erase();
	}

	public function getPositions() {
		$sql= "SELECT * FROM rposition WHERE rposition_is_active = 1 ORDER BY rposition_id";
		return $this->db->exec($sql);
	}
}