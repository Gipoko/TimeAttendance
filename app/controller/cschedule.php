<?php
class cschedule extends cau{

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
			$this->f3->set('content','/page/setup/payroll/schedule.html');
			$this->f3->set('layout','/page/layout.html');
			}
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
			
			rsched_name like '%".$searchValue."%' or
            rsched_amtimein like '%".$searchValue."%' or
            rsched_amtimeout like '%".$searchValue."%' or
            rsched_pmtimein like '%".$searchValue."%' or
            rsched_pmtimeout like '%".$searchValue."%' or
            rsched_entry like '%".$searchValue."%' 
								) ";
		}

		$oSchedule = new rschedule($this->db);

		$result = $oSchedule->countRecords();

		$totalRecords = $result[0]['totalRecords'];

		if ($searchQuery !=" ") {
			//$searchQuery .= " and ";
		}

		## Total number of record with filtering
		$oRecords = $oSchedule->countRecordsWithFilter($searchQuery);
		$totalRecordwithFilter = $oRecords[0]['totalFilteredRecords'];;

		## Fetch records
		$oRecords = $oSchedule->getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage);

		$data = [];

		for($i=0;$i<count($oRecords);$i++) {
			$id = $oRecords[$i]['rsched_id'];
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
				"rsched_id"=>$oRecords[$i]['rsched_id'],
                "rsched_name"=>$oRecords[$i]['rsched_name'],
                "rsched_amtimein"=>$oRecords[$i]['rsched_amtimein'],
                "rsched_amtimeout"=>$oRecords[$i]['rsched_amtimeout'],
                "rsched_pmtimein"=>$oRecords[$i]['rsched_pmtimein'],
                "rsched_pmtimeout"=>$oRecords[$i]['rsched_pmtimeout'],
                "rsched_entry"=>$oRecords[$i]['rsched_entry'],
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

	//since we are adding new Position need to delete the Position_id which is auto increment
	//in the db.
	unset($_POST['rsched_id']);

	$oSchedule = new rschedule($this->db);

	$errMsg = '';
	$error = false;
	try {
		$lastId = $oSchedule->add($this->f3->GET('POST'));
	} catch (PDOException $e) {
		$errMsg = $e->getMessage();
		$error = true;
	}

	if ($error) {
		echo json_encode(array('status'=>false, 'msgContent'=>$errMsg, 'msgTitle'=>'Error', 'icon'=>'error'));

	} else {
		echo json_encode(array('status'=>true, 'msgContent'=>"Schedule added successfully", 'msgTitle'=>'Success', 'icon'=>'success'));

	}
	die;
}

public function Edit() {
	$id = $this->f3->GET('POST.rsched_id');
	$oSchedule = new rschedule($this->db);

	$errMsg = '';
	$error = false;
	try {
		$lastId = $oSchedule->edit($id, $this->f3->GET('POST'));
	} catch (PDOException $e) {
		$errMsg = $e->getMessage();
		$error = true;
	}

	if ($error) {
		echo json_encode(array('status'=>false, 'msgContent'=>$errMsg, 'msgTitle'=>'Error', 'icon'=>'error'));

	} else {
		echo json_encode(array('status'=>true, 'msgContent'=>"Schedule updated successfully", 'msgTitle'=>'Success', 'icon'=>'success'));

	}
	die;
}

public function Delete() {
	$id = $this->f3->GET('POST.rsched_id');
	$oSchedule = new rschedule($this->db);

	$errMsg = "";
	$error = false;
	try {
		$lastId = $oSchedule->delete($id);
	} catch (PDOException $e) {
		//There are active records in child table
		$errMsg = $e->getMessage();
		$error = true;
	}

	if ($error) {
		echo json_encode(array('status'=>false, 'msgContent'=>$errMsg, 'msgTitle'=>'Error', 'icon'=>'error'));

	} else {
		echo json_encode(array('status'=>true, 'msgContent'=>"Schedule deleted successfully", 'msgTitle'=>'Success', 'icon'=>'success'));

	}
	die;
}

}
