<?php

class rgovtid extends DB\SQL\Mapper {


	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'rgovtid');
	}

	public function all() { //get all users, admin only!
		$this->load();
		return $this->query;
	}

}
