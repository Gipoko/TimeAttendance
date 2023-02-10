<?php
/*
*
*
*/
class cEmpFamily extends cau { 

	public function list() {

		if($this->f3->VERB=='POST') {
			$familyMembers= $this->getFamilyMembers();
			echo json_encode(array('familymembers'=>$familyMembers));
			die;
		}
		die;
	}



	public function add() {

		$oTemp = new temp_family($this->db);
		unset($_POST['temp_family_id']);
		$this->f3->SET('POST.temp_id', $this->f3->GET('SESSION.temp_id'));

		$errMsg = 'Family member added successfully';
		$error = false;
		$msgTitle = "Success";
		$icon = "success";
		try {
			$lastId = $oTemp->add($this->f3->GET('POST'));
		} catch (PDOException $e) {
			$errMsg = $e->getMessage();
			$error = true;
			$msgTitle = "Error";
			$icon = "error";
		}

		if ($error) {
			echo json_encode(array('status'=>$error, 'msgTitle'=>$msgTitle, 'msgContent'=>$errMsg, 'icon'=>$icon));

		} else {
			$familyMembers = $this->getFamilyMembers();
			echo json_encode(array('status'=>true, 'msgTitle'=>$msgTitle,'msgContent'=>$errMsg, 'icon'=>$icon, 'familymembers'=>$familyMembers));

		}
		die;
	}

	public function edit() {
		$tfid = $this->f3->GET('POST.temp_family_id');

		$errMsg = 'Family member updated successfully';
		$error = false;
		$msgTitle = "Success";
		$icon="success";
		try {
			$oFam = new temp_family($this->db);
			$oFam->edit($tfid, $this->f3->GET('POST'));
		} catch (PDOException $e) {
			$errMsg = $e->getMessage();
			$error = true;
			$msgTitle = "Error";
			$icon="error";
		}

		if ($error) {
			echo json_encode(array('status'=>$error, 'msgTitle'=>$msgTitle, 'msgContent'=>$errMsg, 'icon'=>$icon));

		} else {
			$familyMembers = $this->getFamilyMembers();
			echo json_encode(array('status'=>true, 'msgTitle'=>$msgTitle,'msgContent'=>$errMsg, 'icon'=>$icon, 'familymembers'=>$familyMembers));

		}
		die;
	}
	public function delete() {
		$tfid = $this->f3->GET('POST.temp_family_id');

		$errMsg = 'Family member deleted successfully';
		$error = false;
		$msgTitle = "Success";
		$icon="success";
		try {
			$oFam = new temp_family($this->db);
			$oFam->delete($tfid);
		} catch (PDOException $e) {
			$errMsg = $e->getMessage();
			$error = true;
			$msgTitle = "Error";
			$icon="error";
		}

		if ($error) {
			echo json_encode(array('status'=>$error, 'msgTitle'=>$msgTitle, 'msgContent'=>$errMsg,'icon'=>$icon));

		} else {
			$familyMembers = $this->getFamilyMembers();
			echo json_encode(array('status'=>true, 'msgTitle'=>$msgTitle,'msgContent'=>$errMsg, 'familymembers'=>$familyMembers));

		}
		die;
	}

	public function display() {
		$params = $this->f3->GET('PARAMS');
		$tfid = $params['*'];
		$oFam = new temp_family($this->db);
		$res = $oFam->search($tfid);
		echo json_encode(array('status'=>true, 'msgTitle'=>$msgTitle,'msgContent'=>$errMsg, 'familymembers'=>$res[0]));
		die;
	}

	public function getFamilyMembers() {
		$empId = $this->f3->GET('SESSION.temp_id');

		$oFamilyMember = new temp_family($this->db);
		$resFamilyMembers = $oFamilyMember->findEmployeeFamilyMembersByEmployeeID($empId);

		$familyMembers = [];
		for($i=0;$i<count($resFamilyMembers);$i++) {
			$action = '<div class="button-items">
			<button type="button" 
			data-id="'.$resFamilyMembers[$i]['temp_family_id'].'"
			class="btn btn-sm btnFamilyMemberView">
				<i class="fas fa-search-plus font-size-12 align-top"></i></button>
			<button type="button" 
			data-id="'.$resFamilyMembers[$i]['temp_family_id'].'" 
			class="btn btn-sm btnFamilyMemberEdit">
				<i class="fas fa-edit  font-size-12 align-top"></i></button>
			<button type="button" 
			data-id="'.$resFamilyMembers[$i]['temp_family_id'].'"
			class="btn btn-sm btnFamilyMemberDelete">
				<i class="fas fa-eraser font-size-12 align-top"></i></button>
		</div>';

			$familyMembers[] = array(
				'temp_family_id'=>$resFamilyMembers[$i]['temp_family_id'],
				'fullName'=>$resFamilyMembers[$i]['fullName'],
				'temp_family_dob'=>$resFamilyMembers[$i]['temp_family_dob'],
				'rrelation_desc'=>$resFamilyMembers[$i]['rrelation_desc'],
				'action'=>$action
			);
		}
		return $familyMembers;
	}
}