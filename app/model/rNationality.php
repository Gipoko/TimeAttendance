<?php

class rNationality extends DB\SQL\Mapper {
	
	public function __construct(DB\SQL $db)  {
		parent::__construct($db,'rcountry');
	}

	public function list() {
		$sql = "SELECT * FROM rdivision";
		return $this->db->exec($sql);
	}

	public function countRecords() {

		$sql = "SELECT COUNT(*) as totalRecords FROM rcountry";

		return $this->db->exec($sql);
	}

	public function countRecordsWithFilter($filter) {
		$sql="select * from rcountry WHERE 1 $filter"; 
		$result = $this->db->exec($sql); 
		return count($result);
	}

	public function getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage) {
		$sql="SELECT * FROM rcountry ";

		$sql = $sql . " WHERE 1 ".$searchQuery." order by ".$columnName." ".$columnSortOrder." limit ".$row.",".$rowperpage;

		return $this->db->exec($sql);
	}

	public function edit($id, $value) {
		$this->load(array('rcountry_id=?',$id));
		$this->isActive = $value;
		$this->update(); 
	}

}