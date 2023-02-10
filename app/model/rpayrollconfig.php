<?php

class rpayrollconfig extends DB\SQL\Mapper {

	protected $allowed_fields = array(
		"rpayconfig_id",
		"rpayconfig_payroll_year",
		"rpayconfig_branch",
        "rpayconfig_tax_identification_number",
        "rpayconfig_gsis_number",
        "rpayconfig_account_number",
        "rpayconfig_computation_based_on",
        "rpayconfig_number_of_days_year",
        "rpayconfig_number_of_days_month",
        "rpayconfig_number_of_days_current_period",
        "rpayconfig_acpcea_amount",
        "rpayconfig_pera_amount",
        "rpayconfig_employee_gsis_rate",
        "rpayconfig_employer_gsis_rate",
        "rpayconfig_employer_pagibig_amount",
        "rpayconfig_philhealth_rate_fixed",
        "rpayconfig_philhealth_rate_percent",
        "rpayconfig_philhealth_rate_fixed2",
        "rpayconfig_monthly_e_cola_amount",
        "rpayconfig_monthly_regular_overtime_rate",
        "rpayconfig_monthly_regular_nightdiff_rate",
        "rpayconfig_monthly_regular_overtime_nightdiff_rate",
        "rpayconfig_monthly_regular_overtime_excess_rate",
        "rpayconfig_monthly_restday_overtime_rate",
        "rpayconfig_monthly_restday_excess_rate",
        "rpayconfig_monthly_special_holiday_overtime_rate",
        "rpayconfig_monthly_special_holiday_excess_rate",
        "rpayconfig_monthly_special_holiday_restday_overtime_rate",
        "rpayconfig_monthly_special_holiday_restday_excess_rate",
        "rpayconfig_monthly_legal_holiday_overtime_rate",
        "rpayconfig_monthly_legal_holiday_excess_rate",
        "rpayconfig_monthly_legal_holiday_restday_overtime_rate",
        "rpayconfig_monthly_legal_holiday_restday_excess_rate",
        "rpayconfig_daily_ecola_amount",
        "rpayconfig_daily_regular_overtime_rate",
        "rpayconfig_daily_regular_nightdiff_rate",
        "rpayconfig_daily_regular_overtime_nightdiff_rate",
        "rpayconfig_daily_regular_overtime_excess_rate",
        "rpayconfig_daily_restday_overtime_rate",
        "rpayconfig_daily_restday_excess_rate",
        "rpayconfig_daily_special_holiday_overtime_rate",
        "rpayconfig_daily_special_holiday_excess_rate",
        "rpayconfig_daily_special_holiday_restday_overtime_rate",
        "rpayconfig_daily_special_holiday_restday_excess_rate",
        "rpayconfig_daily_legal_holiday_overtime_rate",
        "rpayconfig_daily_legal_holiday_excess_rate",
        "rpayconfig_daily_legal_holiday_restday_overtime_rate",
        "rpayconfig_daily_legal_holiday_restday_excess_rate",
        "rpayconfig_status","rpayconfig_payroll_year"
	);

	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'rpayroll_configuration');
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
		$sql = "UPPER(rpayconfig_id) = ?";
		return array_map(array($this,'cast'),$this->find(array($sql, strtoupper($bn))));
	}

	public function countRecords() {
		$sql = "SELECT COUNT(*) as totalRecords FROM rpayroll_configuration";
		return $this->db->exec($sql);
	}

	public function countRecordsWithFilter($filter) {
		$sql = "SELECT count(*) as totalFilteredRecords FROM rpayroll_configuration WHERE 1 $filter";
		return $this->db->exec($sql);
	}

	public function getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage) {
		$sql = "SELECT * from rpayroll_configuration ";
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
		// $data['rpaysettings_created']=$this->getCurrentDateTime();
		$data['rpayconfig_updated']=$this->getCurrentDateTime();
		$this->copyFrom($data);
		$this->insert();
		return $this->GET('rpayconfig_id');
	}

	public function edit($id, $unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$this->load(array('rpayconfig_id=?',$id));
		$this->copyFrom('POST');
		$data['rpayconfig_updated']=$this->getCurrentDateTime();

		$this->update();
	}

	public function delete($id) {
		$this->load(array('rpayconfig_id=?',$id));
		$this->erase();
	}
    public function edits($id)
    {
        $this->load(array('rpayconfig_id=?',$id));
        $this->copyFrom('POST');
        $this->update();
    }
} 