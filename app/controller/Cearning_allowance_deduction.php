<?php

class Cearning_allowance_deduction extends cau {

	public function earning_allowance_deduction(){

		if($this->f3->VERB=='GET') {
			$oUserMenu = new menu_skote();
			$menu = $oUserMenu->loadMenu();

			$temp_id = $this->f3->GET('SESSION.temp_id');
			

			$this->f3->SET('temp', $temp);
			$this->f3->SET('sidebar', $menu);
			$this->f3->set('content','/page/hr/details/earning_allowance_deduction/earning_allowance_deduction.html');
			$this->f3->set('layout','/page/layout.html');
           
		}

  }
	

    // allowance
public function getAList($temp_id) {

	$oAllowance = new temp_allowance($this->db);
	$resallowances = $oAllowance->list($temp_id);

	$aallowances = [];
	for($i=0;$i<count($resallowances);$i++) {
		$total = $resallowances[$i]['rallowance_default_amt'] - $resallowances[$i]['rallowance_addtotal'] ;
	$aallowances[] = array(
			
			'rallowance_code'=>$resallowances[$i]['rallowance_code'],
			'rallowance_default_amt'=>$resallowances[$i]['rallowance_default_amt'],
			'rallowance_percentage_tax'=>$resallowances[$i]['rallowance_percentage_tax'],
			'rallowance_taxtotal'=>$resallowances[$i]['rallowance_taxtotal'],
			'rallowance_additional'=>$resallowances[$i]['rallowance_additional'],
			'rallowance_addtotal'=>$resallowances[$i]['rallowance_addtotal'],
			'total'=>$total
			
		);
	}
	return $aallowances;
}
public function getAllowanceList() {
	$temp_id = $temp_id;
	$result = $this->getAList($temp_id);
	echo json_encode(array('allowances'=>$result));
	die;
}

//other earnings
public function getEList($temp_id) {

	$oEarning = new temp_earning($this->db);
	$researnings = $oEarning->list($temp_id);

	$aearnings = [];
	for($i=0;$i<count($researnings);$i++) {
		$total = $researnings[$i]['rearning_default_amt'] - $researnings[$i]['rearning_addtotal'] ;
	$aearnings[] = array(
			
			'rearning_code'=>$researnings[$i]['rearning_code'],
			'rearning_default_amt'=>$researnings[$i]['rearning_default_amt'],
			'rearning_percentage_tax'=>$researnings[$i]['rearning_percentage_tax'],
			'rearning_taxtotal'=>$researnings[$i]['rearning_taxtotal'],
			'rearning_additional'=>$researnings[$i]['rearning_additional'],
			'rearning_addtotal'=>$researnings[$i]['rearning_addtotal'],
		
			'total'=>$total
		);
	}
	return $aearnings;
}
public function getEarningList($temp_id) {
	$temp_id = $temp_id;
	$result = $this->getEList($temp_id);
	echo json_encode(array('earnings'=>$result));
	die;
}

//deduction
public function getDList($temp_id) {

	$oDeduction = new temp_deduction($this->db);
	$resdeductions = $oDeduction->list($temp_id);

	$adeductions = [];
	for($i=0;$i<count($resdeductions);$i++) {
		$total = $resdeductions[$i]['rdeduction_default_amt'] - $resdeductions[$i]['rdeduction_addtotal'] ;
	$adeductions[] = array(
			
			'rdeduction_code'=>$resdeductions[$i]['rdeduction_code'],
			'rdeduction_default_amt'=>$resdeductions[$i]['rdeduction_default_amt'],
			'rdeduction_percentage_tax'=>$resdeductions[$i]['rdeduction_percentage_tax'],
			'rdeduction_taxtotal'=>$resdeductions[$i]['rdeduction_taxtotal'],
			'rdeduction_additional'=>$resdeductions[$i]['rdeduction_additional'],
			'rdeduction_addtotal'=>$resdeductions[$i]['rdeduction_addtotal'],
			'total'=>$total
		);
	}
	return $adeductions;
}
public function getDeductionList($temp_id) {
	$temp_id = $temp_id;
	$result = $this->getDList($temp_id);
	echo json_encode(array('deductions'=>$result));
	die;
}


    public function getDetailsAllowanceEarningsDeductions($temp_id) {
        $tempId = $this->f3->GET('SESSION.temp_id');

        $arData=[];
    
        $Attendance = new rAttendance($this->db);
        $resAttendance = $Attendance->getAttendance($tempId);
        $arData[]= array('totalAttendance'=>$resAttendance[0]['totalAttendance']);
    
        $oTempWork = new temp_work($this->db);
        $resTempWork = $oTempWork->getWorkByTempID($tempId);
        $arData[]= array('employeeWork'=>$resTempWork);
    
        $resAllowances = $this->getAList($tempId);
        $arData[]= array('allowances'=>$resAllowances);
    
        $resEarnings = $this->getEList($tempId);
        $arData[]= array('earnings'=>$resEarnings);	
    
        $resDeductions = $this->getDList($tempId);
        $arData[]= array('deductions'=>$resDeductions);
    
        $arData[]= array('id'=>$tempId );

        echo json_encode($arData);
        
        die;
    }
}