<?php

class rAttendance extends DB\SQL\Mapper {


	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'temp_biorecord');
	}
	public function countRecords() {
		$sql = "SELECT COUNT(*) as totalRecords FROM temp_biorecord";
		return $this->db->exec($sql);
	}

	public function countRecordsWithFilter($filter) {
		$sql = "SELECT count(*) as totalFilteredRecords FROM temp_biorecord WHERE 1 $filter";
		return $this->db->exec($sql);
	}
	public function getAttendance() {
		$sql = "SELECT * From temp_biorecord";
		return $this->db->exec($sql);
		
	}


	public function getDtr($did) {
		$sql = "SELECT * From temp_biorecord WHERE temp_biometric_id = ?";
		return $this->db->exec($sql, array(1=>$did));
		
	}


	public function getDtrKinsenas($bioid,$year,$month){
		$sql = "SELECT calc_d1,calc_d2,calc_d3,
				calc_d4,calc_d5,calc_d6,calc_d7,
				calc_d8,calc_d9,calc_d10,calc_d11,
				calc_d12,calc_d13,calc_d14,calc_d15,
				confirmedd1,confirmedd2,confirmedd3,confirmedd4,
				confirmedd5,confirmedd6,confirmedd7,confirmedd8,
				confirmedd9,confirmedd10,confirmedd11,confirmedd12,
				confirmedd13,confirmedd14,confirmedd15,leave_credits
		       From temp_biorecord WHERE temp_biometric_id = ? AND temp_biorecord_yr = ? AND temp_biorecord_mnth= ? LIMIT 1";
		return $this->db->exec($sql, array(1=>$bioid,2=>$year,3=>$month));
		die;
	}

	public function getDtrKatapusan($bioid,$year,$month){
		$sql = "SELECT calc_d16,calc_d17,calc_d18,
				calc_d19,calc_d20,calc_d21,calc_d22,
				calc_d23,calc_d24,calc_d25,calc_d26,
				calc_d27,calc_d28,calc_d29,calc_d30,calc_d31,
				confirmedd16,confirmedd17,confirmedd18,confirmedd19,
				confirmedd20,confirmedd21,confirmedd22,confirmedd23,
				confirmedd24,confirmedd25,confirmedd26,confirmedd27,
				confirmedd28,confirmedd29,confirmedd30,confirmedd31,leave_credits
		       From temp_biorecord WHERE temp_biometric_id = ? AND temp_biorecord_yr = ? AND temp_biorecord_mnth= ? LIMIT 1";
		return $this->db->exec($sql, array(1=>$bioid,2=>$year,3=>$month));
		die;
	}

	

	public function getYearMonth(){
		$sql="SELECT temp_biorecord.temp_biorecord_yr, temp_biorecord.temp_biorecord_mnth
			  FROM temp_biorecord GROUP BY temp_biorecord_yr, temp_biorecord_mnth
			  ORDER BY temp_biorecord_yr, temp_biorecord_mnth DESC";
		return $this->db->exec($sql);
		die;
	}

	public function getEmpDtr($bid,$year,$month){
		// var_dump($year, $month,$bid);
	    // die;
		$sql="SELECT * From temp_biorecord 
		WHERE temp_biometric_id = ? AND temp_biorecord_yr = ? AND temp_biorecord_mnth= ? LIMIT 1";
        return $this->db->exec($sql, array(1=>$bid, 2=>$year,3=>$month));
		die;
	}

	public function getEmpBioRecord($year,$month,$division){
		$sql = "SELECT * 
		FROM temp_biorecord
		RIGHT JOIN temp
		ON temp_biorecord.temp_biometric_id = temp.temp_biometric_id
		RIGHT JOIN temp_work AS tpw
		ON temp.temp_id = tpw.temp_id
		RIGHT JOIN rdivision AS rdiv
		ON tpw.rdivision_id = rdiv.rdivision_id
		WHERE temp_biorecord_yr = ? AND temp_biorecord_mnth= ? AND rdiv.rdivision_id = ?
		ORDER BY temp_first";
		 return $this->db->exec($sql, array(1=>$year,2=>$month,3=>$division));
		die;
	}

	// public function getEmpBioRecord($year,$month){
	// 	$sql = "SELECT * 
	// 	FROM temp_biorecord
	// 	INNER JOIN temp
	// 	ON temp_biorecord.temp_biometric_id = temp.temp_biometric_id
	// 	WHERE temp_biorecord_yr = ? AND temp_biorecord_mnth= ? 
	// 	ORDER BY temp_first";
	// 	 return $this->db->exec($sql, array(1=>$year,2=>$month));
	// 	die;
	// }
}
