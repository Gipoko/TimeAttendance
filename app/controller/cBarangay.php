<?php

/*
*
* frontpage of main controller when user login
*/
class cBarangay extends cau {

	public function list() {

		$postedCityMunCode = $this->f3->GET('POST.citymuncode');
		$oCity = new refProfile();
		$resBrgy = $oCity->getBrgyByCityMunCode($postedCityMunCode);
		$data = [];
		for($i=0;$i<count($resBrgy);$i++) {
			$data[] = array('id'=>$resBrgy[$i]['brgycode'], 'text'=>$resBrgy[$i]['brgydesc']);
		}

		echo json_encode($data);
		die;
	}

	public function getAllBarangays() {

		$oCity = new refProfile();
		$resBrgy = $oCity->getAllBarangays();
		$data = [];
		for($i=0;$i<count($resBrgy);$i++) {
			$data[] = array('id'=>$resBrgy[$i]['brgycode'], 'text'=>$resBrgy[$i]['brgydesc'], 'citymuncode'=>$resBrgy[$i]['citymuncode']);
		}

		echo json_encode($data);
		die;
	}
}