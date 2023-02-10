<?php

class rwithholdingtax extends DB\SQL\Mapper {

	protected $allowed_fields = array(
		"rwithtax_id",
		"rwithtax_compensation_level_from",
		"rwithtax_compensation_level_to",
        "rwithtax_percentage",
        "rwithtax_additional",
        "rwithtax_status",
        "rwithtax_paybasis",
        "rwithtax_effective_from",
        "rwithtax_effective_to"
	);

	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'rwithholding_tax');
	}

	public function all() { //get all users, admin only!
		$this->load();
		return $this->query;
	}

	//accept only declared fields
	private function sanitizeInput(array $data, array $fieldNames) { //sanitize input - with thanks to richgoldmd
		return array_intersect_key($data, array_flip($fieldNames));
	 }

	//find withtax name
	public function findByName($bn) {
		$sql = "UPPER(rwithtax_status) = ?";
		return array_map(array($this,'cast'),$this->find(array($sql, strtoupper($bn))));
	}

	public function countRecords() {
		$sql = "SELECT COUNT(*) as totalRecords FROM rwithholding_tax";
		return $this->db->exec($sql);
	}

	public function countRecordsWithFilter($filter) {
		$sql = "SELECT count(*) as totalFilteredRecords FROM rwithholding_tax WHERE 1 $filter";
		return $this->db->exec($sql);
	}

	public function getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage) {
		$sql = "SELECT * from rwithholding_tax ";
		$sql = $sql . "WHERE 1 ".$searchQuery." order by ".$columnName." ".$columnSortOrder." limit ".$row.",".$rowperpage;
		return $this->db->exec($sql);
	}

	//set current date and time in philippines
	public function getCurrentDateTime() {
		date_default_timezone_set('Asia/Manila');
		return date("Y-m-d H:i:s");
	}


	public function add($unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$data['rwithtax_created']=$this->getCurrentDateTime();
		$data['rwithtax_updated']=$this->getCurrentDateTime();
		$this->copyFrom($data);
		$this->insert();
		return $this->GET('_id');
	}

	public function edit($id, $unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$this->load(array('rwithtax_id=?',$id));
		$this->copyFrom('POST');
		$data['rwithtax_updated']=$this->getCurrentDateTime();

		$this->update();
	}

	public function delete($id) {
		$this->load(array('rwithtax_id=?',$id));
		$this->erase();
	}
} 