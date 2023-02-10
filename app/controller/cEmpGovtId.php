<?php

class cEmpGovtId extends cau {
	protected $f3;
	protected $db;

	public function list() {

		if($this->f3->VERB=='POST') {
			// var_dump($this->f3->GET('SESSION'));
			// die;
			$GovtID= $this->getGovtID();

			echo json_encode(array('GovtID'=>$GovtID));
			die;
		}
	}

	public function add() {

		$oTemp = new temp_govtid($this->db);
		unset($_POST['temp_govtid_id']);
		$this->f3->SET('POST.temp_id', $this->f3->GET('SESSION.temp_id'));

		$errMsg = '';
		$error = false;
		try {
			if ($this->f3->GET('POST.temp_govtid_date_expire') =='') {
				$this->f3->SET('POST.temp_govtid_date_expire', NULL);
			}
			$lastId = $oTemp->add($this->f3->GET('POST'));
		} catch (PDOException $e) {
			$errMsg = $e->getMessage();
			$error = true;
		}

		if ($error) {
			echo json_encode(array('status'=>false, 'msg'=>$errMsg, 'title'=>'Message', 'icon'=>'error'));

		} else {
			$GovtID = $this->getGovtID();
			echo json_encode(array('status'=>true, 'msg'=>"New Government ID added successfully", 'title'=>'Message', 'icon'=>'success','GovtID'=>$GovtID));

		}
		die;
	}

	public function edit() {
		$oTemp = new temp_govtid($this->db);
		
		$this->f3->SET('POST.temp_id', $this->f3->GET('SESSION.temp_id'));

		$errMsg = '';
		$error = false;
		try {
			if ($this->f3->GET('POST.temp_govtid_date_expire') =='') {
				$this->f3->SET('POST.temp_govtid_date_expire', NULL);
			}
			$lastId = $oTemp->edit($this->f3->GET('POST.temp_govtid_id'),$this->f3->GET('POST'));
		} catch (PDOException $e) {
			$errMsg = $e->getMessage();
			$error = true;
		}

		if ($error) {
			echo json_encode(array('status'=>false, 'msg'=>$errMsg, 'title'=>'Message', 'icon'=>'error'));

		} else {
			$GovtID = $this->getGovtID();
			echo json_encode(array('status'=>true, 'msg'=>"Government ID updated successfully", 'title'=>'Message', 'icon'=>'success','GovtID'=>$GovtID));
		}
		die;
	}

	public function delete() {
		$oTemp = new temp_govtid($this->db);
		
		$this->f3->SET('POST.temp_id', $this->f3->GET('SESSION.temp_id'));

		$errMsg = '';
		$error = false;
		try {
			$lastId = $oTemp->delete($this->f3->GET('POST.temp_govtid_id'));
		} catch (PDOException $e) {
			$errMsg = $e->getMessage();
			$error = true;
		}

		if ($error) {
			echo json_encode(array('status'=>false, 'msg'=>$errMsg, 'title'=>'Message', 'icon'=>'error'));

		} else {
			$GovtID = $this->getGovtID();
			echo json_encode(array('status'=>true, 'msg'=>"Government ID deleted successfully", 'title'=>'Message', 'icon'=>'success','GovtID'=>$GovtID));
		}
		die;
	}

	public function display() {
		$params = $this->f3->GET('PARAMS');
		$tfid = $params['*'];
		$oFam = new temp_govtid($this->db);
		$res = $oFam->findAGovtID($tfid);
		echo json_encode(array('status'=>true, 'msgTitle'=>'','msgContent'=>'', 'GovtID'=>$res[0]));
		die;
	}

	public function getGovtID() {

		$empId = $this->f3->GET('SESSION.temp_id');
		$oGovtID = new temp_govtid($this->db);
		$resGovtID = $oGovtID->findGovtIDsByEmployeeID($empId);

		$aGovtID = [];
		for($i=0;$i<count($resGovtID);$i++) {
			$action = '<div class="button-items">
			<button type="button" 
			data-id="'.$resGovtID[$i]['temp_govtid_id'].'"
			class="btn btn-sm btnGovtIDView">
				<i class="fas fa-search-plus font-size-12 align-middle"></i></button>
			<button type="button" 
			data-id="'.$resGovtID[$i]['temp_govtid_id'].'" 
			class="btn btn-sm btnGovtIDEdit">
				<i class="fas fa-edit  font-size-12 align-middle"></i></button>
			<button type="button" 
			data-id="'.$resGovtID[$i]['temp_govtid_id'].'"
			class="btn btn-sm btnGovtIDDelete">
				<i class="fas fa-eraser font-size-12 align-middle"></i></button>
		</div>';

		$GovtIDDetails = "<div class='text-wrap width-150'>";
		$GovtIDDetails .= "<address>";
		$GovtIDDetails .= "	<strong>".$resGovtID[$i]['rgovtid_desc']. "</strong> <br>";
		$GovtIDDetails .= "		".$resGovtID[$i]['temp_govtid_place_issued'];
		$GovtIDDetails .= "	</address>";
		$GovtIDDetails .= "</div>";


			$aGovtID[] = array(
				'temp_govtid_id'=>$resGovtID[$i]['temp_govtid_id'],
				'temp_govtid_details'=>$GovtIDDetails,
				'temp_govtid_date_issued'=>$resGovtID[$i]['temp_govtid_date_issued'],
				'temp_govtid_date_expire'=>$resGovtID[$i]['temp_govtid_date_expire'],
				'action'=>$action
			);
		}
		return $aGovtID;
	}
}