<?php

/*
*
* frontpage of main controller when user login
*/
class cCityMun extends cau {

	public function list() {

		$postedProvCode = $this->f3->GET('POST.provcode');
		$oProv = new refProfile();
		$resCityMun = $oProv->getCityMunByProvCode($postedProvCode);
		$data = [];
		for($i=0;$i<count($resCityMun);$i++) {
			$data[] = array('id'=>$resCityMun[$i]['citymuncode'], 'text'=>$resCityMun[$i]['citymundesc']);
		}

		echo json_encode($data);
		die;
	}

	public function getAllCityMun() {
		$oProv = new refProfile();
		$resCityMun = $oProv->getAllCityMun();
		$data = [];
		for($i=0;$i<count($resCityMun);$i++) {
			$data[] = array('id'=>$resCityMun[$i]['citymuncode'], 'text'=>$resCityMun[$i]['citymundesc'], 'provcode'=>$resCityMun[$i]['provcode']);
		}

		echo json_encode($data);
		die;
	}
}