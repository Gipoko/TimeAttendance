<?php

class refWork extends cau {

	public function getDivision() {
		$sql = "SELECT * FROM rdivision";
		return $this->db->exec($sql);
	}

	public function getSectionUnit() {
		$sql = "SELECT * FROM rdivision_sectionunit";
		return $this->db->exec($sql);
	}

	public function getDivisionUnit() {
		$sql = "SELECT * FROM rdivision_unit";
		return $this->db->exec($sql);
	}

	public function getPosition() {
		$sql = "SELECT * FROM rposition";
		return $this->db->exec($sql);
	}

	public function getGradeStep() {
		$sql = "SELECT * FROM rgradestep 
		WHERE rgradestep_effectivity = ?
		";
		return $this->db->exec($sql, array(1=>date("Y")));
	}

}