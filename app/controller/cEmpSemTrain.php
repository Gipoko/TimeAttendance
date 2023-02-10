<?php

class cEmpSemTrain extends cau {
	protected $f3;
	protected $db;

	public function list() {

		if($this->f3->VERB=='POST') {
			// var_dump($this->f3->GET('SESSION'));
			// die;
			$SemTrain= $this->getSemTraining();

			echo json_encode(array('SemTrain'=>$SemTrain));
			die;
		}
	}

	public function add() {

		$oTemp = new temp_semtrain($this->db);
		unset($_POST['temp_semtrain_id']);
		$this->f3->SET('POST.temp_id', $this->f3->GET('SESSION.temp_id'));

		$errMsg = 'Seminar/Training/Workshop Added successfully';
		$msgTitle = "Success";
		$icon = "success";
		$error = false;
		try {
			$lastId = $oTemp->add($this->f3->GET('POST'));
		} catch (PDOException $e) {
			$errMsg = $e->getMessage();
			$msgTitle = "Error";
			$error = true;
			$icon = "error";
		}

		if ($error) {
			echo json_encode(array('status'=>false, 'msg'=>$errMsg, 'title'=>'Message', 'icon'=>$icon));

		} else {
			$SemTrain = $this->getSemTraining();
			echo json_encode(array('status'=>true, 'msgTitle'=>$msgTitle,'msgContent'=>$errMsg, 'icon'=>$icon, 'Semtrain'=>$SemTrain));
		}
		die;
	}

	public function edit() {
		$oTemp = new temp_semtrain($this->db);
		$this->f3->SET('POST.temp_id', $this->f3->GET('SESSION.temp_id'));

		$errMsg = 'Seminar/Training/Workshop updated successfully';
		$msgTitle = "Success";
		$icon = "success";
		$error = false;
		try {
			$lastId = $oTemp->edit($this->f3->GET('POST.temp_semtrain_id'),$this->f3->GET('POST'));
		} catch (PDOException $e) {
			$errMsg = $e->getMessage();
			$msgTitle = "Error";
			$error = true;
			$icon = "error";
		}

		if ($error) {
			echo json_encode(array('status'=>false, 'msg'=>$errMsg, 'title'=>'Message', 'icon'=>$icon));

		} else {
			$SemTrain = $this->getSemTraining();
			echo json_encode(array('status'=>true, 'msgTitle'=>$msgTitle,'msgContent'=>$errMsg, 'icon'=>$icon, 'Semtrain'=>$SemTrain));
		}
		die;
	}

	public function delete() {
		$oTemp = new temp_semtrain($this->db);
		$this->f3->SET('POST.temp_id', $this->f3->GET('SESSION.temp_id'));

		$errMsg = 'Seminar/Training/Workshop Deleted successfully';
		$msgTitle = "Success";
		$icon = "success";
		$error = false;
		try {
			$lastId = $oTemp->delete($this->f3->GET('POST.temp_semtrain_id'));
		} catch (PDOException $e) {
			$errMsg = $e->getMessage();
			$msgTitle = "Error";
			$error = true;
			$icon = "error";
		}

		if ($error) {
			echo json_encode(array('status'=>false, 'msg'=>$errMsg, 'title'=>'Message', 'icon'=>$icon));

		} else {
			$SemTrain = $this->getSemTraining();
			echo json_encode(array('status'=>true, 'msgTitle'=>$msgTitle,'msgContent'=>$errMsg, 'icon'=>$icon, 'Semtrain'=>$SemTrain));
		}
		die;
	}

	public function display() {
		$params = $this->f3->GET('PARAMS');
		$tfid = $params['*'];
		$oFam = new temp_semtrain($this->db);
		$res = $oFam->findASemTraining($tfid);
		echo json_encode(array('status'=>true, 'msgTitle'=>$msgTitle,'msgContent'=>$errMsg, 'Semtrain'=>$res[0]));
		die;
	}

	public function findByHashCode() {
		$hashCode = $this->f3->GET('POST.hashcode');
		$oTemp = new temp($this->db);
		$res = $oTemp->findByHashCode($hashCode);
		echo json_encode($res);
		die;
	}

	public function seek() {
		$param = $this->f3->GET('PARAMS');
		$id = $param['s'];
		$oCertLic = new temp_semtrain($this->db);
		$resSemTrain = $oCertLic->findASemTraining($id);
		echo json_encode(array('semTrainDetails'=>$resSemTrain[0]));
		die;
	}
	public function getSemTraining() {

		$empId = $this->f3->GET('SESSION.temp_id');
		$oCertLic = new temp_semtrain($this->db);
		$resSemTraining = $oCertLic->findSemTrainingByEmpID($empId);

		$CertLics = [];
		for($i=0;$i<count($resSemTraining);$i++) {
			$action = '<div class="button-items">
			<button type="button" 
			data-id="'.$resSemTraining[$i]['temp_semtrain_id'].'"
			class="btn btnSemTrainView">
				<i class="fas fa-search-plus font-size-12 align-middle"></i></button>
			<button type="button" 
			data-id="'.$resSemTraining[$i]['temp_semtrain_id'].'" 
			class="btn btnSemTrainEdit">
				<i class="fas fa-edit  font-size-2 align-middle"></i></button>
			<button type="button" 
			data-id="'.$resSemTraining[$i]['temp_semtrain_id'].'"
			class="btn btnSemTrainDelete">
				<i class="fas fa-eraser font-size-12 align-middle"></i></button>
		</div>';

			$event = '<div class="text-wrap wrap-300">';
			$event .= '<strong>' . $resSemTraining[$i]['temp_semtrain_eventname'] . '</strong>';
			$event .= '<br>' .$resSemTraining[$i]['temp_semtrain_topic'];
			$event .= '</div>';
			$CertLics[] = array(
				'temp_semtrain_id'=>$resSemTraining[$i]['temp_semtrain_id'],
				'temp_semtrain_eventname'=>$event,
				'temp_semtrain_when'=>$resSemTraining[$i]['temp_semtrain_when'],
				'temp_semtrain_where'=>$resSemTraining[$i]['temp_semtrain_where'],
				'action'=>$action
			);
		}
		return $CertLics;
	}
}