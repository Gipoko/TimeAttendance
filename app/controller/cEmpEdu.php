<?php
/*
*
*
*/
class cEmpEdu extends cau { 

	public function list() {

		if($this->f3->VERB=='POST') {
			$edus= $this->getEdus();
			echo json_encode(array('edus'=>$edus));
		}
		die;
	}



	public function add() {

		$oTemp = new temp_edu($this->db);
		unset($_POST['temp_edu_id']);
		$this->f3->SET('POST.temp_id', $this->f3->GET('SESSION.temp_id'));

		$errMsg = 'Contact added successfully';
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
			$edus = $this->getEdus();
			echo json_encode(array('status'=>true, 'msgTitle'=>$msgTitle,'msgContent'=>$errMsg, 'icon'=>$icon, 'edus'=>$edus));

		}
		die;
	}

	public function edit() {
		$tfid = $this->f3->GET('POST.temp_edu_id');

		$errMsg = 'Education updated successfully';
		$error = false;
		$msgTitle = "Success";
		$icon="success";
		try {
			$oFam = new temp_edu($this->db);
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
			$edus = $this->getEdus();
			echo json_encode(array('status'=>true, 'msgTitle'=>$msgTitle,'msgContent'=>$errMsg, 'icon'=>$icon, 'edus'=>$edus));

		}
		die;
	}
	public function delete() {
		$tfid = $this->f3->GET('POST.temp_edu_id');

		$errMsg = 'Education deleted successfully';
		$error = false;
		$msgTitle = "Success";
		$icon="success";
		try {
			$oFam = new temp_edu($this->db);
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
			$edus = $this->getEdus();
			echo json_encode(array('status'=>true, 'msgTitle'=>$msgTitle,'msgContent'=>$errMsg, 'edus'=>$edus));

		}
		die;
	}

	public function display() {
		$params = $this->f3->GET('PARAMS');
		$tfid = $params['*'];
		$oFam = new temp_edu($this->db);
		$res = $oFam->search($tfid);
		echo json_encode(array('status'=>true, 'msgTitle'=>$msgTitle,'msgContent'=>$errMsg, 'edus'=>$res[0]));
		die;
	}

	public function getEdus() {
		$empId = $this->f3->GET('SESSION.temp_id');

		$oedus = new temp_edu($this->db);
		$resEdus = $oedus->findEdusByEmpID($empId);

		$edus = [];
		for($i=0;$i<count($resEdus);$i++) {
			$action = '<div class="button-items">
			<button type="button" 
			data-id="'.$resEdus[$i]['temp_edu_id'].'"
			class="btn btn-sm btnEducationView">
				<i class="fas fa-search-plus font-size-12 align-top"></i></button>
			<button type="button" 
			data-id="'.$resEdus[$i]['temp_edu_id'].'" 
			class="btn btn-sm btnEducationEdit">
				<i class="fas fa-edit  font-size-12 align-top"></i></button>
			<button type="button" 
			data-id="'.$resEdus[$i]['temp_edu_id'].'"
			class="btn btn-sm btnEducationDelete">
				<i class="fas fa-eraser font-size-12 align-top"></i></button>
		</div>';
			$nameAdd = $resEdus[$i]['temp_edu_schoolname'] . '<br>' . $resEdus[$i]['temp_edu_schooladdress'];
			$edus[] = array(
				'temp_edu_id'=>$resEdus[$i]['temp_edu_id'],
				'temp_edu_schoolname'=>$nameAdd,
				'redu_desc'=>$resEdus[$i]['redu_desc'],
				'temp_edu_course'=>'<div class="text-wrap wrap-200">'.$resEdus[$i]['temp_edu_course'] . '</div>',
				'temp_edu_from'=>$resEdus[$i]['temp_edu_from'] .'<br>'.$resEdus[$i]['temp_edu_to'],
				'action'=>$action
			);
		}
		return $edus;
	}
}