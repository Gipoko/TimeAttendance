<?php

class rrelation extends DB\SQL\Mapper {


	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'rrelation');
	}

	public function list($id) { //get all users, admin only!
		$sql = "SELECT * FROM rrelation WHERE rrelation_id < ? ";
		return $this->db->exec($sql, array(1=>$id));
	}
} 