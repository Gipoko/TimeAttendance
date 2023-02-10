<?php

class cGovtId extends cau {

	public function list() {

		$oGovt = new rGovernmentID($this->db);
		$resGovtID = $oGovt->list();

		$data = [];
		for($i=0;$i<count($resGovtID);$i++) {
			$data[] = array('id'=>$resGovtID[$i]['rgovtid_id'], 'text'=>$resGovtID[$i]['rgovtid_desc']);
		}
		echo json_encode($data);
		die;
	}


}