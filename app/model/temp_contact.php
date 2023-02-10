<?php

class temp_contact extends DB\SQL\Mapper {

	protected $allowed_fields = array(
		"temp_contact_id",
		"temp_id",
		"temp_contact_rrelation_id",
		"temp_contact_first",
		"temp_contact_mid",
		"temp_contact_last",
		"temp_contact_suffix_id",
		"temp_contact_home_address",
		"temp_contact_home_phone",
		"temp_contact_mobile",
		"temp_contact_email",
		"temp_contact_company_name",
		"temp_contact_company_address",
		"temp_contact_company_phone",
		"temp_contact_company_email_address",
		"temp_contact_created",
		"temp_contact_updated"
	);

	protected $f3;

	private function sanitizeInput(array $data, array $fieldNames) { //sanitize input - with thanks to richgoldmd
	   return array_intersect_key($data, array_flip($fieldNames));
	}

	public function __construct(DB\SQL $db)  {
		$f3=Base::instance();
		$this->f3= $f3;
		parent::__construct($db,'temp_contact');
	}

	//add
	public function add( $unsanitizeddata ) {
		$this->getCurrentDateTime();
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$data['temp_contact_created']=$this->getCurrentDateTime();
		$data['temp_contact_updated']=$this->getCurrentDateTime();

		$this->copyFrom($data);
		$this->insert();

		return $this->GET('_id');
	}

	//update
	public function edit($id, $unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$data['temp_contact_updated']=$this->getCurrentDateTime();
		$this->load(array('temp_contact_id=?',$id));
		$this->copyFrom($data);
		$this->update();
		return $this->temp_contact_id;
	}

	public function delete($id) {
		$this->load(array('temp_contact_id=?',$id));
		$this->erase();
		return $id;
	}

	public function search($id) {
		$sql = "SELECT * FROM temp_contact WHERE temp_contact_id = ?";
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

	public function getAllContactPerson($id) {
        $sql = "SELECT * FROM temp_contact WHERE temp_contact_id = ?";
        return $this->db->exec($sql, array(1=>$id));
	}

	public function getPersonByUserID($id) {
		$sql = "SELECT * FROM tperson WHERE id = ?";
        return $this->db->exec($sql, array(1=>$id));
	}

	public function findContactsByEmpID($temp_id) {
		$sql = "SELECT temp_contact.*, 
		rrelation.rrelation_desc,
		concat(temp_contact.temp_contact_first, ' ', temp_contact.temp_contact_mid, ' ', temp_contact.temp_contact_last, ' ', if(temp_contact_suffix_id='n/a', '',temp_contact_suffix_id)) as fullName 
		FROM temp_contact temp_contact
		LEFT JOIN rrelation rrelation ON rrelation.rrelation_id = temp_contact.temp_contact_rrelation_id";
		
		$sql .= " WHERE temp_id = ?";
        return $this->db->exec($sql, array(1=>$temp_id));
	}

	public function findAContactPerson($id) {
		$sql = "SELECT * FROM temp_contact WHERE temp_contact_id = ?";
		return $this->db->exec($sql, array(1=>$id));
	}
}
