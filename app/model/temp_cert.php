<?php

class temp_cert extends DB\SQL\Mapper {

	protected $allowed_fields = array(
		"temp_cert_id",
		"temp_id",
		"temp_cert_name",
		"temp_cert_date_issued",
		"temp_cert_place_issued",
		"temp_cert_date_expire",
		"temp_cert_created",
		"temp_cert_updated"
	);

	protected $f3;

	private function sanitizeInput(array $data, array $fieldNames) { //sanitize input - with thanks to richgoldmd
	   return array_intersect_key($data, array_flip($fieldNames));
	}

	public function __construct(DB\SQL $db)  {
		$f3=Base::instance();
		$this->f3= $f3;
		parent::__construct($db,'temp_cert');
	}

	//add
	public function add( $unsanitizeddata ) {
		$this->getCurrentDateTime();
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$data['temp_cert_created']=$this->getCurrentDateTime();
		$data['temp_cert_updated']=$this->getCurrentDateTime();

		$this->copyFrom($data);
		$this->insert();

		return $this->GET('_id');
	}

	//update
	public function edit($id, $unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		
		$data['temp_cert_updated']=$this->getCurrentDateTime();
		$this->load(array('temp_cert_id=?',$id));
		$this->copyFrom($data);
		$this->update();
		return $this->temp_cert_id;
	}

	public function delete($id) {
		$this->load(array('temp_cert_id=?',$id));
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

	public function getAllCertLic($id) {
        $sql = "SELECT * FROM temp_cert WHERE temp_cert_id = ?  ORDER BY temp_cert_date_issued";
        return $this->db->exec($sql, array(1=>$id));
	}


	public function findEmployeeCertLicByEmployeeID($temp_id) {
		$sql = "SELECT temp_cert.*
		FROM temp_cert ";
		
		$sql .= " WHERE temp_id = ? ORDER BY temp_cert_date_issued DESC";

        return $this->db->exec($sql, array(1=>$temp_id));
	}

	public function findCert($id) {
		$sql = "SELECT * FROM temp_cert WHERE temp_cert_id = ?";
		return $this->db->exec($sql, array(1=>$id));
	}
}