<?php

/*
*
* frontpage of main controller when user login
*/
class cEduc extends cau {

	public function list() {
		$oEdu = new redu($this->db);
		$resEdu = $oEdu->list();
		$data = [];
		for($i=0;$i<count($resEdu);$i++) {
			$data[] = array('id'=>$resEdu[$i]['redu_id'], 'text'=>$resEdu[$i]['redu_desc']);
		}

		echo json_encode($data);
		die;
	}
}