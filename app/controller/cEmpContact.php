<?php
/*
*
*
*/
class cEmpContact extends cau { 

	public function list() {

		if($this->f3->VERB=='POST') {
			$contacts= $this->getContacts();
			echo json_encode(array('contacts'=>$contacts));
			die;
		}
		die;
	}



	public function add() {

		$oTemp = new temp_contact($this->db);
		unset($_POST['temp_contact_id']);
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
			$contacts = $this->getContacts();
			echo json_encode(array('status'=>true, 'msgTitle'=>$msgTitle,'msgContent'=>$errMsg, 'icon'=>$icon, 'contacts'=>$contacts));

		}
		die;
	}

	public function edit() {
		$tfid = $this->f3->GET('POST.temp_contact_id');

		$errMsg = 'Contact updated successfully';
		$error = false;
		$msgTitle = "Success";
		$icon="success";
		try {
			$oFam = new temp_contact($this->db);
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
			$contacts = $this->getContacts();
			echo json_encode(array('status'=>true, 'msgTitle'=>$msgTitle,'msgContent'=>$errMsg, 'icon'=>$icon, 'contacts'=>$contacts));

		}
		die;
	}
	public function delete() {
		$tfid = $this->f3->GET('POST.temp_contact_id');

		$errMsg = 'Contact deleted successfully';
		$error = false;
		$msgTitle = "Success";
		$icon="success";
		try {
			$oFam = new temp_contact($this->db);
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
			$contacts = $this->getContacts();
			echo json_encode(array('status'=>true, 'msgTitle'=>$msgTitle,'msgContent'=>$errMsg, 'contacts'=>$contacts));

		}
		die;
	}

	public function display() {
		$params = $this->f3->GET('PARAMS');
		$tfid = $params['*'];
		$oFam = new temp_contact($this->db);
		$res = $oFam->search($tfid);
		echo json_encode(array('status'=>true, 'msgTitle'=>$msgTitle,'msgContent'=>$errMsg, 'contacts'=>$res[0]));
		die;
	}

	public function getContacts() {
		$empId = $this->f3->GET('SESSION.temp_id');

		$oContacts = new temp_contact($this->db);
		$rescontacts = $oContacts->findContactsByEmpID($empId);

		$contacts = [];
		for($i=0;$i<count($rescontacts);$i++) {
			$action = '<div class="button-items">
			<button type="button" 
			data-id="'.$rescontacts[$i]['temp_contact_id'].'"
			class="btn btn-sm btnContactPersonView">
				<i class="fas fa-search-plus font-size-12 align-top"></i></button>
			<button type="button" 
			data-id="'.$rescontacts[$i]['temp_contact_id'].'" 
			class="btn btn-sm btnContactPersonEdit">
				<i class="fas fa-edit  font-size-12 align-top"></i></button>
			<button type="button" 
			data-id="'.$rescontacts[$i]['temp_contact_id'].'"
			class="btn btn-sm btnContactPersonDelete">
				<i class="fas fa-eraser font-size-12 align-top"></i></button>
		</div>';

			$contacts[] = array(
				'temp_contact_id'=>$rescontacts[$i]['temp_contact_id'],
				'fullName'=>$rescontacts[$i]['fullName'],
				'temp_contact_mobile'=>$rescontacts[$i]['temp_contact_mobile'],
				'rrelation_desc'=>$rescontacts[$i]['rrelation_desc'],
				'action'=>$action
			);
		}
		return $contacts;
	}
}