<?php

/*
*
* frontpage of main controller when user login
*/
class cEmploymentType extends cau {

	public function list() {
		$oEmpType = new rEmploymentType($this->db);
		$resEmpType = $oEmpType->list();
		$data = [];
		for($i=0;$i<count($resEmpType);$i++) {
			$data[] = array('id'=>$resEmpType[$i]['remployment_type_id'], 'text'=>$resEmpType[$i]['remployment_type_desc']);
		}

		echo json_encode($data);
		die;
	}
}