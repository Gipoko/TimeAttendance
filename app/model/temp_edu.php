<?php

class temp_edu extends DB\SQL\Mapper {

	protected $allowed_fields = array(
		"temp_edu_id",
		"temp_id",
		"temp_edu_redu_id",
		"temp_edu_schoolname",
		"temp_edu_schooladdress",
		"temp_edu_course",
		"temp_edu_from",
		"temp_edu_to",
		"temp_edu_created",
		"temp_edu_updated"
	);

	protected $f3;

	private function sanitizeInput(array $data, array $fieldNames) { //sanitize input - with thanks to richgoldmd
	   return array_intersect_key($data, array_flip($fieldNames));
	}

	public function __construct(DB\SQL $db)  {
		$f3=Base::instance();
		$this->f3= $f3;
		parent::__construct($db,'temp_edu');
	}

	//add
	public function add( $unsanitizeddata ) {
		$this->getCurrentDateTime();
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$data['temp_edu_created']=$this->getCurrentDateTime();
		$data['temp_edu_updated']=$this->getCurrentDateTime();

		$this->copyFrom($data);
		$this->insert();

		return $this->GET('_id');
	}

	//update
	public function edit($id, $unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		
		$data['temp_edu_updated']=$this->getCurrentDateTime();
		$this->load(array('temp_edu_id=?',$id));
		$this->copyFrom($data);
		$this->update();
		return $this->temp_edu_id;
	}

	public function delete($id) {
		$this->load(array('temp_edu_id=?',$id));
		$this->erase();
		return $id;
	}

	public function search($id) {
		$sql = "SELECT * FROM temp_edu WHERE temp_edu_id = ?";
        return $this->db->exec($sql, array(1=>$id));
	}


	public function getCurrentDateTime() {
		date_default_timezone_set('Asia/Manila');
		return date("Y-m-d H:i:s");
	}

	public function getCurrentDateOnly() {
		date_default_timezone_set('Asia/Manila');
		return date("Y-m-d");
	}

	public function getAllEducation($id) {
        $sql = "SELECT * FROM temp_edu WHERE temp_edu_id = ?  ORDER BY temp_edu_redu_id";
        return $this->db->exec($sql, array(1=>$id));
	}


	public function findEdusByEmpID($temp_id) {
		$sql = "SELECT temp_edu.*, 
		redu.redu_desc
		FROM temp_edu temp_edu
		LEFT JOIN redu redu ON redu.redu_id = temp_edu.temp_edu_redu_id";
		
		$sql .= " WHERE temp_id = ? ORDER BY temp_edu.temp_edu_redu_id ASC";

        return $this->db->exec($sql, array(1=>$temp_id));
	}

	public function findAEducation($id) {
		$sql = "SELECT * FROM temp_edu WHERE temp_edu_id = ?";
		return $this->db->exec($sql, array(1=>$id));
	}
}
