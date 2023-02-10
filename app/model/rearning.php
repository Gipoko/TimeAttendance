<?php

class rearning extends DB\SQL\Mapper {

	protected $allowed_fields = array(
		"rpr_earning_id",
		"rpr_earning_code",
		"rpr_earning_desc",
		"rpr_earning_default_amt",
		"rpr_earning_new_amt",
		"rpr_earning_lessthan_threshold",
		"rpr_earning_greaterthan_threshold",
        "rpr_earning_is_mandatory",
        "rpr_earning_is_taxable",
        "rpr_earning_is_active",
        "rpr_earning_is_printable",
        "rpr_earning_frequency",
		"rpr_earning_formula",
		"rpr_earning_created",
		"rpr_earning_updated"
	);

	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'rpr_earning');
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
		$sql = "UPPER(rpr_earning_code) = ?";
		return array_map(array($this,'cast'),$this->find(array($sql, strtoupper($bn))));
	}

	public function countRecords() {
		$sql = "SELECT COUNT(*) as totalRecords FROM rpr_earning";
		return $this->db->exec($sql);
	}

	public function countRecordsWithFilter($filter) {
		$sql = "SELECT count(*) as totalFilteredRecords FROM rpr_earning WHERE 1 $filter";
		return $this->db->exec($sql);
	}

	public function getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage) {
		$sql = "SELECT * from rpr_earning ";
		$sql = $sql . "WHERE 1 ".$searchQuery." order by ".$columnName." ".$columnSortOrder." limit ".$row.",".$rowperpage;
		return $this->db->exec($sql);
		// AND rpr_earning_is_active = 'Active' 
	}

	//set current date and time in philippines
	public function getCurrentDateTime() {
		date_default_timezone_set('Asia/Manila');
		return date("Y-m-d H:i:s");
	}


	public function add($unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$data['rpr_earning_created']=$this->getCurrentDateTime();
		$data['rpr_earning_updated']=$this->getCurrentDateTime();
		$this->copyFrom($data);
		$this->insert();
		return $this->GET('rpr_earning_id');
	}

	public function edit($id, $unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$this->load(array('rpr_earning_id=?',$id));
		$this->copyFrom('POST');
		$data['rpr_earning_updated']=$this->getCurrentDateTime();

		$this->update();
	}

	public function delete($id) {
		$this->load(array('rpr_earning_id=?',$id));
		$this->erase();
	}

	public function list() {
		$sql= "SELECT * FROM rpr_earning WHERE rpr_earning_is_active = 'Active' ORDER BY rpr_earning_id";
		return $this->db->exec($sql);
	}
}