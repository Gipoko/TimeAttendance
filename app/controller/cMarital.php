<?php

/*
*
* frontpage of main controller when user login
*/
class cMarital extends cau {

	public function list() {
		$oRefNum = new refProfile();
		$resMarital = $oRefNum->getMarital();

		$data = [];
		for($i=0;$i<count($resMarital);$i++) {
			$data[] = array('id'=>$resMarital[$i]['temp_marital'], 'text'=>$resMarital[$i]['temp_marital']);
		}		
		
		echo json_encode($data);
		die;
	}
}