<?php

class rEmploymentType extends DB\SQL\Mapper {
	
	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'remployment_type');
	}

	public function list() {
		$sql = "SELECT * FROM remployment_type";
		return $this->db->exec($sql);
	}

}