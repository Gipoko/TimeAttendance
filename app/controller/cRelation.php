<?php

/*
*
* frontpage of main controller when user login
*/
class cRelation extends cau {

	public function list() { 
		$params = $this->f3->GET('PARAMS');
		
		$oRelation = new rrelation($this->db);
		$resRelation = $oRelation->list($params['arg']);
		$data = [];
		for($i=0;$i<count($resRelation);$i++) {
			$data[] = array('id'=>$resRelation[$i]['rrelation_id'], 'text'=>$resRelation[$i]['rrelation_desc']);
		}
		echo json_encode($data);
		die;
	}
}