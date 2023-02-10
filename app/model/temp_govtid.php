<?php

class temp_govtid extends DB\SQL\Mapper {

	protected $allowed_fields = array(
		"temp_govtid_id",
		"temp_id",
		"rgovernment_id",
		"temp_govtid_id_no",
		"temp_govtid_place_issued",
		"temp_govtid_date_issued",
		"temp_govtid_date_expire",
		"temp_govtid_created",
		"temp_govtid_updated"
	);

	protected $sql;

	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'temp_govtid');
	}

	private function sanitizeInput(array $data, array $fieldNames)
	{ //sanitize input - with thanks to richgoldmd
	   return array_intersect_key($data, array_flip($fieldNames));
	}

	
	public function add( $unsanitizeddata ) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$data['temp_govtid_created']=$this->getCurrentDateTime();
		$data['temp_govtid_updated']=$this->getCurrentDateTime();
		$this->copyFrom($data);
		$this->save();
		return $this->GET('_id');
	}

	//update
	public function edit($id, $unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$data['temp_govtid_updated']=$this->getCurrentDateTime();
		$this->load(array('temp_govtid_id=?',$id));
		$this->copyFrom($data);
		$this->update();
		return $this->temp_govtid_id;
	}

	public function delete($id) {
		$this->load(array('temp_govtid_id=?',$id));
		$this->erase();
		return $id;
	}

	public function getCurrentDateTime() {
		date_default_timezone_set('Asia/Manila');
		return date("Y-m-d H:i:s");
	}


	public function findAGovtID($id) {
		$sql = "SELECT * FROM temp_govtid temp_govtid
				LEFT JOIN rgovtid rgovtid ON rgovtid.rgovtid_id = temp_govtid.rgovernment_id ";
		$sql .= "WHERE temp_govtid_id = ?";
		return $this->db->exec($sql, array(1=>$id));
	}

	//look for active employees under defined branch id
	public function findGovtIDsByEmployeeID($tempid) {
		$sql = "SELECT * FROM temp_govtid temp_govtid
				LEFT JOIN rgovtid rgovtid ON rgovtid.rgovtid_id = temp_govtid.rgovernment_id ";
		$sql .= "WHERE temp_id = ?";
		return $this->db->exec($sql, array(1=>$tempid));
	}
}