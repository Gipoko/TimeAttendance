<?php

/*
*
* frontpage of main controller when user login
*/
class cNationality extends cau {

	public function list() {
		$oCountry = new refProfile();
		$resCountry = $oCountry->getCountry();
		$data = [];
		for($i=0;$i<count($resCountry);$i++) {
			$data[] = array('id'=>$resCountry[$i]['rcountry_id'], 'text'=>$resCountry[$i]['rcountry_name']);
		}
		echo json_encode($data);
		die;
	}

	public function index() {

		if($this->f3->VERB=='GET') {
			$oUserMenu = new menu_skote();
			$menu = $oUserMenu->loadMenu();

			$this->f3->SET('sidebar', $menu);
			if($this->f3->GET('SESSION.user_group_id') === 5)
			{
				 $this->f3->set('content','page/unauthorized.html');
				 $this->f3->set('layout','page/unauth.html');
			}else{
			$this->f3->set('content','page/setup/personal/nationality.html');
			$this->f3->set('layout','page/layout.html');
			}
		} else {

			{
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
				$searchQuery = "";
				if($searchValue != ''){
				$searchQuery = " and (
					rcountry_id like '%".$searchValue."%' or 
					rcountry_code like '%".$searchValue."%' or
					rcountry_name like '%".$searchValue."%'
										) ";
				}
	
				$oTemp = new rNationality($this->db);
	
				$result = $oTemp->countRecords();

				$totalRecords = $result[0]['totalRecords'];
	
				$totalRecordWithFilter = $totalRecords;
				## Total number of record with filtering
				if ($searchQuery !="") {
	
					$totalRecordWithFilter = $oTemp->countRecordsWithFilter($searchQuery);
				}
	
				## Fetch records
				$oRecords = $oTemp->getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage);
	
	
				$data = [];
	
				for($i=0;$i<count($oRecords);$i++) {	
					$checked = ($oRecords[$i]['isActive'] == 1) ? 'checked' : '';
					$action = '<div class="form-check">
					<input class="form-check-input chkIsActive" type="checkbox" data-id="'.$oRecords[$i]['rcountry_id'].'" name="container"
					'.$checked .'
					>
				</div>';
					$data[] = array(
						"rcountry_id"=>$oRecords[$i]['rcountry_id'],
						"rcountry_code"=>$oRecords[$i]['rcountry_code'],
						"rcountry_name"=>$oRecords[$i]['rcountry_name'],
						"action"=>$action
					);
				}
	
				## Response
				$response = array(
				"draw" => intval($draw),
				"iTotalRecords" => $totalRecords,
				"iTotalDisplayRecords" => $totalRecordWithFilter,
				"aaData" => $data
				);
	
				echo json_encode($response);
				die;
			}
		}
	}

	public function edit() {
		$oNat = new rNationality($this->db);
		$oNat->edit($this->f3->get('POST.rcountry_id'), $this->f3->get('POST.isActive'));
		die;
	}
}