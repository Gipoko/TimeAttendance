<?php

class cmd extends cbase {


	public function action() {

		$aroutes = explode('/',$this->f3->get('PARAMS')[0]);
		unset($aroutes[0]);
		unset($aroutes[1]);
		$aCmd = array_values($aroutes);
		$fakeController = $aCmd[0];
		$method = $aCmd[1];

		$controller = '';
		$aroutes = ['user'=>'csms', 'employee'=>'chr', 'ref'=>'cRefProfile'];
		foreach($aroutes as $key=>$val) {
			if ($key === $fakeController) {
				$controller = $val;
				break;
			}
		}

		$aClass = [];
		$aClass['csms'] = array("login", "resetpw", "register", "activate", "deactivate", "wipe", "search", "list", "changeUsername");
		$aClass['chr'] = array('list');
		$aClass['cemp'] = array("add", "resetpw");
		$aClass['cRefProfile'] = array('getTitles', 'getSuffix', 'getBloodType', 'getGender', 'getMarital', 'getCountry', 'getReligion', 
									   'getRegion', 'getProvinceByRegionCode', 'getCityMunByProvCode', 'getBank');

		//find the method
		foreach($aClass as $key => $val) {
			if ($key == $controller) {
				foreach($val as $subKey => $subVal) {
					if ($subVal == $method) {
						break;
					}
				}
			}


			if ($method != "") {
				break;
			}
		}

		// var_dump($controller, $method);
		// die;

		$oController = new $controller();	//convert variable to class
		$args=array();
		$aMsg=call_user_func_array(array($oController, $method), $args);

		echo json_encode($aMsg);
		die;
	}

}