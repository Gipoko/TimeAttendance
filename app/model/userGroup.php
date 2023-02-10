<?php

class userGroup extends DB\SQL\Mapper {

/* only these db fields are allowed to be changed */
	protected $allowed_fields = array(
		"user_group_id",
		"user_group_name",
		"user_group_created",
		"user_group_updated"
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
		parent::__construct($db,'user_group');
	}

	public function list() {
		$sql = "SELECT * FROM user_group";
		return $this->db->exec($sql);
	}

	public function countRecords() {

		$sql = "SELECT COUNT(*) as totalRecords FROM user_group";

		return $this->db->exec($sql);
	}
	public function getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage) {
		$sql = "SELECT * FROM user_group ug 
		LEFT JOIN (
		SELECT tuser.user_group_id AS userGroupID,  (user_group_id) AS totalGroupIDs FROM tuser WHERE user_group_id <>0 GROUP BY user_group_id
		) summy ON summy.userGroupID = ug.user_group_id";
		$sql = $sql . " WHERE 1 ".$searchQuery." order by ".$columnName." ".$columnSortOrder." limit ".$row.",".$rowperpage;

		return $this->db->exec($sql);
	}

	public function add( $unsanitizeddata )
	{
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields); 
		$data['user_group_created']=$this->getCurrentdate();
		$data['user_group_updated']=$this->getCurrentdate();
		$this->copyFrom($data);
		$this->save();
		return $this->GET('_id');
	}

	public function getUserGroup() {
		$sql = "SELECT * FROM user_group";
		return $this->db->exec($sql);
	}

	public function edit($id, $unsanitizeddata)
	{
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$data['user_group_updated']=$this->getCurrentdate();
		$this->load(array('user_group_id=?',$id));
		$this->copyFrom($data);
		$this->update();
	}

	public function delete($id) {
		$this->load(array('user_group_id=?',$id));
		$this->erase();
	}
}
