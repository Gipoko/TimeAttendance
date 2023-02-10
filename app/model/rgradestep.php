<?php

class rgradestep extends DB\SQL\Mapper {

	protected $allowed_fields = array(

       
		"rgradestep_gradeno",
		"rgradestep_stepno",
		"rgradestep_salary",
        "rgradestep_effectivity",
		"rgradestep_is_active"
	);

	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'rgradestep');
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
		$sql = "UPPER(rgradestep_gradeno) = ?";
		return array_map(array($this,'cast'),$this->find(array($sql, strtoupper($bn))));
	}

	public function countRecords() {
		$sql = "SELECT COUNT(*) as totalRecords FROM rgradestep";
		return $this->db->exec($sql);
	}

	public function countRecordsWithFilter($filter) {
		$sql = "SELECT count(*) as totalFilteredRecords FROM rgradestep WHERE 1 $filter";
		return $this->db->exec($sql);
	}

	public function getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage) {
		$sql = "SELECT * from rgradestep ";
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
		$data['rgradestep_created']=$this->getCurrentDateTime();
		$data['rgradestep_updated']=$this->getCurrentDateTime();
		$this->copyFrom($data);
		$this->insert();
		return $this->GET('rgradestep_id');
	}

	public function edit($id, $unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$this->load(array('rgradestep_id=?',$id));
		$this->copyFrom('POST');
		$data['rgradestep_updated']=$this->getCurrentDateTime();

		$this->update();
	}

	public function delete($id) {
		$this->load(array('rgradestep_id=?',$id));
		$this->erase();
	}
    public function view($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage)
    {
		$sql = "SELECT rgradestep.rgradestep_id, rgradestep_step.rgradestep_id
		FROM rgradestep
		INNER JOIN rgradestep_step ON rgradestep.rgradestep_id =rgradestep_step.rgradestep_id; ";
$sql = $sql . "WHERE 1 ".$searchQuery." order by ".$columnName." ".$columnSortOrder." limit ".$row.",".$rowperpage;
return $this->db->exec($sql);
    }

	// public function findGradeStep($grade, $step, $currentYear) {
	// 	$sql = "SELECT * FROM rgradestep WHERE rgradestep_gradeno = ? AND rgradestep_stepno = ? AND rgradestep_effectivity=?";
	// 	return $this->db->exec($sql, array(1=>$grade, 2=>$step, $currentYear));
	// }
	public function findGradeStep($grade, $step) {
		$sql = "SELECT * FROM rgradestep WHERE rgradestep_gradeno = ? AND rgradestep_stepno = ?";
		return $this->db->exec($sql, array(1=>$grade, 2=>$step));
	}

	public function findStep($grade, $step){
		$sql = "SELECT * FROM rgradestep WHERE rgradestep_gradeno = ? AND rgradestep_stepno = ? ";
		return $this->db->exec($sql, array(1=>$grade, 2=>$step));
	}

	
} 