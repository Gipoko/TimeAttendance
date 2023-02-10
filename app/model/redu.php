<?php

class redu extends DB\SQL\Mapper {


	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'redu');
	}

	public function list() { //get all users, admin only!
		$sql = "SELECT * FROM redu";
		return $this->db->exec($sql);
	}

}
