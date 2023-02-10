<?php

/*
*
* frontpage of main controller when user login
*/
class cDivisionUnit extends cau {


	public function index(){
		if($this->f3->VERB=='GET') {
		$oUserMenu = new menu_skote();
				$menu = $oUserMenu->loadMenu();
	
				$this->f3->SET('sidebar', $menu);
				if($this->f3->GET('SESSION.user_group_id') === 5)
				{
					 $this->f3->set('content','page/unauthorized.html');
					 $this->f3->set('layout','page/unauth.html');
				}else{
				$this->f3->set('content','/page/setup/office/division-section-unit.html');
				$this->f3->set('layout','/page/layout.html');
				}
				$divOpt = new rdivision($this->db);
			$this->f3->set('divopt', $divOpt->all());
		} else {
	
			

			$draw = $this->f3->GET('POST.draw');
			$row = $this->f3->GET('POST.start');
			$rowperpage = $this->f3->GET('POST.length'); // Rows display per page
	
				$columnIndex = $this->f3->GET("POST.order[0]['column']"); // Column index
			//$columnIndex = $_POST['order'][0]['column']; // Column index
			//var_dump($columnIndex);
			$columnName = $this->f3->GET("POST.columns[$columnIndex]['data']"); // Column name
	
	
			$columnSortOrder = $this->f3->GET("POST.order[0]['dir']"); // asc or desc
			$searchValue = $this->f3->GET("POST.search['value']"); // Search value
	
			## Search
			$searchQuery = " ";
			if($searchValue != ''){
			$searchQuery = " and (
				rdivision_sectionunit_code like '%".$searchValue."%' or
				rdivision_sectionunit_name like '%".$searchValue."%'
	
									) ";
			}
	
			$oDivision = new rDivisionUnit($this->db);
	
			$result = $oDivision->countRecords();
	
			$totalRecords = $result[0]['totalRecords'];
	
			if ($searchQuery !=" ") {
				//$searchQuery .= " and ";
			}
	
			## Total number of record with filtering
			$oRecords = $oDivision->countRecordsWithFilter($searchQuery);
			$totalRecordwithFilter = $oRecords[0]['totalFilteredRecords'];;
	
			## Fetch records
			$oRecords = $oDivision->getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage);
	
			$data = [];
	
			for($i=0;$i<count($oRecords);$i++) {
				$id = $oRecords[$i]['rdivision_sectionunit_id'];
				$action =  '';
				// if ((int)$id > 1) {
	
					$action .= '<div class="btn-group">';
					$action .= '	<button type="button" class="btn btn-info dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">';
					$action .= '		<i class="dripicons-gear"></i>';
					$action .= '	</button>';
					$action .= '	<div class="dropdown-menu">';
					$action .= '		<a class="dropdown-item btnEdit" href="#" data-id="'.$id.'">Edit</a>';
					$action .= '		<a class="dropdown-item btnDelete" href="#" data-id="'.$id.'">Delete</a>';
					$action .= '	</div>';
					$action .= '</div>';
				// }
	
	
				$data[] = array(
					"rdivision_sectionunit_id"=>$oRecords[$i]['rdivision_sectionunit_id'],
					"rdivision_id"=>$oRecords[$i]['rdivision_name'],
					"rdivision_sectionunit_code"=>$oRecords[$i]['rdivision_sectionunit_code'],
					"rdivision_sectionunit_name"=>$oRecords[$i]['rdivision_sectionunit_name'],
	
					"action"=>$action
				);
			}
	
			## Response
			$response = array(
			"draw" => intval($draw),
			"iTotalRecords" => $totalRecords,
			"iTotalDisplayRecords" => $totalRecordwithFilter,
			"aaData" => $data
			);
	
			echo json_encode($response);
			die;
		}
	}



	public function add() {

		//since we are adding new Division need to delete the Division_id which is auto increment
		//in the db.
		unset($_POST['rdivision_sectionunit_id']);
	
		$oDivision = new rDivisionUnit($this->db);
	
		$errMsg = '';
		$error = false;
		try {
			$lastId = $oDivision->add($this->f3->GET('POST'));
		} catch (PDOException $e) {
			$errMsg = $e->getMessage();
			$error = true;
		}
	
		if ($error) {
			echo json_encode(array('status'=>false, 'msgContent'=>$errMsg, 'msgTitle'=>'Error', 'icon'=>'error'));
	
		} else {
			echo json_encode(array('status'=>true, 'msgContent'=>"Division Section added successfully", 'msgTitle'=>'Success', 'icon'=>'success'));
	
		}
		die;
	}
	
	public function Edit() {
		$id = $this->f3->GET('POST.rdivision_sectionunit_id');
		$oDivision = new rDivisionUnit($this->db);
	
		$errMsg = '';
		$error = false;
		try {
			$lastId = $oDivision->edit($id, $this->f3->GET('POST'));
		} catch (PDOException $e) {
			$errMsg = $e->getMessage();
			$error = true;
		}
	
		if ($error) {
			echo json_encode(array('status'=>false, 'msgContent'=>$errMsg, 'msgTitle'=>'Error', 'icon'=>'error'));
	
		} else {
			echo json_encode(array('status'=>true, 'msgContent'=>"Division Section updated successfully", 'msgTitle'=>'Succcess', 'icon'=>'success'));
	
		}
		die;
	}
	
	public function Delete() {
		$id = $this->f3->GET('POST.rdivision_sectionunit_id');
		$oDivision = new rDivisionUnit($this->db);
	
		$errMsg = "";
		$error = false;
		try {
			$lastId = $oDivision->delete($id);
		} catch (PDOException $e) {
			//There are active records in child table
			$errMsg = $e->getMessage();
			$error = true;
		}
	
		if ($error) {
			echo json_encode(array('status'=>false, 'msgContent'=>$errMsg, 'msgTitle'=>'Error', 'icon'=>'error'));
	
		} else {
			echo json_encode(array('status'=>true, 'msgContent'=>"Division Section deleted successfully", 'msgTitle'=>'success', 'icon'=>'success'));
	
		}
		die;
	}
	















	public function list() {
		$postedDivision = $this->f3->GET('POST.rdivision_id');
		$oDivUnit = new rDivisionUnit($this->db);
		$resDivisionUnit = $oDivUnit->getDivisionUnitByDivisionID($postedDivision);
		$data = [];
		for($i=0;$i<count($resDivisionUnit);$i++) {
			$data[] = array('id'=>$resDivisionUnit[$i]['rdivision_sectionunit_id'], 
							'text'=>$resDivisionUnit[$i]['rdivision_sectionunit_name'],
							'rdivision_id'=>$resDivisionUnit[$i]['rdivision_id']
						);
		}

		echo json_encode($data);
		die;
	}

	public function getDivisionUnit() {
		$oDivUnit = new refWork($this->db);
		$resDivUnit = $oDivUnit->getDivisionUnit();
		$data = [];
		for($i=0;$i<count($resDivUnit);$i++) {
			$data[] = array('id'=>$resDivUnit[$i]['rdivision_sectionunit_id']
			,'text'=>$resDivUnit[$i]['rdivision_sectionunit_name']
			, 'rdivision_id'=>$resDivUnit[$i]['rdivision_id']);
		}

		echo json_encode($data);
		die;
	}
}