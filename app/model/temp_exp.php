<?php

class temp_exp extends DB\SQL\Mapper {

	protected $allowed_fields = array(
		"temp_exp_id",
		"temp_id",
		"temp_exp_position",
		"temp_exp_companyname",
		"temp_exp_companyaddress",
		"temp_exp_from",
		"temp_exp_to",
		"temp_exp_jobdesc",
		"temp_exp_created",
		"temp_exp_updated"
	);

	protected $f3;

	private function sanitizeInput(array $data, array $fieldNames) { //sanitize input - with thanks to richgoldmd
	   return array_intersect_key($data, array_flip($fieldNames));
	}

	public function __construct(DB\SQL $db)  {
		$f3=Base::instance();
		$this->f3= $f3;
		parent::__construct($db,'temp_exp');
	}

	//add
	public function add( $unsanitizeddata ) {
		$this->getCurrentDateTime();
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$data['temp_exp_created']=$this->getCurrentDateTime();
		$data['temp_exp_updated']=$this->getCurrentDateTime();

		$this->copyFrom($data);
		$this->insert();

		return $this->GET('_id');
	}

	//update
	public function edit($id, $unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		
		$data['temp_exp_updated']=$this->getCurrentDateTime();
		$this->load(array('temp_exp_id=?',$id));
		$this->copyFrom($data);
		$this->update();
		return $this->temp_exp_id;
	}

	public function delete($id) {
		$this->load(array('temp_exp_id=?',$id));
		$this->erase();
		return $id;
	}

	public function search($id) {
		$sql = "SELECT * FROM temp_exp WHERE temp_exp_id = ?";
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
        $sql = "SELECT * FROM temp_exp WHERE temp_exp_id = ?";
        return $this->db->exec($sql, array(1=>$id));
	}


	public function findExpsByEmpID($temp_id) {
		$sql = "SELECT * from temp_exp WHERE temp_id = ? ORDER BY temp_exp_from DESC";

        return $this->db->exec($sql, array(1=>$temp_id));
	}


}
