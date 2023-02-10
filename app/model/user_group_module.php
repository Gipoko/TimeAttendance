<?php

class user_group_module extends DB\SQL\Mapper {

/* only these db fields are allowed to be changed */
	protected $allowed_fields = array(
		"username",
		"password",
		"email",
		"activated",
		"hash",
		"user_type"
	);

	private function sanitizeInput(array $data, array $fieldNames)
	{ //sanitize input - with thanks to richgoldmd
	   return array_intersect_key($data, array_flip($fieldNames));
	}

	private function getCurrentdate()
	{
		return date("Y-m-d H:i:s");
	}

	public function __construct(DB\SQL $db)
	{
		parent::__construct($db,'tuser_menu');
	}

	public function getUserGroupModuleslist($userGroup) {
		$sql = "SELECT * FROM tuser_menu WHERE tuser_accessgroup_id = 1";
		return $this->db->exec($sql,array(1=>$userGroup));
	}

	// public function copyFromTemplate($userGroup) {
	// 	$sql = "
	// 	INSERT INTO tuser_menu(
	// 	   tuser_accessgroup_id
	// 	   ,menu_name
	// 	   ,menu_route
	// 	   ,menu_create
	// 	   ,menu_read
	// 	   ,menu_update
	// 	   ,menu_delete

	// 	 ) SELECT $userGroup
	// 	 ,menu_name
	// 	   ,menu_route
	// 	   ,menu_create
	// 	   ,menu_read
	// 	   ,menu_update
	// 	   ,menu_delete
	// 	  FROM tuser_menu_copy
	// 	";
	// 	var_dump($sql);
	// 	return $this->db->exec($sql);


	// }

	public function list($userGroupid) {
		$sql = "select * from tuser_menu where tuser_accessgroup_id = ?";
		return $this->db->exec($sql, array(1=>$userGroupid));
	}
	public function findRouteTemplate($userId, $userGroup, $routeName) {
		$sql = "SELECT * FROM user_routes WHERE user_id = ? AND AND tuser_menu = ? AND user_route_template_routename = ?";
		return $this->db->exec($sql, array(1=>$userId, 2=>$userGroup, 3=>$routeName));
	}

	public function findRouteByUserGroup($userGroup, $routeName) {
		$sql = "SELECT * FROM tuser_menu WHERE tuser_accessgroup_id = ? AND user_route_template_routename = ?";
		return $this->db->exec($sql, array(1=>$userGroup, 2=>$routeName));
	}

	public function countRecords() {

		$sql = "SELECT COUNT(*) as totalRecords FROM users";

		return $this->db->exec($sql);
	}
	public function getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage) {
		$sql = "SELECT *,
		CONCAT(temp.temp_first, ' ', temp.temp_mid, ' ', temp.temp_last, ' ', temp.rsuffix_id) AS fullName,
		(SELECT rposition.rposition_desc FROM rposition WHERE rposition.rposition_id = tw.rposition_id) AS position_desc
		FROM temp temp
		LEFT JOIN users u ON u.id = temp.user_id
		LEFT JOIN temp_work tw ON tw.temp_id = temp.temp_id";
		$sql = $sql . " WHERE 1 ".$searchQuery." order by ".$columnName." ".$columnSortOrder." limit ".$row.",".$rowperpage;

		return $this->db->exec($sql);
	}

	public function add( $unsanitizeddata )
	{
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		//check if username already exists in db
		$this->load(array('username=?',$data['username']));
		if(!$this->dry())
		{
			return .2;
		}
		//check if email already exists in db
		$this->load(array('email=?',$data['email']));
		if(!$this->dry())
		{
			return 0.1;
		}
		$data['created_at']=$this->getCurrentdate();
		$data['updated_at']=$this->getCurrentdate();
		$this->copyFrom($data);
		$this->save();
		return $this->GET('_id');
	}

	public function updatekey($id, $key, $value) {
		$sql = "UPDATE tuser_menu SET $key = ? WHERE menu_id = ?";
		return $this->db->exec($sql, array(1=>$value, 2=>$id));
	}
}