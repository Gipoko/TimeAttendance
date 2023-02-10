<?php

/*
*
* frontpage of main controller when user login
*/
class cBloodType extends cau {

	public function list() {
		$oRefNum = new refProfile();
		$resBloodType = $oRefNum->getBloodType();

		$data = [];
		for($i=0;$i<count($resBloodType);$i++) {
			$data[] = array('id'=>$resBloodType[$i]['temp_blood'], 'text'=>$resBloodType[$i]['temp_blood']);
		}
		echo json_encode($data);
		die;
	}
}