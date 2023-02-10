<?php

class cUserGroup extends cau {

	public function index() {
		if($this->f3->VERB=='GET') {
			$oUserMenu = new menu_skote();
			$menu = $oUserMenu->loadMenu();

			$this->f3->SET('sidebar', $menu);
			$this->f3->set('content','page/user-management/group.html');
			$this->f3->set('layout','page/layout.html');
		
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
				temp_first like '%".$searchValue."%' or
				rposition_desc like '%".$searchValue."%' or
				temp_mobile like '%".$searchValue."%' or
				temp_efn like '%".$searchValue."%' or
				temp_last like '%".$searchValue."%'
									) ";
			}

			$oUser = new userGroup($this->db);

			$result = $oUser->countRecords();

			$totalRecords = $result[0]['totalRecords'];

			if ($searchQuery !=" ") {
				//$searchQuery .= " and ";
			}

			## Fetch records
			$oRecords = $oUser->getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage);
			$totalRecordwithFilter = count($oRecords);
			$data = [];
			
			for($i=0;$i<count($oRecords);$i++) {
				$tempid = $oRecords[$i]['user_group_id'];

				$action =  '<div class="d-flex gap-2 flex-wrap">';
				$action .= '	<div class="btn-group dropend">';
				$action .= '		<button type="button" class="btn btn-sm btn-info dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">';
				$action .= '			<i class="fas fa-cog"></i>';
				$action .= '		</button>';
				$action .= '		<div class="dropdown-menu">';
				$action .= '			<a class="dropdown-item btnUserGroupEdit" href="#" data-id="'.$tempid.'">Edit Group</a>';
				if ($oRecords[$i]['totalGroupIDs'] <=0) {
					$action .= '			<a class="dropdown-item btnUserGroupDelete" href="#" data-id="'.$tempid.'">Delete Group</a>';
				}

				$action .= '			<a class="dropdown-item btnUserGroupModules" href="#" data-id="'.$tempid.'">Group Modules</a>';
				$action .= '		</div>';
				$action .= '	</div>';
				$action .= '</div>';

				$data[] = array(
					"user_group_id"=>$oRecords[$i]['user_group_id'],
					"user_group_name"=>$oRecords[$i]['user_group_name'],
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
		unset($_POST['user_group_id']);
		$userGroup = new userGroup($this->db);

		$errMsg = '';
		$error = false;
		try {
			$lastId = $userGroup->add($this->f3->GET('POST'));
		} catch (PDOException $e) {
			$errMsg = $e->getMessage();
			$error = true;
		}

		if ($error) {
			echo json_encode(array('status'=>false, 'msgcontent'=>$errMsg, 'msgtitle'=>'Message', 'icon'=>'error'));

		} else {
			echo json_encode(array('status'=>true, 'msgcontent'=>"New User Group added successfully", 'msgtitle'=>'Message', 'icon'=>'success'));

		}
		die;
	}

	public function edit(){
		$userGroup = new userGroup($this->db);
		$id = $this->f3->GET('POST.user_group_id');
		$errMsg = '';
		$error = false;
		try {
			$lastId = $userGroup->edit($id, $this->f3->GET('POST'));
		} catch (PDOException $e) {
			$errMsg = $e->getMessage();
			$error = true;
		}

		if ($error) {
			echo json_encode(array('status'=>false, 'msgContent'=>$errMsg, 'msgTitle'=>'Message', 'icon'=>'error'));

		} else {
			echo json_encode(array('status'=>true, 'msgContent'=>"User Group updated successfully", 'msgTitle'=>'Message', 'icon'=>'success'));

		}
		die;
	}

	public function delete(){
		$userGroup = new userGroup($this->db);
		$id = $this->f3->GET('POST.user_group_id');
		$errMsg = '';
		$error = false;
		try {
			$lastId = $userGroup->delete($id);
		} catch (PDOException $e) {
			$errMsg = $e->getMessage();
			$error = true;
		}

		if ($error) {
			echo json_encode(array('status'=>false, 'msgcontent'=>$errMsg, 'msgtitle'=>'Message', 'icon'=>'error'));

		} else {
			echo json_encode(array('status'=>true, 'msgcontent'=>"User Group deleted successfully", 'msgtitle'=>'Message', 'icon'=>'success'));

		}
		die;
	}

	public function groupModules() {
		$userGroupId = $this->f3->GET('POST.user_group_id');
		$oUGM = new user_group_module($this->db);
		$oRecords = $oUGM->getUserGroupModuleslist($userGroupId);
		if (count($oRecords) <= 0 ) {
			//copy from templates
			// $oUGM->copyFromTemplate($userGroupId);
			$oRecords = $oUGM->getUserGroupModuleslist($userGroupId);
			
		}
		$data = [];
		for($i=0;$i<count($oRecords);$i++) {
			$tempid = $oRecords[$i]['menu_id'];

			$data[] = array(
				"menu_id"=>$oRecords[$i]['menu_id'],
				"tuser_accessgroup_id"=>$oRecords[$i]['tuser_accessgroup_id'],
				"menu_name"=>$oRecords[$i]['menu_name'],
				"menu_route"=>$oRecords[$i]['menu_route'],
				// "user_route_template_disable"=>$oRecords[$i]['user_route_template_disable'],
				// "user_route_template_full_access"=>$oRecords[$i]['user_route_template_full_access'],
				"menu_create"=>$oRecords[$i]['menu_create'],
				"menu_read"=>$oRecords[$i]['menu_read'],
				"menu_update"=>$oRecords[$i]['menu_update'],
				"menu_delete"=>$oRecords[$i]['menu_delete']
			);
		}

		echo json_encode(array('usergroupmodules'=>$data));
		die;
	}

	public function updatekey() {

		$id = $this->f3->GET('POST.menu_id');
		$key =$this->f3->GET('POST.key');
		$value = $this->f3->GET('POST.value');
		if ($value === 'false') {
			$value = 'N';
		} else {
			$value = 'Y';
		}
		$oUGM = new user_group_module($this->db);

		$oUGM->updatekey($id, $key, $value);
		die;
	}

 }