<?php

class rGovernmentID extends DB\SQL\Mapper {
	
	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'rgovtid');
	}

	public function list() {
		$sql = "SELECT * FROM rgovtid";
		return $this->db->exec($sql);
	}

    public function junior($d) {

		$sql = "SELECT * FROM rgovtid";
		return $this->db->exec($sql);
	}
}