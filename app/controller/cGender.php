<?php

/*
*
* frontpage of main controller when user login
*/
class cGender extends cau {

	public function list() {
		$oRefNum = new refProfile();
		$resGender = $oRefNum->getGender();

		$data = [];
		for($i=0;$i<count($resGender);$i++) {
			$data[] = array('id'=>$resGender[$i]['temp_gender'], 'text'=>$resGender[$i]['temp_gender']);
		}
		echo json_encode($data);
		die;
	}
}