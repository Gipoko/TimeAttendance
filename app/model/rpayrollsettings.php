<?php

class rpayrollsettings extends DB\SQL\Mapper {

	protected $allowed_fields = array(
		"rpaysettings_id",
        "rpaysettings_pagibig_employee",
        "rpaysettings_pagibig_employer",
		"rpaysettings_min_takehomepay",
		"rpaysettings_overtime",
		"rpaysettings_standard_workinghours",
        "rpaysettings_allowed_overtime_hours_beyond",
		"rpaysettings_graceperiod",
		"rpaysettings_night_hours_between_from",
        "rpaysettigs_night_hours_between_to",
        "rpaysettings_status"
	);

	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'rpayroll_settings');
	}

	public function all() { //get all users, admin only!
		$this->load();
        $this->copyTo('POST');
        
		return $this->query;
	}

	//accept only declared fields
	private function sanitizeInput(array $data, array $fieldNames) { //sanitize input - with thanks to richgoldmd
		return array_intersect_key($data, array_flip($fieldNames));
	 }

	//find payroll name
	public function findByName($bn) {
		$sql = "UPPER(rpaysettings_id) = ?";
		return array_map(array($this,'cast'),$this->find(array($sql, strtoupper($bn))));
	}

	public function countRecords() {
		$sql = "SELECT COUNT(*) as totalRecords FROM rpayroll_settings";
		return $this->db->exec($sql);
	}

	public function countRecordsWithFilter($filter) {
		$sql = "SELECT count(*) as totalFilteredRecords FROM rpayroll_settings WHERE 1 $filter";
		return $this->db->exec($sql);
	}

	public function getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage) {
		$sql = "SELECT * from rpayroll_settings ";
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
		$data['rpaysettings_created']=$this->getCurrentDateTime();
		$data['rpaysettings_updated']=$this->getCurrentDateTime();
		$this->copyFrom($data);
		$this->insert();
		return $this->GET('rpaysettings_id');
	}

	public function edit($id, $unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$this->load(array('rpaysettings_id=?',$id));
		$this->copyFrom('POST');
		$data['rpaysettings_updated']=$this->getCurrentDateTime();

		$this->update();
	}

	public function delete($id) {
		$this->load(array('rpaysettings_id=?',$id));
		$this->erase();
	}
    public function edits($id)
    {
        $this->load(array('rpaysettings_id=?',$id));
        $this->copyFrom('POST');
        $this->update();
    }
} 