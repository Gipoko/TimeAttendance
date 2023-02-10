<?php

class rdeduction extends DB\SQL\Mapper {

	protected $allowed_fields = array(
		"rpr_deduction_id",
		"rpr_deduction_code",
		"rpr_deduction_desc",
		"rpr_deduction_default_amt",
		"rpr_deduction_new_amt",
		"rpr_deduction_lessthan_threshold",
		"rpr_deduction_greaterthan_threshold",
        "rpr_deduction_is_mandatory",
        "rpr_deduction_is_taxable",
        "rpr_deduction_is_active",
        "rpr_deduction_is_printable",
        "rpr_deduction_frequency",
		"rpr_deduction_formula",
		"rpr_deduction_created",
		"rpr_deduction_updated"
	);

	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'rpr_deduction');
	}

	public function all() { //get all users, admin only!
		$this->load();
		return $this->query;
	}

	//accept only declared fields
	private function sanitizeInput(array $data, array $fieldNames) { //sanitize input - with thanks to richgoldmd
		return array_intersect_key($data, array_flip($fieldNames));
	 }

	//find deduction name
	public function findByName($bn) {
		$sql = "UPPER(rpr_deduction_code) = ?";
		return array_map(array($this,'cast'),$this->find(array($sql, strtoupper($bn))));
	}

	public function countRecords() {
		$sql = "SELECT COUNT(*) as totalRecords FROM rpr_deduction";
		return $this->db->exec($sql);
	}

	public function countRecordsWithFilter($filter) {
		$sql = "SELECT count(*) as totalFilteredRecords FROM rpr_deduction WHERE 1 $filter";
		return $this->db->exec($sql);
	}

	public function getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage) {
		$sql = "SELECT * from rpr_deduction ";
		$sql = $sql . "WHERE 1 ".$searchQuery." order by ".$columnName." ".$columnSortOrder." limit ".$row.",".$rowperpage;
		return $this->db->exec($sql);
		// AND rpr_deduction_is_active = 'Active' 
	}

	//set current date and time in philippines
	public function getCurrentDateTime() {
		date_default_timezone_set('Asia/Manila');
		return date("Y-m-d H:i:s");
	}


	public function add($unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$data['rpr_deduction_created']=$this->getCurrentDateTime();
		$data['rpr_deduction_updated']=$this->getCurrentDateTime();
		$this->copyFrom($data);
		$this->insert();
		return $this->GET('rpr_deduction_id');
	}

	public function edit($id, $unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$this->load(array('rpr_deduction_id=?',$id));
		$this->copyFrom('POST');
		$data['rpr_deduction_updated']=$this->getCurrentDateTime();

		$this->update();
	}

	public function delete($id) {
		$this->load(array('rpr_deduction_id=?',$id));
		$this->erase();
	}

	public function list() {
		$sql= "SELECT * FROM rpr_deduction WHERE rpr_deduction_is_active = 'Active' ORDER BY rpr_deduction_id";
		return $this->db->exec($sql);
	}
}