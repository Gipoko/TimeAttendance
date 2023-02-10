<?php

class temp_work extends DB\SQL\Mapper {

	protected $allowed_fields = array(
		"temp_work_id",
		"temp_id",
		"ragency_id",
		"temp_work_agency_date_from",
		"temp_work_agency_date_to",
		"rdivision_id",
		"temp_work_division_date_from",
		"temp_work_division_date_to",
		"rdivunit_id",
		"temp_work_divunit_date_from",
		"temp_work_divunit_date_to",
		"rposition_id",
		"temp_work_position_date_from",
		"temp_work_position_date_to",
		"rgradestep_gradeno",
		"temp_work_grade_date_from",
		"temp_work_grade_date_to",
		"rgradestep_stepno",
		"temp_work_step_date_from",
		"temp_work_step_date_to",
		"rgradestep_salary",
		"temp_work_salary_from",
		"temp_work_salary_to",
		"remployment_type_id",
		"temp_work_employment_type_date_from",
		"temp_work_employment_type_date_to",
		"temp_work_reporting_to_id",
		"temp_work_reporting_to_date_from",
		"temp_work_reporting_to_date_to",
		"temp_work_created",
		"temp_work_updated"
	);

	protected $sql;

	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'temp_work');
	}

	private function sanitizeInput(array $data, array $fieldNames)
	{ //sanitize input - with thanks to richgoldmd
	   return array_intersect_key($data, array_flip($fieldNames));
	}

	
	public function add( $unsanitizeddata ) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$data['temp_work_created']=$this->getCurrentDateTime();
		$data['temp_work_updated']=$this->getCurrentDateTime();
		$this->copyFrom($data);
		$this->save();
		return $this->GET('_id');
	}

	//update
	public function edit($id, $unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$data['temp_work_updated']=$this->getCurrentDateTime();
		$this->load(array('temp_work_id=?',$id));
		$this->copyFrom($data);
		$this->update();
		return $this->temp_work_id;
	}

	public function getCurrentDateTime() {
		date_default_timezone_set('Asia/Manila');
		return date("Y-m-d H:i:s");
	}

	public function tempWorkHistory($tempId) {
		$sql = "SELECT tw.*, rd.rdivision_name, rds.rdivision_sectionunit_name, rp.rposition_name, et.remployment_type_desc, concat(tp.temp_first, ' ', tp.temp_mid, ' ', tp.temp_last) AS reportingTo
		FROM  temp_work tw
		LEFT  JOIN rdivision rd ON rd.rdivision_id = tw.rdivision_id
		LEFT JOIN rdivision_unit rds ON rds.rdivision_sectionunit_id = tw.rdivunit_id
		LEFT JOIN rposition rp ON rp.rposition_id = tw.rposition_id 
		LEFT JOIN remployment_type et ON et.remployment_type_id = tw.remployment_type_id
		LEFT JOIN temp tp ON tp.temp_id = tw.temp_work_reporting_to_id
		WHERE tw.temp_id =? ORDER BY temp_work_id desc";
		return $this->db->exec($sql, array(1=>$tempId));
	}

	public function getWorkByTempID($tempId) {
		$sql = "SELECT tw.*, rd.rdivision_name, rds.rdivision_sectionunit_name, rp.rposition_name, et.remployment_type_desc, concat(tp.temp_first, ' ', tp.temp_mid, ' ', tp.temp_last) AS reportingTo
		FROM  temp_work tw
		LEFT  JOIN rdivision rd ON rd.rdivision_id = tw.rdivision_id
		LEFT JOIN rdivision_unit rds ON rds.rdivision_sectionunit_id = tw.rdivunit_id
		LEFT JOIN rposition rp ON rp.rposition_id = tw.rposition_id 
		LEFT JOIN remployment_type et ON et.remployment_type_id = tw.remployment_type_id
		LEFT JOIN temp tp ON tp.temp_id = tw.temp_work_reporting_to_id
		WHERE tw.temp_id =? ORDER BY temp_work_id DESC LIMIT 1";
		return $this->db->exec($sql, array(1=>$tempId));
	}

	public function tempCurrentWork($tempId) {
		$sql = "SELECT * FROM temp_work WHERE temp_id = ? ORDER BY temp_work_id DESC LIMIT 1";
		return $this->db->exec($sql, array(1=>$tempId));
	}

	public function countHistoryRecords() {
		$sql = "SELECT tw.*, rd.rdivision_name, rds.rdivision_sectionunit_name, rp.rposition_name, et.remployment_type_desc, concat(tp.temp_first, ' ', tp.temp_mid, ' ', tp.temp_last) AS reportingTo
		FROM  temp_work tw
		LEFT  JOIN rdivision rd ON rd.rdivision_id = tw.rdivision_id
		LEFT JOIN rdivision_sectionunit rds ON rds.rdivision_sectionunit_id = tw.rdivision_sectionunit_id
		LEFT JOIN rposition rp ON rp.rposition_id = tw.rposition_id 
		LEFT JOIN remployment_type et ON et.remployment_type_id = tw.remployment_type_id
		LEFT JOIN temp tp ON tp.temp_id = tw.temp_work_reporting_to_id
		WHERE tw.temp_id =? ORDER BY temp_work_id desc";
		$resCount = $this->db->exec($sql, array(1=>$tempId));
		return count($resCount);
	}
}