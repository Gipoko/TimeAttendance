<?php

/*
*/

class cRefProfile extends cau {

	public function getRefProfile() {

		$oRefProfile = new refProfile();
		$refBanks = $oRefProfile->getBanks();
		$refTitles = $oRefProfile->getTitles();
		$refReligions = $oRefProfile->getReligions();


		echo json_encode(array(
			'banks'=>$refBanks,
			'titles'=>$refTitles,
			'religions'=>$refReligions
		));
		die;
	}

	public function getTitles() {
		$oTitles = new refProfile();
		$resTitle = $oTitles->getTitles();

		$data = [];
		for($i=0;$i<count($resTitle);$i++) {
			$data[] = array('id'=>$resTitle[$i]['rtitle_id'], 'text'=>$resTitle[$i]['rtitle_desc']);
		}
		return array('items'=>$data);
	}

	public function getSuffix() {
		$oRefNum = new refProfile();
		$resSuffix = $oRefNum->getSuffix();

		$data = [];
		for($i=0;$i<count($resSuffix);$i++) {
			$data[] = array('id'=>$resSuffix[$i]['temp_suffice'], 'text'=>$resSuffix[$i]['temp_suffice']);
		}

		return array('items'=>$data);
	}

	public function getBloodType() {
		$oRefNum = new refProfile();
		$resBloodType = $oRefNum->getBloodType();

		$data = [];
		for($i=0;$i<count($resBloodType);$i++) {
			$data[] = array('id'=>$resBloodType[$i]['temp_blood'], 'text'=>$resBloodType[$i]['temp_blood']);
		}

		return array('items'=>$data);
	}

	public function getGender() {
		$oRefNum = new refProfile();
		$resGender = $oRefNum->getGender();

		$data = [];
		for($i=0;$i<count($resGender);$i++) {
			$data[] = array('id'=>$resGender[$i]['temp_gender'], 'text'=>$resGender[$i]['temp_gender']);
		}

		return array('items'=>$data);
	}

	public function getMarital() {
		$oRefNum = new refProfile();
		$resMarital = $oRefNum->getMarital();

		$data = [];
		for($i=0;$i<count($resMarital);$i++) {
			$data[] = array('id'=>$resMarital[$i]['temp_marital'], 'text'=>$resMarital[$i]['temp_marital']);
		}

		return array('items'=>$data);
	}

	public function getCountry() {
		$oCountry = new refProfile();
		$resCountry = $oCountry->getCountry();
		$data = [];
		for($i=0;$i<count($resCountry);$i++) {
			$data[] = array('rcountry_code'=>$resCountry[$i]['rcountry_code'], 'rcountry_name'=>$resCountry[$i]['rcountry_name']);
		}

		return array('items'=>$data);
	}

	public function getReligion() {
		$oCountry = new refProfile();
		$resReligion = $oCountry->getReligion();
		$data = [];
		for($i=0;$i<count($resReligion);$i++) {
			$data[] = array('rreligion_id'=>$resReligion[$i]['rreligion_id'], 'rreligion_desc'=>$resReligion[$i]['rreligion_desc']);
		}

		return array('items'=>$data);
	}


	public function getRegion() {
		$oRegion = new refProfile();
		$resRegion = $oRegion->getRegion();
		$data = [];
		for($i=0;$i<count($resRegion);$i++) {
			$data[] = array('regcode'=>$resRegion[$i]['regcode'], 'regdesc'=>$resRegion[$i]['regdesc']);
		}

		return array('items'=>$data);
	}

	public function getProvinceByRegionCode() {
		$postedRegCode = $this->f3->GET('POST.regcode');
		$oProv = new refProfile();
		$resProvs = $oProv->getProvinceByRegionCode($postedRegCode);
		$data = [];
		for($i=0;$i<count($resProvs);$i++) {
			$data[] = array('provcode'=>$resProvs[$i]['provcode'], 'provdesc'=>$resProvs[$i]['provdesc']);
		}
		return array('items'=>$data);
	}

	public function getCityMunByProvCode() {
		$postedProvCode = $this->f3->GET('POST.provcode');
		$oProv = new refProfile();
		$resCityMun = $oProv->getCityMunByProvCode($postedProvCode);
		$data = [];
		for($i=0;$i<count($resCityMun);$i++) {
			$data[] = array('citymuncode'=>$resCityMun[$i]['citymuncode'], 'citymundesc'=>$resCityMun[$i]['citymundesc']);
		}
		return array('items'=>$data);
	}

	public function getBrgyByCityMunCode() {
		$postedCityMunCode = $this->f3->GET('POST.citymuncode');
		$oCity = new refProfile();
		$resBrgy = $oCity->getBrgyByCityMunCode($postedCityMunCode);
		$data = [];
		for($i=0;$i<count($resBrgy);$i++) {
			$data[] = array('brgycode'=>$resBrgy[$i]['brgycode'], 'brgydesc'=>$resBrgy[$i]['brgydesc']);
		}
		return array('items'=>$data);
	}

	public function getBank() {
		$oBank = new refProfile();
		$resBank = $oBank->getBank();
		$data = [];
		for($i=0;$i<count($resBank);$i++) {
			$data[] = array('rbank_id'=>$resBank[$i]['rbank_id'], 'rbank_name'=>$resBank[$i]['rbank_name']);
		}
		return array('items'=>$data);
	}

	public function getSched() {
		$oSched = new refProfile();
		$resSched = $oSched->getSched();
		$data = [];
		for($i=0;$i<count($resSched);$i++) {
			$data[] = array('rsched_id'=>$resSched[$i]['rsched_id'], 'rshed_name'=>$resSched[$i]['rsched_name']);
		}
		return array('items'=>$data);
	}

}