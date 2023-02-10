<?php

class rGradeStep extends DB\SQL\Mapper {
	
	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'rgradestep');
	}

	public function list() {
		$sql = "SELECT * FROM rdivision";
		return $this->db->exec($sql);
	}

	public function findGradeStep($grade, $step, $currentYear) {
		$sql = "SELECT * FROM rgradestep WHERE rgradestep_gradeno = ? AND rgradestep_stepno = ? AND rgradestep_effectivity=?";
		return $this->db->exec($sql, array(1=>$grade, 2=>$step, $currentYear));
	}

}