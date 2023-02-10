<?php
/*
*
*
*/
class cEmpExp extends cau { 

	public function list() {

		if($this->f3->VERB=='POST') {
			$Exps= $this->getExp();
			echo json_encode(array('exps'=>$Exps));
		}
		die;
	}



	public function add() {

		$oTemp = new temp_exp($this->db);
		unset($_POST['temp_exp_id']);
		$this->f3->SET('POST.temp_id', $this->f3->GET('SESSION.temp_id'));

		$errMsg = 'Experience added successfully';
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
			$Exps = $this->getExp();
			echo json_encode(array('status'=>true, 'msgTitle'=>$msgTitle,'msgContent'=>$errMsg, 'icon'=>$icon, 'exps'=>$Exps));

		}
		die;
	}

	public function edit() {
		$tfid = $this->f3->GET('POST.temp_exp_id');

		$errMsg = 'Experience updated successfully';
		$error = false;
		$msgTitle = "Success";
		$icon="success";
		try {
			$oFam = new temp_exp($this->db);
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
			$Exps = $this->getExp();
			echo json_encode(array('status'=>true, 'msgTitle'=>$msgTitle,'msgContent'=>$errMsg, 'icon'=>$icon, 'exps'=>$Exps));

		}
		die;
	}
	public function delete() {
		$tfid = $this->f3->GET('POST.temp_exp_id');

		$errMsg = 'Experience deleted successfully';
		$error = false;
		$msgTitle = "Success";
		$icon="success";
		try {
			$oFam = new temp_exp($this->db);
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
			$Exps = $this->getExp();
			echo json_encode(array('status'=>true, 'msgTitle'=>$msgTitle,'msgContent'=>$errMsg, 'exps'=>$Exps));

		}
		die;
	}

	public function display() {
		$params = $this->f3->GET('PARAMS');
		$tfid = $params['*'];
		$oFam = new temp_exp($this->db);
		$res = $oFam->search($tfid);
		echo json_encode(array('status'=>true, 'msgTitle'=>$msgTitle,'msgContent'=>$errMsg, 'exps'=>$res[0]));
		die;
	}

	public function getExp() {
		$empId = $this->f3->GET('SESSION.temp_id');

		$oExps = new temp_exp($this->db);
		$resExps = $oExps->findExpsByEmpID($empId); 

		$Exps = [];
		for($i=0;$i<count($resExps);$i++) {
			$action = '<div class="button-items">
			<button type="button" 
			data-id="'.$resExps[$i]['temp_exp_id'].'"
			class="btn btn-sm btnExperienceView">
				<i class="fas fa-search-plus font-size-12 align-top"></i></button>
			<button type="button" 
			data-id="'.$resExps[$i]['temp_exp_id'].'" 
			class="btn btn-sm btnExperienceEdit">
				<i class="fas fa-edit  font-size-12 align-top"></i></button>
			<button type="button" 
			data-id="'.$resExps[$i]['temp_exp_id'].'"
			class="btn btn-sm btnExperienceDelete">
				<i class="fas fa-eraser font-size-12 align-top"></i></button>
		</div>';
			$job = $resExps[$i]['temp_exp_position'] . '<br>';
			$job .= $resExps[$i]['temp_exp_companyname'] . '<br>';
			$job .= $resExps[$i]['temp_exp_companyaddress'] . '<br>';
			$job .= 'From : '. $resExps[$i]['temp_exp_from'] . '  To : ' . $resExps[$i]['temp_exp_to'];
			$jdesc = nl2br($resExps[$i]['temp_exp_jobdesc']);

			$Exps[] = array(
				'temp_exp_id'=>$resExps[$i]['temp_exp_id'],
				'temp_exp_position'=>$job,
				'temp_exp_jobdesc'=>'<div class="text-wrap wrap-400">' . $jdesc .'</div>',
				'action'=>$action
			);
		}
		return $Exps;
	}
}