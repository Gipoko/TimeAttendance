<?php

class rTitle extends DB\SQL\Mapper {


	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'rtitle');
	}

	public function list() { //get all users, admin only!
		$sql = "SELECT * FROM rtitle";
		return $this->db->exec($sql);
	}

	public function add($data) {
		$this->copyFrom($data);
		$this->insert();
		return $this->GET('_id');
	}
	public function edit($id, $data) {
		$this->load(array('rtitle_id=?',$id));
		$this->copyFrom($data);
		$this->update(); 
	}

	public function delete($id) {
		$this->load(array('rtitle_id=?',$id));
		$this->erase(); 
	}

}
