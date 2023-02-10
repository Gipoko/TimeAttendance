<?php

class dtrlegend extends DB\SQL\Mapper {

	protected $allowed_fields = array(
		"dtrlegend_id",
		"dtrlegend_code",
		"dtrlegend_desc",
        "dtrlegend_status"
		
	);

	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'dtrlegend');
	}

	public function all() { //get all users, admin only!
		// $this->load();
		// return $this->query;

		$sql = "SELECT * from dtrlegend ORDER BY dtrlegend_code";
		return $this->db->exec($sql);
	}

	//accept only declared fields
	private function sanitizeInput(array $data, array $fieldNames) { //sanitize input - with thanks to richgoldmd
		return array_intersect_key($data, array_flip($fieldNames));
	 }

	//find document name
	public function findByName($bn) {
		$sql = "UPPER(dtrlegend_code) = ?";
		return array_map(array($this,'cast'),$this->find(array($sql, strtoupper($bn))));
	}

	public function countRecords() {
		$sql = "SELECT COUNT(*) as totalRecords FROM dtrlegend";
		return $this->db->exec($sql);
	}

	public function countRecordsWithFilter($filter) {
		$sql = "SELECT count(*) as totalFilteredRecords FROM dtrlegend WHERE 1 $filter";
		return $this->db->exec($sql);
	}

	public function getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage) {
		$sql = "SELECT * from dtrlegend ";
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
		$data['dtrlegend_created']=$this->getCurrentDateTime();
		$data['dtrlegend_updated']=$this->getCurrentDateTime();
		$this->copyFrom($data);
		$this->insert();
		return $this->GET('dtrlegend_id');
	}

	public function edit($id, $unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$this->load(array('dtrlegend_id=?',$id));
		$this->copyFrom('POST');
		$data['dtrlegend_updated']=$this->getCurrentDateTime();

		$this->update();
	}

	public function delete($id) {
		$this->load(array('dtrlegend_id=?',$id));
		$this->erase();
	}
} 