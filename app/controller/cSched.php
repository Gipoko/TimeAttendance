<?php

/*
*
* frontpage of main controller when user login
*/
class cSched extends cau {
	public function list() {
		$oSched = new refProfile();
		$resSched = $oSched->getSched();
		$data = [];
		for($i=0;$i<count($resSched);$i++) {
			$data[] = array('id'=>$resSched[$i]['rsched_name'], 'text'=>$resSched[$i]['rsched_name']);
		}
echo json_encode($data);
		die;
	}
	}