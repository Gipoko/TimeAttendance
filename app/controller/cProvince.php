<?php

/*
*
* frontpage of main controller when user login
*/
class cProvince extends cau {

	public function list() {

		$postRegCode = $this->f3->GET('POST.regcode');

		$oRegion = new refProfile();
		$resProvince = $oRegion->getProvinceByRegionCode($postRegCode);
		$data = [];
		for($i=0;$i<count($resProvince);$i++) {
			$data[] = array('id'=>$resProvince[$i]['provcode'], 'text'=>$resProvince[$i]['provdesc']);
		}

		echo json_encode($data);
		die;
	}

	public function getAllProvinces() {
		$oRegion = new refProfile();
		$resProvince = $oRegion->getAllProvinces();
		$data = [];
		for($i=0;$i<count($resProvince);$i++) {
			$data[] = array('id'=>$resProvince[$i]['provcode'], 'text'=>$resProvince[$i]['provdesc'], 'regcode'=>$resProvince[$i]['regcode']);
		}

		echo json_encode($data);
		die;
	}
}