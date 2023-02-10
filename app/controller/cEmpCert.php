<?php

class cEmpCert extends cau {
	protected $f3;
	protected $db;

	public function list() {

		if($this->f3->VERB=='POST') {
			// var_dump($this->f3->GET('SESSION'));
			// die;
			$CertLics= $this->getCertLic();

			echo json_encode(array('CertLics'=>$CertLics));
			die;
		}
	}

	public function add() {

		$oTemp = new temp_cert($this->db);
		unset($_POST['temp_cert_id']);
		$this->f3->SET('POST.temp_id', $this->f3->GET('SESSION.temp_id'));

		$errMsg = 'Certificate Added successfully';
		$error = false;
		try {
			$lastId = $oTemp->add($this->f3->GET('POST'));
		} catch (PDOException $e) {
			$errMsg = $e->getMessage();
			$error = true;
		}

		if ($error) {
			echo json_encode(array('status'=>true, 'msgTitle'=>$msgTitle,'msgContent'=>$errMsg, 'icon'=>'error'));

		} else {
			$CertLics = $this->getCertLic();
			echo json_encode(array('status'=>true, 'msgTitle'=>$msgTitle,'msgContent'=>$errMsg, 'icon'=>'success','CertLics'=>$CertLics));
		}
		die;
	}

	public function edit() {
		$oTemp = new temp_cert($this->db);
		
		$this->f3->SET('POST.temp_id', $this->f3->GET('SESSION.temp_id'));

		$errMsg = 'Certificate updated successfully';
		$error = false;
		try {
			$lastId = $oTemp->edit($this->f3->GET('POST.temp_cert_id'),$this->f3->GET('POST'));
		} catch (PDOException $e) {
			$errMsg = $e->getMessage();
			$error = true;
		}

		if ($error) {
			echo json_encode(array('status'=>false, 'msgTitle'=>$msgTitle,'msgContent'=>$errMsg, 'icon'=>'error'));

		} else {
			$CertLics = $this->getCertLic();
			echo json_encode(array('status'=>true, 'msgTitle'=>$msgTitle,'msgContent'=>$errMsg, 'icon'=>'success','CertLics'=>$CertLics));
		}
		die;
	}

	public function delete() {
		$param = $this->f3->GET('PARAMS');
		$id = $param['s'];
		$oTemp = new temp_cert($this->db);
		
		$this->f3->SET('POST.temp_id', $this->f3->GET('SESSION.temp_id'));

		$errMsg = 'Certificate delete successfully';
		$error = false;
		try {
			$lastId = $oTemp->delete($this->f3->GET('POST.temp_cert_id'));
		} catch (PDOException $e) {
			$errMsg = $e->getMessage();
			$error = true;
		}

		if ($error) {
			echo json_encode(array('status'=>false, 'msgTitle'=>$msgTitle,'msgContent'=>$errMsg, 'icon'=>'error'));

		} else {
			$CertLics = $this->getCertLic();
			echo json_encode(array('status'=>true, 'msgTitle'=>$msgTitle,'msgContent'=>$errMsg, 'icon'=>'success','CertLics'=>$CertLics));
		}
		die;
	}

	public function display() {
		$params = $this->f3->GET('PARAMS');
		
		$tfid = $params['arg'];
		$oFam = new temp_cert($this->db);
		$res = $oFam->findCert($tfid);

		echo json_encode(array('status'=>true, 'msgTitle'=>'','msgContent'=>'', 'CertLics'=>$res[0]));
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
		$oCertLic = new temp_cert($this->db);
		$resCertLics = $oCertLic->findCert($id);
		echo json_encode(array('CertLicsDetails'=>$resCertLics[0]));
		die;
	}
	public function getCertLic() {

		$empId = $this->f3->GET('SESSION.temp_id');
		$oCertLic = new temp_cert($this->db);
		$resCertLics = $oCertLic->findemployeeCertLicByEmployeeID($empId);

		$CertLics = [];
		for($i=0;$i<count($resCertLics);$i++) {
			$action = '<div class="button-items">
			<button type="button" 
			data-id="'.$resCertLics[$i]['temp_cert_id'].'"
			class="btn btnCertLicView">
				<i class="fas fa-search-plus font-size-12 align-top"></i></button>
			<button type="button" 
			data-id="'.$resCertLics[$i]['temp_cert_id'].'" 
			class="btn btnCertLicEdit">
				<i class="fas fa-edit  font-size-12 align-top"></i></button>
			<button type="button" 
			data-id="'.$resCertLics[$i]['temp_cert_id'].'"
			class="btn btnCertLicDelete">
				<i class="fas fa-eraser font-size-12 align-top"></i></button>
		</div>';

		$CertLicDetails = "<div class='text-wrap width-150'>";
		$CertLicDetails .= "<address>";
		$CertLicDetails .= "	<strong>".$resCertLics[$i]['temp_cert_name']. "</strong> <br>";
		$CertLicDetails .= "		".$resCertLics[$i]['temp_cert_place_issued']. "<br>";
		$CertLicDetails .= "	</address>";
		$CertLicDetails .= "</div>";


			$CertLics[] = array(
				'temp_cert_id'=>$resCertLics[$i]['temp_cert_id'],
				'temp_certlic_details'=>$CertLicDetails,
				'temp_cert_date_issued'=>$resCertLics[$i]['temp_cert_date_issued'],
				'temp_cert_date_expire'=>$resCertLics[$i]['temp_cert_date_expire'],
				'action'=>$action
			);
		}
		return $CertLics;
	}
}