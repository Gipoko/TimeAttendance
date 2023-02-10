<?php
class cdeduction extends cau{

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
			$this->f3->set('content','/page/setup/payroll/deduction.html');
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
			rpr_deduction_code like '%".$searchValue."%' or
			rpr_deduction_desc like '%".$searchValue."%'

								) ";
		}

		$oDeduction = new rdeduction($this->db);

		$result = $oDeduction->countRecords();

		$totalRecords = $result[0]['totalRecords'];

		if ($searchQuery !=" ") {
			//$searchQuery .= " and ";
		}

		## Total number of record with filtering
		$oRecords = $oDeduction->countRecordsWithFilter($searchQuery);
		$totalRecordwithFilter = $oRecords[0]['totalFilteredRecords'];;

		## Fetch records
		$oRecords = $oDeduction->getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage);

		$data = [];

		for($i=0;$i<count($oRecords);$i++) {
			$id = $oRecords[$i]['rpr_deduction_id'];
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
				"rpr_deduction_id"=>$oRecords[$i]['rpr_deduction_id'],
				"rpr_deduction_code"=>$oRecords[$i]['rpr_deduction_code'],
				"rpr_deduction_desc"=>$oRecords[$i]['rpr_deduction_desc'],
				"rpr_deduction_default_amt"=>$oRecords[$i]['rpr_deduction_default_amt'],
				"rpr_deduction_new_amt"=>$oRecords[$i]['rpr_deduction_new_amt'],
				"rpr_deduction_lessthan_threshold"=>$oRecords[$i]['rpr_deduction_lessthan_threshold'],
				"rpr_deduction_greaterthan_threshold"=>$oRecords[$i]['rpr_deduction_greaterthan_threshold'],
				"rpr_deduction_is_mandatory"=>$oRecords[$i]['rpr_deduction_is_mandatory'],
				"rpr_deduction_is_taxable"=>$oRecords[$i]['rpr_deduction_is_taxable'],
				"rpr_deduction_is_active"=>$oRecords[$i]['rpr_deduction_is_active'],
				"rpr_deduction_is_printable"=>$oRecords[$i]['rpr_deduction_is_printable'],
				"rpr_deduction_frequency"=>$oRecords[$i]['rpr_deduction_frequency'],
				"rpr_deduction_formula"=>$oRecords[$i]['rpr_deduction_formula'],
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

	//since we are adding new deduction need to delete the deduction_id which is auto increment
	//in the db.
	unset($_POST['rpr_deduction_id']);

	$oDeduction = new rdeduction($this->db);

	$errMsg = '';
	$error = false;
	try {
		$lastId = $oDeduction->add($this->f3->GET('POST'));
	} catch (PDOException $e) {
		$errMsg = $e->getMessage();
		$error = true;
	}

	if ($error) {
		echo json_encode(array('status'=>false, 'msgContent'=>$errMsg, 'msgTitle'=>'Error', 'icon'=>'error'));

	} else {
		echo json_encode(array('status'=>true, 'msgContent'=>"Deduction added successfully", 'msgTitle'=>'Success', 'icon'=>'success'));

	}
	die;
}

public function Edit() {
	$id = $this->f3->GET('POST.rpr_deduction_id');
	$oDeduction = new rdeduction($this->db);

	$errMsg = '';
	$error = false;
	try {
		$lastId = $oDeduction->edit($id, $this->f3->GET('POST'));
	} catch (PDOException $e) {
		$errMsg = $e->getMessage();
		$error = true;
	}

	if ($error) {
		echo json_encode(array('status'=>false, 'msgContent'=>$errMsg, 'msgTitle'=>'Error', 'icon'=>'error'));

	} else {
		echo json_encode(array('status'=>true, 'msgContent'=>"Deduction updated successfully", 'msgTitle'=>'Success', 'icon'=>'success'));

	}
	die;
}

public function Delete() {
	$id = $this->f3->GET('POST.rpr_deduction_id');
	$oDeduction = new rdeduction($this->db);

	$errMsg = "";
	$error = false;
	try {
		$lastId = $oDeduction->delete($id);
	} catch (PDOException $e) {
		//There are active records in child table
		$errMsg = $e->getMessage();
		$error = true;
	}

	if ($error) {
		echo json_encode(array('status'=>false, 'msgContent'=>$errMsg, 'msgTitle'=>'Error', 'icon'=>'error'));

	} else {
		echo json_encode(array('status'=>true, 'msgContent'=>"Deduction deleted successfully", 'msgTitle'=>'Success', 'icon'=>'success'));

	}
	die;
}

}
