<?php

class rallowance extends DB\SQL\Mapper {

	protected $allowed_fields = array(
		"rpr_allowance_id",
		"rpr_allowance_code",
		"rpr_allowance_desc",
		"rpr_allowance_default_amt",
		"rpr_allowance_new_amt",
		"rpr_allowance_lessthan_threshold",
		"rpr_allowance_greaterthan_threshold",
        "rpr_allowance_is_mandatory",
        "rpr_allowance_is_taxable",
        "rpr_allowance_is_active",
        "rpr_allowance_is_printable",
        "rpr_allowance_frequency",
		"rpr_allowance_formula",
		"rpr_allowance_created",
		"rpr_allowance_updated"
	);

	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'rpr_allowance');
	}

	public function all() { //get all users, admin only!
		$this->load();
		return $this->query;
	}

	//accept only declared fields
	private function sanitizeInput(array $data, array $fieldNames) { //sanitize input - with thanks to richgoldmd
		return array_intersect_key($data, array_flip($fieldNames));
	 }

	//find allowance name
	public function findByName($bn) {
		$sql = "UPPER(rpr_allowance_code) = ?";
		return array_map(array($this,'cast'),$this->find(array($sql, strtoupper($bn))));
	}

	public function countRecords() {
		$sql = "SELECT COUNT(*) as totalRecords FROM rpr_allowance";
		return $this->db->exec($sql);
	}

	public function countRecordsWithFilter($filter) {
		$sql = "SELECT count(*) as totalFilteredRecords FROM rpr_allowance WHERE 1 $filter";
		return $this->db->exec($sql);
	}

	public function getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage) {
		$sql = "SELECT * from rpr_allowance ";
		$sql = $sql . "WHERE 1 ".$searchQuery." order by ".$columnName." ".$columnSortOrder." limit ".$row.",".$rowperpage;
		return $this->db->exec($sql);
		// AND rpr_allowance_is_active = 'Active' 
	}

	//set current date and time in philippines
	public function getCurrentDateTime() {
		date_default_timezone_set('Asia/Manila');
		return date("Y-m-d H:i:s");
	}


	public function add($unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$data['rpr_allowance_created']=$this->getCurrentDateTime();
		$data['rpr_allowance_updated']=$this->getCurrentDateTime();
		$this->copyFrom($data);
		$this->insert();
		return $this->GET('rpr_allowance_id');
	}

	public function edit($id, $unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$this->load(array('rpr_allowance_id=?',$id));
		$this->copyFrom('POST');
		$data['rpr_allowance_updated']=$this->getCurrentDateTime();

		$this->update();
	}

	public function delete($id) {
		$this->load(array('rpr_allowance_id=?',$id));
		$this->erase();
	}

	public function list() {
		$sql= "SELECT * FROM rpr_allowance WHERE rpr_allowance_is_active = 'Active' ORDER BY rpr_allowance_id";
		return $this->db->exec($sql);
	}
}