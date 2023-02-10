<?php

class rholiday extends DB\SQL\Mapper {

	protected $allowed_fields = array(
		"rholiday_id",
		"rholiday_code",
		"rholiday_desc",
		"rholiday_date",
        "rholiday_status",
		"rholiday_created",
		"rholiday_updated"
	);

	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'rholiday');
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
		$sql = "UPPER(rholiday_code) = ?";
		return array_map(array($this,'cast'),$this->find(array($sql, strtoupper($bn))));
	}

	public function countRecords() {
		$sql = "SELECT COUNT(*) as totalRecords FROM rholiday";
		return $this->db->exec($sql);
	}

	public function countRecordsWithFilter($filter) {
		$sql = "SELECT count(*) as totalFilteredRecords FROM rholiday WHERE 1 $filter";
		return $this->db->exec($sql);
	}

	public function getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage) {
		$sql = "SELECT * from rholiday ";
		$sql = $sql . "WHERE 1 ".$searchQuery." order by ".$columnName." ".$columnSortOrder." limit ".$row.",".$rowperpage;
		return $this->db->exec($sql);
		// AND rholiday_is_active = 'Active' 
	}

	//set current date and time in philippines
	public function getCurrentDateTime() {
		date_default_timezone_set('Asia/Manila');
		return date("Y-m-d H:i:s");
	}


	public function add($unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$data['rholiday_created']=$this->getCurrentDateTime();
		$data['rholiday_updated']=$this->getCurrentDateTime();
		$this->copyFrom($data);
		$this->insert();
		return $this->GET('rholiday_id');
	}

	public function edit($id, $unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$this->load(array('rholiday_id=?',$id));
		$this->copyFrom('POST');
		$data['rholiday_updated']=$this->getCurrentDateTime();

		$this->update();
	}

	public function delete($id) {
		$this->load(array('rholiday_id=?',$id));
		$this->erase();
	}

	public function list() {
		$sql= "SELECT * FROM rholiday WHERE rholiday_is_active = 'Active' ORDER BY rholiday_id";
		return $this->db->exec($sql);
	}
}