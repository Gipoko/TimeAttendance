<?php

class tusermenu extends DB\SQL\Mapper {


	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'tuser_menu');
	}

	public function all() { //get all users, admin only!
		$this->load();
		return $this->query;
	}
	public function getMenuLevel($id) {
		$sql = "SELECT * FROM tuser_menu WHERE menu_parent_id = ? ORDER BY menu_id";
		return $this->db->exec($sql, array(1=>$id));
	} 

	public function countMenuChildren($id) {
		$sql = "SELECT count(*) as totalChildren FROM tuser_menu WHERE menu_parent_id = ? ORDER BY menu_id";
		$res = $this->db->exec($sql, array(1=>$id));
		return $res[0]['totalChildren'];
	}
}
