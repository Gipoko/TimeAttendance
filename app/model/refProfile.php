<?php

class refProfile extends cau {

	public function getBanks() {
		$sql = "SELECT * FROM rbank WHERE rbank_is_active = 1";
		return $this->db->exec($sql);
	}

	public function getTitles() {
		$sql = "SELECT * FROM rtitle";
		return $this->db->exec($sql);
	}

	public function getReligion() {
		$sql = "SELECT * FROM rreligion";
		return $this->db->exec($sql);
	}

	public function getCountry() {
		$sql = "SELECT * FROM rcountry where isActive = 1";
		return $this->db->exec($sql);
	}

	public function getRegion() {
		$sql = "SELECT * FROM refregion ORDER BY regorder";
		return $this->db->exec($sql);
	}

	public function getAllProvinces() {
		$sql = "SELECT * FROM refprovince ORDER BY provcode, provdesc";
		return $this->db->exec($sql);
	}

	public function getAllCityMun() {
		$sql = "SELECT * FROM refcitymun ORDER BY citymuncode, citymundesc";
		return $this->db->exec($sql);
	}

	public function getAllBarangays() {
		$sql = "SELECT * FROM refbrgy ORDER BY citymuncode, brgydesc";
		return $this->db->exec($sql);
	}

	public function getProvinceByRegionCode($regCode) {
		$sql = "SELECT * FROM refprovince WHERE regcode = ? ORDER BY provdesc";
		return $this->db->exec($sql, array(1=>$regCode));
	}

	public function getCityMunByProvCode($provCode) {
		$sql = "SELECT * FROM refcitymun WHERE provcode = ? ORDER BY citymundesc";
		return $this->db->exec($sql, array(1=>$provCode));
	}

	public function getBrgyByCityMunCode($cityMunCode) {
		$sql = "SELECT * FROM refbrgy WHERE citymuncode = ? ORDER BY brgydesc";
		return $this->db->exec($sql, array(1=>$cityMunCode));
	}

	public function getBank() {
		$sql = "SELECT * FROM rbank WHERE isActive = 'Y'";
		return $this->db->exec($sql);
	}

	public function getSched() {
		$sql = "SELECT * FROM rsched";
		return $this->db->exec($sql);
	}

	function enumData($table_name, $column_name) {
			$sql = "SELECT column_type FROM information_schema.COLUMNS
				WHERE
					TABLE_NAME = '$table_name'
						AND COLUMN_NAME = '$column_name';";
			$aType =  $this->db->exec($sql);
			$aResults = explode("','", str_replace("')", "", str_replace("enum('", "", $aType[0]['column_type'])));
			$aNewType = [];

			for($i=0;$i<count($aResults);$i++) {
				$aNewType[] = array("$column_name"=>$aResults[$i]);
			}
			return $aNewType;
	}

	public function getSuffix() {
		$data = $this->enumData('temp', 'temp_suffice');
		return $data;
	}

	public function getBloodType() {
		return $this->enumData('temp', 'temp_blood');
	}

	public function getGender() {
		return $this->enumData('temp', 'temp_gender');
	}

	public function getMarital() {
		return $this->enumData('temp', 'temp_marital');
	}



}