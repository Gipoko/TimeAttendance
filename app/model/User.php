<?php

class User extends DB\SQL\Mapper {

/* only these db fields are allowed to be changed */
	protected $allowed_fields = array(
		"tuser_username",
		"tuser_password",
		"tuser_email",
		"tuser_activated",
		"tuser_hash",
		"tuser_type"
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
		parent::__construct($db,'tuser');
	}

	public function list() {
		$sql = "SELECT * FROM temp temp
		LEFT JOIN tuser u ON u.tuser_ids = temp.tuser_id";
		return $this->db->exec($sql);
	}

	public function countRecords() {

		$sql = "select temp.*, concat(temp.temp_first, ' ', temp.temp_mid, ' ', temp.temp_last, ' ', temp.temp_suffice) as fullName, u.tuser_ids, u.tuser_username, u.tuser_email, u.tuser_type, u.tuser_enabled, rp.rposition_name, ug.user_group_name, ug.user_group_id from temp temp left join tuser u on temp.tuser_id = u.tuser_ids LEFT JOIN user_group ug ON ug.user_group_id = u.user_group_id left join (select tw2.* from temp_work tw2 INNER join (select tw3.temp_id, max(tw3.temp_work_id) temp_work_id from temp_work tw3 group by tw3.temp_id ) twg on twg.temp_work_id = tw2.temp_work_id) tw on temp.temp_id = tw.temp_id left join rposition rp on tw.rposition_id = rp.rposition_id";

		return $this->db->exec($sql);
	}

	public function countRecordsWithFilter($filter) {
		$sql = "select temp.*,
		trim(concat(temp.temp_first, ' ', temp.temp_mid, ' ', temp.temp_last, ' ', IF(temp.temp_suffice = 'n/a', '', temp.temp_suffice))) as fullName,
		u.tuser_ids, u.tuser_username, u.tuser_email, u.tuser_type, u.tuser_enabled, rp.rposition_name, ug.user_group_name, ug.user_group_id from temp temp
		left join tuser u on temp.tuser_id = u.tuser_ids
		LEFT JOIN user_group ug ON ug.user_group_id = u.user_group_id
left join (select tw2.* from temp_work tw2 INNER join (select tw3.temp_id, max(tw3.temp_work_id) temp_work_id from temp_work tw3 group by tw3.temp_id
) twg on twg.temp_work_id = tw2.temp_work_id) tw on temp.temp_id = tw.temp_id 
left join rposition rp on tw.rposition_id = rp.rposition_id";

		$sql = $sql . " WHERE 1 $filter";
		$result = $this->db->exec($sql);

		return count($result);
	}
	public function getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage) {
		$sql = "select temp.*,
		trim(concat(temp.temp_first, ' ', temp.temp_mid, ' ', temp.temp_last, ' ', IF(temp.temp_suffice = 'n/a', '', temp.temp_suffice))) as fullName,
		u.tuser_ids, u.tuser_username, u.tuser_email, u.tuser_type, u.tuser_enabled, rp.rposition_name, ug.user_group_name, ug.user_group_id from temp temp
		left join tuser u on temp.tuser_id = u.tuser_ids
		LEFT JOIN user_group ug ON ug.user_group_id = u.user_group_id
left join (select tw2.* from temp_work tw2 INNER join (select tw3.temp_id, max(tw3.temp_work_id) temp_work_id from temp_work tw3 group by tw3.temp_id
) twg on twg.temp_work_id = tw2.temp_work_id) tw on temp.temp_id = tw.temp_id 
left join rposition rp on tw.rposition_id = rp.rposition_id";

		$sql = $sql . " WHERE 1 ".$searchQuery." order by ".$columnName." ".$columnSortOrder." limit ".$row.",".$rowperpage;
		// var_dump($sql);
		// die;
		return $this->db->exec($sql);
	}

	public function add( $unsanitizeddata ) {
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		//check if username already exists in db 
		$data['created_at']=$this->getCurrentdate();
		$data['updated_at']=$this->getCurrentdate();
		$this->copyFrom($data);
		$this->save();
		return $this->GET('_id');
	}

	public function changeusername($id, $username) {
		$this->load(array('tuser_ids=?',$id));
		$this->tuser_username=$username;
		$this->tuser_activate = 1;
		$this->update();
	}

	public function changeUserPassword($id, $newPassword) {
		$this->load(array('tuser_ids=?',$id));
		$this->tuser_password=$newPassword;
		$this->tuser_activate = 1;
		$this->update();
	}

	public function accountdisable($id, $enabled) {
		$this->load(array('tuser_ids=?',$id));
		$this->tuser_enabled=$enabled;
		$this->tuser_activated=0;
		$this->update();
	}

	public function accountenable($id, $enabled) {
		$this->load(array('id=?',$id));
		$this->enabled=$enabled;
		$this->activated=1;
		$this->update();
	}

	public function createusername($id, $username, $password) {
		$this->load(array('tuser_ids=?',$id));
		$this->tuser_username=$username;
		$this->tuser_password=$password;
		$this->tuser_activated=1;
		$this->update();
	}

	public function setusergroup($id, $newUserGroup) {
		$this->load(array('tuser_ids=?',$id));
		$this->user_group_id=$newUserGroup;
		$this->tuser_activated=1;
		
		$this->update();
	}

	public function getByName($name)
	{
		$this->load(array('username=?', $name));
	}

	public function getByEmail($email)
	{
		$this->load(array('email=?', $email));
		$this->copyTo('POST');
	}

	public function getById($id)
	{
		$this->load(array('id=?',$id));
		$this->copyTo('POST');
	}

	public function login($id)
	{
		$this->load(array('id=?',$id));
		$this->copyTo('SESSION');
	}

	public function getByHash($hash)
	{
		$this->load(array('hash=? AND activated=0',$hash));
		$this->copyTo('POST');
	}

	public function checkActivatedHash($hash)
	{
		$this->load(array('hash=? AND activated=1',$hash));
		$this->copyTo('POST');
	}

	public function edit($id, $unsanitizeddata)
	{
		$data=$this->sanitizeInput($unsanitizeddata, $this->allowed_fields);
		$data['updated_at']=$this->getCurrentdate();
		$this->load(array('id=?',$id));
		$this->copyFrom($data);
		$this->update();
	}

	public function updateEmailUserType($id, $email, $userType) {
		$this->load(array('id=?',$id));
		$this->email=$email;
		$this->user_type=$userType;
		$this->update();
	}

	public function updateMobile($id, $mobile) {
		$this->load(array('id=?',$id));
		$this->username=$mobile;
		$this->update();
	}
	public function activate($id)
	{
		$data['updated_at']=$this->getCurrentdate();
		$this->load(array('id=?',$id));
		$this->updated_at=$this->getCurrentdate();
		$this->activated=1;
		$this->update();
	}

	public function delete($id) {
		$this->load(array('id=?',$id));
		$this->erase();
	}

	public function changePassword($un, $npw) {

		$this->load(array('username=?',$un));
		$data['updated_at']=$this->getCurrentdate();
		$this->updated_at=$this->getCurrentdate();
		$this->password=$npw;
		$this->update();
	}

	public function getLastRecord() {
		$sql = "SELECT count(*) as totalRecords from tuser";
		return $this->db->exec($sql);
	}
}
