<?php

class temp_semtrain extends DB\SQL\Mapper {

	protected $allowed_fields = array(
		"temp_semtrain_id",
		"temp_id",
		"temp_semtrain_eventname",
		"temp_semtrain_topic",
		"temp_semtrain_where",
		"temp_semtrain_when",
		"temp_semtrain_created",
		"temp_semtrain_updated"
	);

	protected $f3;

	private function sanitizeInput(array $data, array $fieldNames) { //sanitize input - with thanks to richgoldmd
	   return array_intersect_key($data, array_flip($fieldNames));
	}

	public function __construct(DB\SQL $db)  {
		$f3=Base::instance();
		$this->f3= $f3;
		parent::__construct($db,'temp_semtrain');
	}

	//add
	public function add( $unsanitizeddata ) {
		$this->getCurrentDateTime();
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$data['temp_semtrain_created']=$this->getCurrentDateTime();
		$data['temp_semtrain_updated']=$this->getCurrentDateTime();

		$this->copyFrom($data);
		$this->insert();

		return $this->GET('_id');
	}

	//update
	public function edit($id, $unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		
		$data['temp_semtrain_updated']=$this->getCurrentDateTime();
		$this->load(array('temp_semtrain_id=?',$id));
		$this->copyFrom($data);
		$this->update();
		return $this->temp_semtrain_id;
	}

	public function delete($id) {
		$this->load(array('temp_semtrain_id=?',$id));
		$this->erase();
		return $id;
	}

	public function getCurrentDateTime() {
		date_default_timezone_set('Asia/Manila');
		return date("Y-m-d H:i:s");
	}

	public function getCurrentDateOnly() {
		date_default_timezone_set('Asia/Manila');
		return date("Y-m-d");
	}

	public function getAllSemTraining($id) {
        $sql = "SELECT * FROM temp_semtrain WHERE temp_semtrain_id = ?  ORDER BY temp_semtrain_date_issued";
        return $this->db->exec($sql, array(1=>$id));
	}


	public function findSemTrainingByEmpID($temp_id) {
		$sql = "SELECT temp_semtrain.*
		FROM temp_semtrain ";
		
		$sql .= " WHERE temp_id = ? ORDER BY temp_semtrain_when DESC";

        return $this->db->exec($sql, array(1=>$temp_id));
	}

	public function findASemTraining($id) {
		$sql = "SELECT * FROM temp_semtrain WHERE temp_semtrain_id = ?";
		return $this->db->exec($sql, array(1=>$id));
	}
}