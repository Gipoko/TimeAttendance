<?php

/*
*
* frontpage of main controller when user login
*/
class cSuffix extends cau {

	public function list() {
		$oRefSuf = new refProfile();
		$resSuffix = $oRefSuf->getSuffix();

		$data = [];
		for($i=0;$i<count($resSuffix);$i++) {
			$data[] = array('id'=>$resSuffix[$i]['temp_suffice'], 'text'=>$resSuffix[$i]['temp_suffice']);
		}
		echo json_encode($data);
		die;
	}
}