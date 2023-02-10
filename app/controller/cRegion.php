<?php

/*
*
* frontpage of main controller when user login
*/
class cRegion extends cau {

	public function list() {
		$oRegion = new refProfile();
		$resRegion = $oRegion->getRegion();
		$data = [];
		for($i=0;$i<count($resRegion);$i++) {
			$data[] = array('id'=>$resRegion[$i]['regcode'], 'text'=>$resRegion[$i]['regdesc']);
		}

		echo json_encode($data);
		die;
	}
}