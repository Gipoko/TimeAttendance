<?php

class tbiorecord extends DB\SQL\Mapper {


	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'temp_biorecord');
	}

	public function add($data) {
		$this->reset();
		$this->copyFrom($data);
		$this->insert();
	}

	public function all() { //get all users, admin only!
		$this->load();
		return $this->query;
	}

	public function ExecuteCommand($sql) {

		$this->db->exec($sql);
	}

	public function updateDayValue($id, $yr, $mnth, $day, $dayValue) {
		$this->reset();
		$this->load(array('temp_biometric_id=? AND temp_biorecord_yr =? AND temp_biorecord_mnth = ?',$id, $yr, $mnth));
		$this->set($day, $dayValue);
		$this->save();
	}

	public function search($id, $yr, $mnth) {
		$sql = "SELECT * FROM temp_biorecord WHERE temp_biometric_id = ? AND temp_biorecord_yr = ? AND temp_biorecord_mnth = ?";
		return $this->db->exec($sql, array(1=>$id, 2=>$yr, 3=>$mnth));
	}

	public function searchByYearMonth($yr, $mnth) {
		$sql = "SELECT tbiorecord.tbiorecord_id,
				concat(tperson.tperson_first,' ',tperson.tperson_mid, ' ', tperson.tperson_last) AS fullName,
				tbiorecord.temp_biorecord_yr,
				tbiorecord.temp_biorecord_mnth,
				tbiorecord.d1, tbiorecord.d2, tbiorecord.d3, tbiorecord.d4, tbiorecord.d5, tbiorecord.d6, tbiorecord.d7,
				tbiorecord.d8, tbiorecord.d9, tbiorecord.d10, tbiorecord.d11, tbiorecord.d12, tbiorecord.d13, tbiorecord.d14,
				tbiorecord.d15, tbiorecord.d16, tbiorecord.d17, tbiorecord.d18, tbiorecord.d19, tbiorecord.d20, tbiorecord.d21,
				tbiorecord.d22, tbiorecord.d23, tbiorecord.d24, tbiorecord.d25, tbiorecord.d26, tbiorecord.d27, tbiorecord.d28,
				tbiorecord.d29, tbiorecord.d30, tbiorecord.d31,
				tbiorecord.remarksd1,  tbiorecord.remarksd2, tbiorecord.remarksd3,  tbiorecord.remarksd4, tbiorecord.remarksd5,
				tbiorecord.remarksd6,  tbiorecord.remarksd7,  tbiorecord.remarksd8, tbiorecord.remarksd9,  tbiorecord.remarksd10,
				tbiorecord.remarksd11,  tbiorecord.remarksd12, tbiorecord.remarksd13, tbiorecord.remarksd14, tbiorecord.remarksd15,
				tbiorecord.remarksd16,  tbiorecord.remarksd17, tbiorecord.remarksd18, tbiorecord.remarksd19, tbiorecord.remarksd20,
				tbiorecord.remarksd21, tbiorecord.remarksd22,  tbiorecord.remarksd23,  tbiorecord.remarksd24, tbiorecord.remarksd25,
				tbiorecord.remarksd26, tbiorecord.remarksd27, tbiorecord.remarksd28, tbiorecord.remarksd29, tbiorecord.remarksd30,
				tbiorecord.remarksd31
			FROM temp_biorecord tbiorecord
				LEFT OUTER JOIN tperson tperson ON (tbiorecord.temp_biometric_id = tperson.temp_biometric_id)";
		$sql .= " WHERE temp_biorecord_yr = ? AND temp_biorecord_mnth = ?";
		return $this->db->exec($sql, array(1=>$yr, 2=>$mnth));
	}


	public function countRecords($yr, $mnth) {
		$sql = "SELECT COUNT(*) as totalRecords FROM temp_biorecord WHERE temp_biorecord_yr = ? AND temp_biorecord_mnth = ?";
		return $this->db->exec($sql, array(1=>$yr, 2=>$mnth));
	}

	public function countRecordsWithFilter($yr, $mnth, $filter) {
		$sql = "SELECT COUNT(*) as totalFilteredRecords FROM vwBioRecords ";
		$sql .= " WHERE 1 ".$filter." AND temp_biorecord_yr = ".$yr." AND temp_biorecord_mnth = ".$mnth;

		return $this->db->exec($sql);
	}

	public function getRecords($yr, $mnth, $searchQuery, $columnName, $columnSortOrder, $row, $rowperpage) {
		$sql = "SELECT * FROM vwBioRecords ";
		$sql .= " WHERE temp_biorecord_yr = ? AND temp_biorecord_mnth = ?";
		$sql = $sql . " AND 1 ".$searchQuery." order by ".$columnName." ".$columnSortOrder." limit ".$row.",".$rowperpage;

		return $this->db->exec($sql, array(1=>$yr, 2=>$mnth));
	}

	public function getSelectedCell($row, $col) {
		$sql = "SELECT d".$col."  FROM tbiorecord WHERE tbiorecord_id = ?";
		return $this->db->exec($sql, array(1=>$row));
	}

	public function getAllYearMonth() {
		$sql = "SELECT DISTINCT temp_biorecord_yr, temp_biorecord_mnth FROM temp_biorecord ORDER BY temp_biorecord_yr, temp_biorecord_mnth";
		return $this->db->exec($sql);
	}



	public function getSelectedYearMonthTimesheet($year, $month) {
		$sql = "SELECT tbiorecord.*,
					CONCAT(tperson.tperson_first,' ', tperson.tperson_mid,' ', tperson.tperson_last) AS fullName,
					rsched.*
			FROM ((tperson_sched tperson_sched
					RIGHT OUTER JOIN tperson tperson
					ON (tperson_sched.tperson_sched_id = tperson.tperson_sched_id))
				RIGHT OUTER JOIN tbiorecord tbiorecord
					ON (tperson.tperson_biometric_id = tbiorecord.tperson_biometric_id))
				LEFT OUTER JOIN rsched rsched
					ON (rsched.rsched_id = tperson_sched.rsched_id)  ";
					$sql .= " WHERE temp_biorecord_yr = ? AND temp_biorecord_mnth = ?";
		return $this->db->exec($sql, array(1=>$year, 2=>$month));
	}

	public function getBioID($bioid) {
		$sql = "SELECT tbiorecord.*,
					CONCAT(tperson.tperson_first,' ', tperson.tperson_mid,' ', tperson.tperson_last) AS fullName,
					rsched.rsched_id,
					rsched.rsched_datefrom,
					rsched.rsched_dateto,
					rsched.rsched_d1,
					rsched.rsched_d2,
					rsched.rsched_d3,
					rsched.rsched_d4,
					rsched.rsched_d5,
					rsched.rsched_d6,
					rsched.rsched_d7,
					time_format(rsched.rsched_am_in, '%h:%i %p') as rsched_am_in,
					time_format(rsched.rsched_am_out, '%h:%i %p') as rsched_am_out,
					time_format(rsched.rsched_pm_in, '%h:%i %p') as rsched_pm_in,
					time_format(rsched.rsched_pm_out, '%h:%i %p') as rsched_pm_out,
					time_format(rsched.rsched_ot_inc, '%h:%i %p') as rsched_ot_inc,
					time_format(rsched.rsched_ot_out, '%h:%i %p') as rsched_ot_out,
					rsched.rsched_isbrokentime,
					rsched.rsched_haveot
			FROM ((tperson_sched tperson_sched
					RIGHT OUTER JOIN tperson tperson
					ON (tperson_sched.tperson_sched_id = tperson.tperson_sched_id))
				RIGHT OUTER JOIN tbiorecord tbiorecord
					ON (tperson.tperson_biometric_id = tbiorecord.tperson_biometric_id))
				LEFT OUTER JOIN rsched rsched
					ON (rsched.rsched_id = tperson_sched.rsched_id)  ";
					$sql .= " WHERE tbiorecord.tperson_biometric_id = ?";
		return $this->db->exec($sql, array(1=>$bioid));
	}
	public function updateBioDayTimesheet($id, $day, $val) {
		$sql = "UPDATE temp_biorecord SET d".$day." = '".$val."', confirmedd".$day." = 1 WHERE tbiorecord_id = ?";
		return $this->db->exec($sql, array(1=>intval($id)));
	}

	public function saveTimingIsCorrect($id, $day) {
		$sql = "UPDATE temp_biorecord SET confirmedd".$day." = 1 WHERE temp_biorecord_id = ?";
		return $this->db->exec($sql, array(1=>intval($id)));
	}

	public function saveAbsentReason($absno, $id, $day) {
		$sql = "UPDATE temp_biorecord SET absreason".$day." = $absno WHERE temp_biorecord_id = $id";
		//var_dump($sql);

		return $this->db->exec($sql);
	}

	public function validateSelectedMonthTimesheet($yr, $mnth) {
		return $this->getSelectedYearMonthTimesheet($yr, $mnth);
	}

	public function getSelectedYearMonthTimesheetWithID($year, $month, $id) {
		$sql = "SELECT tbiorecord.*,
		CONCAT(tperson.tperson_first,' ', tperson.tperson_mid,' ', tperson.tperson_last) AS fullName,
		rsched.*,
		tabs1.tabsreason_code AS ABS1,   tabs2.tabsreason_code AS ABS2,   tabs3.tabsreason_code AS ABS3, tabs4.tabsreason_code AS ABS4,
		tabs5.tabsreason_code AS ABS5,   tabs6.tabsreason_code AS ABS6,   tabs7.tabsreason_code AS ABS7, tabs8.tabsreason_code AS ABS8,
		tabs9.tabsreason_code AS ABS9,   tabs10.tabsreason_code AS ABS10, tabs11.tabsreason_code AS ABS11, tabs12.tabsreason_code AS ABS12,
		tabs13.tabsreason_code AS ABS13, tabs14.tabsreason_code AS ABS14, tabs15.tabsreason_code AS ABS15, tabs16.tabsreason_code AS ABS16,
		tabs17.tabsreason_code AS ABS17, tabs18.tabsreason_code AS ABS18, tabs19.tabsreason_code AS ABS19, tabs20.tabsreason_code AS ABS20,
		tabs21.tabsreason_code AS ABS21, tabs22.tabsreason_code AS ABS22, tabs23.tabsreason_code AS ABS23, tabs24.tabsreason_code AS ABS24,
		tabs25.tabsreason_code AS ABS25, tabs26.tabsreason_code AS ABS26, tabs27.tabsreason_code AS ABS27, tabs28.tabsreason_code AS ABS28,
		tabs29.tabsreason_code AS ABS29, tabs30.tabsreason_code AS ABS30, tabs31.tabsreason_code AS ABS31

FROM ((tperson_sched tperson_sched
		RIGHT OUTER JOIN tperson tperson
		ON (tperson_sched.tperson_sched_id = tperson.tperson_sched_id))
	RIGHT OUTER JOIN tbiorecord tbiorecord
		ON (tperson.tperson_biometric_id = tbiorecord.tperson_biometric_id))
	LEFT OUTER JOIN rsched rsched
		ON (rsched.rsched_id = tperson_sched.rsched_id)
	LEFT JOIN tabsreason tabs1 ON 	(tabs1.tabsreason_id = tbiorecord.absreason1)
	LEFT JOIN tabsreason tabs2 ON 	(tabs2.tabsreason_id = tbiorecord.absreason2)
	LEFT JOIN tabsreason tabs3 ON 	(tabs3.tabsreason_id = tbiorecord.absreason3)
	LEFT JOIN tabsreason tabs4 ON 	(tabs4.tabsreason_id = tbiorecord.absreason4)
	LEFT JOIN tabsreason tabs5 ON 	(tabs5.tabsreason_id = tbiorecord.absreason5)
	LEFT JOIN tabsreason tabs6 ON 	(tabs6.tabsreason_id = tbiorecord.absreason6)
	LEFT JOIN tabsreason tabs7 ON 	(tabs7.tabsreason_id = tbiorecord.absreason7)
	LEFT JOIN tabsreason tabs8 ON 	(tabs8.tabsreason_id = tbiorecord.absreason8)
	LEFT JOIN tabsreason tabs9 ON 	(tabs9.tabsreason_id = tbiorecord.absreason9)
	LEFT JOIN tabsreason tabs10 ON 	(tabs10.tabsreason_id = tbiorecord.absreason10)
	LEFT JOIN tabsreason tabs11 ON 	(tabs11.tabsreason_id = tbiorecord.absreason11)
	LEFT JOIN tabsreason tabs12 ON 	(tabs12.tabsreason_id = tbiorecord.absreason12)
	LEFT JOIN tabsreason tabs13 ON 	(tabs13.tabsreason_id = tbiorecord.absreason13)
	LEFT JOIN tabsreason tabs14 ON 	(tabs14.tabsreason_id = tbiorecord.absreason14)
	LEFT JOIN tabsreason tabs15 ON 	(tabs15.tabsreason_id = tbiorecord.absreason15)
	LEFT JOIN tabsreason tabs16 ON 	(tabs16.tabsreason_id = tbiorecord.absreason16)
	LEFT JOIN tabsreason tabs17 ON 	(tabs17.tabsreason_id = tbiorecord.absreason17)
	LEFT JOIN tabsreason tabs18 ON 	(tabs18.tabsreason_id = tbiorecord.absreason18)
	LEFT JOIN tabsreason tabs19 ON 	(tabs19.tabsreason_id = tbiorecord.absreason19)
	LEFT JOIN tabsreason tabs20 ON 	(tabs20.tabsreason_id = tbiorecord.absreason20)
	LEFT JOIN tabsreason tabs21 ON 	(tabs21.tabsreason_id = tbiorecord.absreason21)
	LEFT JOIN tabsreason tabs22 ON 	(tabs22.tabsreason_id = tbiorecord.absreason22)
	LEFT JOIN tabsreason tabs23 ON 	(tabs23.tabsreason_id = tbiorecord.absreason23)
	LEFT JOIN tabsreason tabs24 ON 	(tabs24.tabsreason_id = tbiorecord.absreason24)
	LEFT JOIN tabsreason tabs25 ON 	(tabs25.tabsreason_id = tbiorecord.absreason25)
	LEFT JOIN tabsreason tabs26 ON 	(tabs26.tabsreason_id = tbiorecord.absreason26)
	LEFT JOIN tabsreason tabs27 ON 	(tabs27.tabsreason_id = tbiorecord.absreason27)
	LEFT JOIN tabsreason tabs28 ON 	(tabs28.tabsreason_id = tbiorecord.absreason28)
	LEFT JOIN tabsreason tabs29 ON 	(tabs29.tabsreason_id = tbiorecord.absreason29)
	LEFT JOIN tabsreason tabs30 ON 	(tabs30.tabsreason_id = tbiorecord.absreason30)
	LEFT JOIN tabsreason tabs31 ON 	(tabs31.tabsreason_id = tbiorecord.absreason31)
";
					$sql .= " WHERE temp_biorecord_yr = ? AND temp_biorecord_mnth = ? AND tbiorecord.tperson_biometric_id = ?";
		return $this->db->exec($sql, array(1=>$year, 2=>$month, 3=>$id));
	}

	public function deleteOldLog($year, $month) {
		$sql = "DELETE  FROM tbiorecord WHERE temp_biorecord_yr = ? AND temp_biorecord_mnth = ?";
		$this->db->exec($sql, array(1=>$year, 2=>$month));
		return $this->getAllYearMonth();
	}

	public function getEmpBioRecord($year, $month) {
		$sql = "SELECT temp_biorecord.temp_biorecord_id,
		concat(temp.temp_first, ' ', temp.temp_mid,' ',temp.temp_last) AS fullname,
		temp.temp_id,
		temp.temp_biometric_id,
		temp_biorecord.temp_biometric_id,
		temp_biorecord.temp_biorecord_yr,
		temp_biorecord.temp_biorecord_mnth,
		temp_biorecord.d1,
		temp_biorecord.d2,
		temp_biorecord.d3,
		temp_biorecord.d4,
		temp_biorecord.d5,
		temp_biorecord.d6,
		temp_biorecord.d7,
		temp_biorecord.d8,
		temp_biorecord.d9,
		temp_biorecord.d10,
		temp_biorecord.d11,
		temp_biorecord.d12,
		temp_biorecord.d13,
		temp_biorecord.d14,
		temp_biorecord.d15,
		temp_biorecord.d16,
		temp_biorecord.d17,
		temp_biorecord.d18,
		temp_biorecord.d19,
		temp_biorecord.d21,
		temp_biorecord.d22,
		temp_biorecord.d23,
		temp_biorecord.d24,
		temp_biorecord.d25,
		temp_biorecord.d20,
		temp_biorecord.d26,
		temp_biorecord.d27,
		temp_biorecord.d28,
		temp_biorecord.d29,
		temp_biorecord.d30,
		temp_biorecord.d31,
		temp_biorecord.confirmedd1,
		temp_biorecord.confirmedd2,
		temp_biorecord.confirmedd3,
		temp_biorecord.confirmedd4,
		temp_biorecord.confirmedd5,
		temp_biorecord.confirmedd6,
		temp_biorecord.confirmedd7,
		temp_biorecord.confirmedd8,
		temp_biorecord.confirmedd9,
		temp_biorecord.confirmedd10,
		temp_biorecord.confirmedd11,
		temp_biorecord.confirmedd12,
		temp_biorecord.confirmedd13,
		temp_biorecord.confirmedd14,
		temp_biorecord.confirmedd15,
		temp_biorecord.confirmedd16,
		temp_biorecord.confirmedd17,
		temp_biorecord.confirmedd18,
		temp_biorecord.confirmedd19,
		temp_biorecord.confirmedd20,
		temp_biorecord.confirmedd21,
		temp_biorecord.confirmedd22,
		temp_biorecord.confirmedd23,
		temp_biorecord.confirmedd24,
		temp_biorecord.confirmedd25,
		temp_biorecord.confirmedd26,
		temp_biorecord.confirmedd27,
		temp_biorecord.confirmedd28,
		temp_biorecord.confirmedd29,
		temp_biorecord.confirmedd30,
		temp_biorecord.confirmedd31
 FROM pagammu.temp_biorecord temp_biorecord
	  RIGHT OUTER JOIN pagammu.temp temp
		 ON (temp_biorecord.temp_biometric_id = temp.temp_biometric_id)
 WHERE temp_biorecord.temp_biorecord_yr in ($year) AND temp_biorecord.temp_biorecord_mnth in ($month)";

return $this->db->exec($sql, array(1=>$year, 2=>$month));
		
	}


	public function updateDayTimeEntries($bioid, $day, $confirmed, $value,$rea,$reason,$calc) {
		$abs = 'absreason'.$rea; 
		$calcd = 'calc_d'.$rea;
		$this->reset();
		$this->load(array('temp_biorecord_id=?',(int)$bioid));
		$this->set($confirmed, '1');
		$this->$abs = $reason ;
		$this->$calcd = $calc;
		$this->lateHours = $hourlate;
		$this->lateMinutes = $minutelate;
		$this->set($day, $value);
		$this->save();
	}

	public function AddLeave() {
		
		$sql = "SELECT absreason1 FROM temp_biorecord Where temp_biorecord_id = ?";
		return $this->db->exec($sql);
	}


}
