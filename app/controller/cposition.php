<?php
class cposition extends cau{

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
			$this->f3->set('content','/page/setup/payroll/position.html');
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
			rposition_code like '%".$searchValue."%' or
			rposition_name like '%".$searchValue."%' or
			rposition_desc like '%".$searchValue."%' or
			rgradestep_gradeno like '%".$searchValue."%' or
			rgradestep_stepno like '%".$searchValue."%' or
								) ";
		}

		$oPosition = new rposition($this->db);

		$result = $oPosition->countRecords();

		$totalRecords = $result[0]['totalRecords'];

		if ($searchQuery !=" ") {
			//$searchQuery .= " and ";
		}

		## Total number of record with filtering
		$oRecords = $oPosition->countRecordsWithFilter($searchQuery);
		$totalRecordwithFilter = $oRecords[0]['totalFilteredRecords'];;

		## Fetch records
		$oRecords = $oPosition->getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage);

		$data = [];

		for($i=0;$i<count($oRecords);$i++) {
			$id = $oRecords[$i]['rposition_id'];
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
				"rposition_id"=>$oRecords[$i]['rposition_id'],
				"rposition_code"=>$oRecords[$i]['rposition_code'],
				"rposition_desc"=>$oRecords[$i]['rposition_desc'],
				"rposition_name"=>$oRecords[$i]['rposition_name'],
				"rgradestep_gradeno"=>$oRecords[$i]['rgradestep_gradeno'],
				"rgradestep_stepno"=>$oRecords[$i]['rgradestep_stepno'],
				"rposition_is_active"=>$oRecords[$i]['rposition_is_active'],
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
	unset($_POST['rposition_id']);

	$oPosition = new rposition($this->db);

	$errMsg = '';
	$error = false;
	try {
		$lastId = $oPosition->add($this->f3->GET('POST'));
	} catch (PDOException $e) {
		$errMsg = $e->getMessage();
		$error = true;
	}

	if ($error) {
		echo json_encode(array('status'=>false, 'msgContent'=>$errMsg, 'msgTitle'=>'Error', 'icon'=>'error'));

	} else {
		echo json_encode(array('status'=>true, 'msgContent'=>"Position added successfully", 'msgTitle'=>'Success', 'icon'=>'success'));

	}
	die;
}

public function Edit() {
	$id = $this->f3->GET('POST.rposition_id');
	$oPosition = new rposition($this->db);

	$errMsg = '';
	$error = false;
	try {
		$lastId = $oPosition->edit($id, $this->f3->GET('POST'));
	} catch (PDOException $e) {
		$errMsg = $e->getMessage();
		$error = true;
	}

	if ($error) {
		echo json_encode(array('status'=>false, 'msgContent'=>$errMsg, 'msgTitle'=>'Error', 'icon'=>'error'));

	} else {
		echo json_encode(array('status'=>true, 'msgContent'=>"Position updated successfully", 'msgTitle'=>'Success', 'icon'=>'success'));

	}
	die;
}

public function Delete() {
	$id = $this->f3->GET('POST.rposition_id');
	$oPosition = new rposition($this->db);

	$errMsg = "";
	$error = false;
	try {
		$lastId = $oPosition->delete($id);
	} catch (PDOException $e) {
		//There are active records in child table
		$errMsg = $e->getMessage();
		$error = true;
	}

	if ($error) {
		echo json_encode(array('status'=>false, 'msgContent'=>$errMsg, 'msgTitle'=>'Error', 'icon'=>'error'));

	} else {
		echo json_encode(array('status'=>true, 'msgContent'=>"Position deleted successfully", 'msgTitle'=>'Success', 'icon'=>'success'));

	}
	die;
}

public function getPositions() {
	$oPosition = new rPosition($this->db);
	$resPosition = $oPosition->getPositions();
	$data = [];
	for($i=0;$i<count($resPosition);$i++) {
		$data[] = array('id'=>$resPosition[$i]['rposition_id'], 'text'=>$resPosition[$i]['rposition_name'], 
						'rgradestep_gradeno'=>$resPosition[$i]['rgradestep_gradeno'], 
						'rgradestep_stepno'=>$resPosition[$i]['rgradestep_stepno']);
	}

	echo json_encode($data);
	die;
}

}
