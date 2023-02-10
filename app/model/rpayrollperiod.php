<?php

class rpayrollperiod extends DB\SQL\Mapper {

	protected $allowed_fields = array(
		"rpayroll_period_id",
        "rpayroll_period",
        "rpayroll_identification",
		"rpayroll_start_date",
		"rpayroll_end_date",
		"rpayroll_status",
        "rpayroll_modifiedby",
		"rpayroll_created",
		"rpayroll_updated"
	);

	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'rpayroll_period');
	}

	public function all() { //get all users, admin only!
		$this->load();
		return $this->query;
	}

	//accept only declared fields
	private function sanitizeInput(array $data, array $fieldNames) { //sanitize input - with thanks to richgoldmd
		return array_intersect_key($data, array_flip($fieldNames));
	 }

	//find payroll name
	public function findByName($bn) {
		$sql = "UPPER(rpayroll_period) = ?";
		return array_map(array($this,'cast'),$this->find(array($sql, strtoupper($bn))));
	}

	public function countRecords() {
		$sql = "SELECT COUNT(*) as totalRecords FROM rpayroll_period";
		return $this->db->exec($sql);
	}

	public function countRecordsWithFilter($filter) {
		$sql = "SELECT count(*) as totalFilteredRecords FROM rpayroll_period WHERE 1 $filter";
		return $this->db->exec($sql);
	}

	public function getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage) {
		$sql = "SELECT * from rpayroll_period ";
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
		$data['rpayroll_created']=$this->getCurrentDateTime();
		$data['rpayroll_updated']=$this->getCurrentDateTime();
		$this->copyFrom($data);
		$this->insert();
		return $this->GET('rpayroll_period_id');
	}

	public function edit($id, $unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$this->load(array('rpayroll_period_id=?',$id));
		$this->copyFrom('POST');
		$data['rpayroll_updated']=$this->getCurrentDateTime();

		$this->update();
	}

	public function delete($id) {
		$this->load(array('rpayroll_period_id=?',$id));
		$this->erase();
	}
} 