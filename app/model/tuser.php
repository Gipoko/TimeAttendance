<?php

class tuser extends DB\SQL\Mapper {

/* only these db fields are allowed to be changed */
	protected $allowed_fields = array(
		"tuser_ids",
		"tuser_username",
		"tuser_password",
		"tuser_activated",
		"tuser_accessgroup_id",
		"tuser_created",
		"tuser_updated"
	);

	public function __construct(DB\SQL $db) {
		parent::__construct($db,'tuser');
	}

	private function getCurrentDate() {
		date_default_timezone_set("Asia/Manila");
		return date("Y-m-d H:i:s");
	}

	//remove from $_POST any extra fields not found in the table
	private function sanitizeInput(array $data, array $fieldNames) {
	   return array_intersect_key($data, array_flip($fieldNames));
	}

	public function add( $unsanitizeddata ) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		//check if username already exists in db 
		$data['tuser_created']=$this->getCurrentDate();
		$data['tuser_updated']=$this->getCurrentDate();
		$this->copyFrom($data);
		$this->save();
		return $this->GET('_id');
	}

	public function edit($id, $unsanitizeddata) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$data['tuser_updated']=$this->getCurrentdate();
		$this->load(array('tuser_ids=?',$id));
		$this->copyFrom($data);
		$this->update();
	}

	public function delete($id) {
		$this->load(array('tuser_ids=?',$id));
		$this->erase();
	}

	/*
	*
	* param : $setToPost - copy to $_POST the found data
	*/
	public function getByEmail($email, $setToPost) {
		$this->load(array('tuser_username=?', $email));
		if ($setToPost) {
			$this->copyTo('POST');
		}
	}

	public function getById($id) {
		$this->load(array('tuser_ids=?',$id));
		$this->copyTo('POST');
	}

	public function login($id) {
		$this->load(array('tuser_ids=?',$id));
		$this->copyTo('SESSION');
	}

	public function countRecords() {
		$sql = "SELECT COUNT(*) as totalRecords FROM tuser";
		return $this->db->exec($sql);
	}
	
	public function getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage) {
		$sql = "select tmp.*,
		concat(tmp.temp_first, ' ', tmp.temp_mid, ' ', tmp.temp_last, ' ', tmp.rsuffix_id) as fullName,
		u.id, u.username, u.email, u.user_type, u.enabled, rp.rposition_name, ug.user_group_name, ug.user_group_id from temp tmp
		left join users u on tmp.user_id = u.id
		LEFT JOIN user_group ug ON ug.user_group_id = u.user_group_id
left join (select tw2.* from temp_work tw2 INNER join (select tw3.temp_id, max(tw3.temp_work_id) temp_work_id from temp_work tw3 group by tw3.temp_id
) twg on twg.temp_work_id = tw2.temp_work_id) tw on tmp.temp_id = tw.temp_id 
left join rposition rp on tw.rposition_id = rp.rposition_id";

		$sql = $sql . " WHERE 1 ".$searchQuery." order by ".$columnName." ".$columnSortOrder." limit ".$row.",".$rowperpage;

		return $this->db->exec($sql);
	}


	public function changeusername($id, $username) {
		$this->load(array('tuser_ids=?',$id));
		$this->username=$username;
		$this->activate = 1;
		$this->update();
	}

	public function changeUserPassword($id, $newPassword) {
		$this->load(array('tuser_ids=?',$id));
		$this->password=$newPassword;
		$this->activate = 1;
		$this->update();
	}


	public function accountActivate($id, $enabled) {
		$this->load(array('tuser_ids=?',$id));
		$this->tuser_activated=$enabled;
		$this->update();
	}

	public function setUserGroup($id, $newUserGroup) {
		$this->load(array('tuser_ids=?',$id));
		$this->tuser_accessgroup_id=$newUserGroup;
		$this->activated=1;
		
		$this->update();
	}

	public function changePassword($id, $npw) {
		$this->load(array('tuser_ids=?',$id));
		$this->tuser_updated=$this->getCurrentdate();
		$this->password=$npw;
		$this->update();
	}

	public function getTotalRecord() {
		$sql = "SELECT count(*) as totalRecords from tuser";
		return $this->db->exec($sql);
	}
}