<?php

class temp_deduction extends DB\SQL\Mapper {


	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'temp_deductions');
	}

	
	public function list($id) { //get all users, admin only!
		$sql = "SELECT * FROM temp_deductions where temp_id = ?";
		return $this->db->exec($sql, array(1=>$id));
	}

	public function add($data) {
		$this->copyFrom($data);
		$this->insert();
		return $this->GET('_id');
	}
	public function edit($id, $data) {
		$this->load(array('temp_deduction_id=?',$id));
		$this->copyFrom($data);
		$this->update(); 
	}

	public function delete($id) {
		$this->load(array('temp_deduction_id=?',$id));
		$this->erase(); 
	}

}
