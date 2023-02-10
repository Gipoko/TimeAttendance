<?php
class cgeneratepayroll extends cau{

public function index(){
    if($this->f3->VERB=='GET') {

			$YearMonth = new rAttendance($this->db);
			$this->f3->set('YearMonth', $YearMonth->getYearMonth());

            $oUserMenu = new menu_skote();
			$menu = $oUserMenu->loadMenu();

			$this->f3->SET('sidebar', $menu);
			if($this->f3->GET('SESSION.user_group_id') === 5)
			{
				 $this->f3->set('content','page/unauthorized.html');
				 $this->f3->set('layout','page/unauth.html');
			}else{
			$this->f3->set('content','/page/payroll/generate-payroll.html');
			$this->f3->set('layout','/page/layout.html');
			}
    }else {

	
	

		$draw = $this->f3->GET('POST.draw');
		$row = $this->f3->GET('POST.start');
		$rowperpage = $this->f3->GET('POST.length'); // Rows display per page

			$columnIndex = $this->f3->GET("POST.order[0]['column']"); // Column index
		//$columnIndex = $_POST['order'][0]['column']; // Column index
		//var_dump($columnIndex);
		$columnName = $this->f3->GET("POST.columns[$columnIndex]['data']"); // Column name


		$columnSortOrder = $this->f3->GET("POST.order[0]['dir']"); // asc or desc
		$searchValue = $this->f3->GET("POST.search['value']"); // Search value

		## Search
		$searchQuery = "";
		if($searchValue != ''){
			$searchQuery = " and (
				tmp.temp_first like '%".$searchValue."%' or
				rposition_desc like '%".$searchValue."%' or
				tmp.temp_mobile like '%".$searchValue."%' or
				tmp.temp_efn like '%".$searchValue."%' or
				rposition_desc like '%".$searchValue."%' or
				tmp.temp_last like '%".$searchValue."%'
									) ";
			}

		$oGeneratePayroll = new rgeneratepayroll($this->db);

		$result = $oGeneratePayroll->countRecords();

		$totalRecords = $result[0]['totalRecords'];

		if ($searchQuery !="") {
			$totalRecordWithFilter = $oGeneratePayroll->countRecordsWithFilter($searchQuery);
		}

		## Total number of record with filtering
		$oRecords = $oGeneratePayroll->countRecordsWithFilter($searchQuery);
		$totalRecordwithFilter = $oRecords[0]['totalFilteredRecords'];

		## Fetch records
		$oRecords = $oGeneratePayroll->getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage);

		$data = [];

		for($i=0;$i<count($oRecords);$i++) {
			$id = $oRecords[$i]['temp_id'];
			$bioId = $oRecords[$i]['temp_biometric_id'];
			$action =  '';

			$Name = $oRecords[$i]['temp_first'] . ' ' .$oRecords[$i]['temp_mid'].' '.$oRecords[$i]['lastSuffix'];
			

            $fullName = "<div class='text-wrap width-150'>".'<address>';
            $fullName .= $oRecords[$i]['temp_first'] . ' ' .$oRecords[$i]['temp_mid'].' '.$oRecords[$i]['lastSuffix'].'<br>';
            $fullName .= $oRecords[$i]['rposition_desc'].'<br>';
            $fullName .= '<span class="badge bg-success">'.$oRecords[$i]['temp_efn'].'</span>';
            $fullName .= '</address> </div>';

			$fileDetails = "<div class='text-wrap width-150'>".'<address>';
				$fileDetails .= $oRecords[$i]['remployment_type_desc'].'<br>';
				$fileDetails .= '</address> </div>';
				$emptype = $oRecords[$i]['remployment_type_desc'];
				
				$divDetails = "<div class='text-wrap width-150'>".'<address>';
				$divDetails .= $oRecords[$i]['rdivision_name']."<br><br>";
				$divDetails .= $oRecords[$i]['rdivision_sectionunit_name'];
				$divDetails .= "</address>";
            
				$action .= '<div class="btn-group">';
				$action .= '	<button type="button" class="btn btn-info dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">';
				$action .= '		<i class="dripicons-gear"></i>';
				$action .= '	</button>';
				$action .= '	<div class="dropdown-menu">';
				// $action .= '		<a class="dropdown-item btnPaySlip" href="#" data-id="'.$id.'">Pay Slip</a>';
				$action .= '		<a class="dropdown-item btnDtr" href="#" data-id="'.$bioId.'">DTR</a>';
				$action .= '	</div>';
				$action .= '</div>';
			
			$data[] = array(
				"emptype"=>$emptype,
				"bioId"=>$bioId,
				"Name"=>$Name,
                "fullName"=>$fullName,
				"fileDetails"=>$fileDetails,
				"divDetails"=>$divDetails,
				"action"=>$action
			);
		}

		## Response
		$response = array(
		"draw" => intval($draw),
		"iTotalRecords" => $totalRecords,
		"iTotalDisplayRecords" => $totalRecordwithFilter,
		"aaData" => $data
		);

		echo json_encode($response);
		die;
	}

}

// allowance
public function getAList($id) {

	$oAllowance = new temp_allowance($this->db);
	$resallowances = $oAllowance->list($id);

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
	$id = $this->f3->GET('POST.temp_id');
	$result = $this->getAList($id);
	echo json_encode(array('allowances'=>$result));
	die;
}

//other earnings
public function getEList($id) {

	$oEarning = new temp_earning($this->db);
	$researnings = $oEarning->list($id);

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
public function getEarningList($id) {
	$id = $this->f3->GET('POST.temp_id');
	$result = $this->getEList($id);
	echo json_encode(array('earnings'=>$result));
	die;
}

//deduction
public function getDList($id) {

	$oDeduction = new temp_deduction($this->db);
	$resdeductions = $oDeduction->list($id);

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
public function getDeductionList($id) {
	$id = $this->f3->GET('POST.temp_id');
	$result = $this->getDList($id);
	echo json_encode(array('deductions'=>$result));
	die;
}

public function getAttendance($tempId){
	$tempId = $this->f3->GET('POST.temp_id');
	$Attendance = new rAttendance($this->db);
	$resAttendance = $Attendance->getAttendance($tempId);
	$totalRecords = $resAttendance[0]['totalAttendance'];
	echo json_encode(array('totalAttendance'=>$totalRecords));
	die;
}

public function getDetailsAllowanceEarningsDeductions() {
	$tempId = $this->f3->GET('POST.temp_id');

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

	echo json_encode($arData);
	
	die;
}

public function getDtrKinsenas(){
	$bioId = $this->f3->GET('POST.bioid');
	$year = $this->f3->GET('POST.yearKin');
	$month = $this->f3->GET('POST.monthKin');
	$WorkHours = new rAttendance($this->db);
	$resWorkHours = $WorkHours->getDtrKinsenas($bioId,$year,$month);
	echo json_encode(array('WorkHours'=>$resWorkHours));
	die;
}

public function getDtrKatapusan(){
	$bioId = $this->f3->GET('POST.bioid');
	$year = $this->f3->GET('POST.yearKat');
	$month = $this->f3->GET('POST.monthKat');
	$WorkHours = new rAttendance($this->db);
	$resWorkHours = $WorkHours->getDtrKatapusan($bioId,$year,$month);
	echo json_encode(array('WorkHours'=>$resWorkHours));
	die;
}

public function getEmpDtr($year,$month,$bid){
	$bid = $this->f3->GET('POST.biid[id]');
	$year = $this->f3->GET('POST.year');
	$month = $this->f3->GET('POST.month');
	
	
	$EmpDtr = new rAttendance($this->db);
	$resEmpDtr = $EmpDtr->getEmpDtr($bid,$year,$month);

	for($i=0;$i<COUNT($resEmpDtr);$i++){
		$id = $resEmpDtr[$i]['temp_biorecord_id'];

		
		//Day 1
		$d1 = $resEmpDtr[$i]['d1'];
		$dx1 = explode(" ",$d1);
		$AmArr_d1 = $dx1[0];
		$AmDep_d1 = $dx1[1];
		$PmArr_d1 = $dx1[2];
		$PmDep_d1 = $dx1[3];

		$calc_d1 = $resEmpDtr[$i]['calc_d1'];
		$cd1 = explode(" ",$calc_d1);
		$Utime1 = $cd1[2];
		$cd1_Utime = explode(":",$Utime1);
		$d1_HUtime = $cd1_Utime[0];
		$d1_MUtime = $cd1_Utime[1];

		$HW1 = $cd1[2];
		$tHW1 = explode(":",$HW1);
		$cHWtime1 =$tHW1[0];
		$cMWtime1 =$tHW1[1];

		//Day 2
		$d2 = $resEmpDtr[$i]['d2'];
		$dx2 = explode(" ",$d2);
		$AmArr_d2 = $dx2[0];
		$AmDep_d2 = $dx2[1];
		$PmArr_d2 = $dx2[2];
		$PmDep_d2 = $dx2[3];

		$calc_d2 = $resEmpDtr[$i]['calc_d2'];
		$cd2 = explode(" ",$calc_d2);
		$Utime2 = $cd2[2];
		$cd2_Utime = explode(":",$Utime2);
		$d2_HUtime = $cd2_Utime[0];
		$d2_MUtime = $cd2_Utime[1];

		$HW2 = $cd2[2];
		$tHW2 = explode(":",$HW2);
		$cHWtime2 =$tHW2[0];
		$cMWtime2 =$tHW2[1];

		//Day 3
		$d3 = $resEmpDtr[$i]['d3'];
		$dx3 = explode(" ",$d3);
		$AmArr_d3 = $dx3[0];
		$AmDep_d3 = $dx3[1];
		$PmArr_d3 = $dx3[2];
		$PmDep_d3 = $dx3[3];

		$calc_d3 = $resEmpDtr[$i]['calc_d3'];
		$cd3 = explode(" ",$calc_d3);
		$Utime3 = $cd3[2];
		$cd3_Utime = explode(":",$Utime3);
		$d3_HUtime = $cd3_Utime[0];
		$d3_MUtime = $cd3_Utime[1];

		$HW3 = $cd3[2];
		$tHW3 = explode(":",$HW3);
		$cHWtime3 =$tHW3[0];
		$cMWtime3 =$tHW3[1];

		//Day 4
		$d4 = $resEmpDtr[$i]['d4'];
		$dx4 = explode(" ",$d4);
		$AmArr_d4 = $dx4[0];
		$AmDep_d4 = $dx4[1];
		$PmArr_d4 = $dx4[2];
		$PmDep_d4 = $dx4[3];

		$calc_d4 = $resEmpDtr[$i]['calc_d4'];
		$cd4 = explode(" ",$calc_d4);
		$Utime4 = $cd4[2];
		$cd4_Utime = explode(":",$Utime4);
		$d4_HUtime = $cd4_Utime[0];
		$d4_MUtime = $cd4_Utime[1];

		$HW4 = $cd4[2];
		$tHW4 = explode(":",$HW4);
		$cHWtime4 =$tHW4[0];
		$cMWtime4 =$tHW4[1];

		//Day 5
		$d5 = $resEmpDtr[$i]['d5'];
		$dx5 = explode(" ",$d5);
		$AmArr_d5 = $dx5[0];
		$AmDep_d5 = $dx5[1];
		$PmArr_d5 = $dx5[2];
		$PmDep_d5 = $dx5[3];

		$calc_d5 = $resEmpDtr[$i]['calc_d5'];
		$cd5 = explode(" ",$calc_d5);
		$Utime5 = $cd5[2];
		$cd5_Utime = explode(":",$Utime5);
		$d5_HUtime = $cd5_Utime[0];
		$d5_MUtime = $cd5_Utime[1];

		$HW5 = $cd5[2];
		$tHW5 = explode(":",$HW5);
		$cHWtime5 =$tHW5[0];
		$cMWtime5 =$tHW5[1];

		//Day 6
		$d6 = $resEmpDtr[$i]['d6'];
		$dx6 = explode(" ",$d6);
		$AmArr_d6 = $dx6[0];
		$AmDep_d6 = $dx6[1];
		$PmArr_d6 = $dx6[2];
		$PmDep_d6 = $dx6[3];

		$calc_d6 = $resEmpDtr[$i]['calc_d6'];
		$cd6 = explode(" ",$calc_d6);
		$Utime6 = $cd6[2];
		$cd6_Utime = explode(":",$Utime6);
		$d6_HUtime = $cd6_Utime[0];
		$d6_MUtime = $cd6_Utime[1];

		$HW6 = $cd6[2];
		$tHW6 = explode(":",$HW6);
		$cHWtime6 =$tHW6[0];
		$cMWtime6 =$tHW6[1];

		//Day 7
		$d7 = $resEmpDtr[$i]['d7'];
		$dx7 = explode(" ",$d7);
		$AmArr_d7 = $dx7[0];
		$AmDep_d7 = $dx7[1];
		$PmArr_d7 = $dx7[2];
		$PmDep_d7 = $dx7[3];

		$calc_d7 = $resEmpDtr[$i]['calc_d7'];
		$cd7 = explode(" ",$calc_d7);
		$Utime7 = $cd7[2];
		$cd7_Utime = explode(":",$Utime7);
		$d7_HUtime = $cd7_Utime[0];
		$d7_MUtime = $cd7_Utime[1];

		$HW7 = $cd7[2];
		$tHW7 = explode(":",$HW7);
		$cHWtime7 =$tHW7[0];
		$cMWtime7 =$tHW7[1];

		//Day 8
		$d8 = $resEmpDtr[$i]['d8'];
		$dx8 = explode(" ",$d8);
		$AmArr_d8 = $dx8[0];
		$AmDep_d8 = $dx8[1];
		$PmArr_d8 = $dx8[2];
		$PmDep_d8 = $dx8[3];

		$calc_d8 = $resEmpDtr[$i]['calc_d8'];
		$cd8 = explode(" ",$calc_d8);
		$Utime8 = $cd8[2];
		$cd8_Utime = explode(":",$Utime8);
		$d8_HUtime = $cd8_Utime[0];
		$d8_MUtime = $cd8_Utime[1];

		$HW8 = $cd8[2];
		$tHW8 = explode(":",$HW8);
		$cHWtime8 =$tHW8[0];
		$cMWtime8 =$tHW8[1];

		//Day 9
		$d9 = $resEmpDtr[$i]['d9'];
		$dx9 = explode(" ",$d9);
		$AmArr_d9 = $dx9[0];
		$AmDep_d9 = $dx9[1];
		$PmArr_d9 = $dx9[2];
		$PmDep_d9 = $dx9[3];

		$calc_d9 = $resEmpDtr[$i]['calc_d9'];
		$cd9 = explode(" ",$calc_d9);
		$Utime9 = $cd9[2];
		$cd9_Utime = explode(":",$Utime9);
		$d9_HUtime = $cd9_Utime[0];
		$d9_MUtime = $cd9_Utime[1];

		$HW9 = $cd9[2];
		$tHW9 = explode(":",$HW9);
		$cHWtime9 =$tHW9[0];
		$cMWtime9 =$tHW9[1];

		//Day 10
		$d10 = $resEmpDtr[$i]['d10'];
		$dx10 = explode(" ",$d10);
		$AmArr_d10 = $dx10[0];
		$AmDep_d10 = $dx10[1];
		$PmArr_d10 = $dx10[2];
		$PmDep_d10 = $dx10[3];

		$calc_d10 = $resEmpDtr[$i]['calc_d10'];
		$cd10 = explode(" ",$calc_d10);
		$Utime10 = $cd10[2];
		$cd10_Utime = explode(":",$Utime10);
		$d10_HUtime = $cd10_Utime[0];
		$d10_MUtime = $cd10_Utime[1];

		$HW10 = $cd10[2];
		$tHW10 = explode(":",$HW10);
		$cHWtime10 =$tHW10[0];
		$cMWtime10 =$tHW10[1];

		// Day 11
		$d11 = $resEmpDtr[$i]['d11'];
		$dx11 = explode(" ",$d11);
		$AmArr_d11 = $dx11[0];
		$AmDep_d11 = $dx11[1];
		$PmArr_d11 = $dx11[2];
		$PmDep_d11 = $dx11[3];

		$calc_d11 = $resEmpDtr[$i]['calc_d11'];
		$cd11 = explode(" ",$calc_d11);
		$Utime11 = $cd11[2];
		$cd11_Utime = explode(":",$Utime11);
		$d11_HUtime = $cd11_Utime[0];
		$d11_MUtime = $cd11_Utime[1];

		$HW11 = $cd11[2];
		$tHW11 = explode(":",$HW11);
		$cHWtime11 =$tHW11[0];
		$cMWtime11 =$tHW11[1];

		//Day 12
		$d12 = $resEmpDtr[$i]['d12'];
		$dx12 = explode(" ",$d12);
		$AmArr_d12 = $dx12[0];
		$AmDep_d12 = $dx12[1];
		$PmArr_d12 = $dx12[2];
		$PmDep_d12 = $dx12[3];

		$calc_d12 = $resEmpDtr[$i]['calc_d12'];
		$cd12 = explode(" ",$calc_d12);
		$Utime12 = $cd12[2];
		$cd12_Utime = explode(":",$Utime12);
		$d12_HUtime = $cd12_Utime[0];
		$d12_MUtime = $cd12_Utime[1];

		$HW12 = $cd12[2];
		$tHW12 = explode(":",$HW12);
		$cHWtime12 =$tHW12[0];
		$cMWtime12 =$tHW12[1];

		//Day 13
		$d13 = $resEmpDtr[$i]['d13'];
		$dx13 = explode(" ",$d13);
		$AmArr_d13 = $dx13[0];
		$AmDep_d13 = $dx13[1];
		$PmArr_d13 = $dx13[2];
		$PmDep_d13 = $dx13[3];

		$calc_d13 = $resEmpDtr[$i]['calc_d13'];
		$cd13 = explode(" ",$calc_d13);
		$Utime13 = $cd13[2];
		$cd13_Utime = explode(":",$Utime13);
		$d13_HUtime = $cd13_Utime[0];
		$d13_MUtime = $cd13_Utime[1];

		$HW13 = $cd13[2];
		$tHW13 = explode(":",$HW13);
		$cHWtime13 =$tHW13[0];
		$cMWtime13 =$tHW13[1];

		//Day 14
		$d14 = $resEmpDtr[$i]['d14'];
		$dx14 = explode(" ",$d14);
		$AmArr_d14 = $dx14[0];
		$AmDep_d14 = $dx14[1];
		$PmArr_d14 = $dx14[2];
		$PmDep_d14 = $dx14[3];

		$calc_d14 = $resEmpDtr[$i]['calc_d14'];
		$cd14 = explode(" ",$calc_d14);
		$Utime14 = $cd14[2];
		$cd14_Utime = explode(":",$Utime14);
		$d14_HUtime = $cd14_Utime[0];
		$d14_MUtime = $cd14_Utime[1];

		$HW14 = $cd14[2];
		$tHW14 = explode(":",$HW14);
		$cHWtime14 =$tHW14[0];
		$cMWtime14 =$tHW14[1];
		
		//Day 15
		$d15 = $resEmpDtr[$i]['d15'];
		$dx15 = explode(" ",$d15);
		$AmArr_d15 = $dx15[0];
		$AmDep_d15 = $dx15[1];
		$PmArr_d15 = $dx15[2];
		$PmDep_d15 = $dx15[3];
				
		$calc_d15 = $resEmpDtr[$i]['calc_d15'];
		$cd15 = explode(" ",$calc_d15);
		$Utime15 = $cd15[2];
		$cd15_Utime = explode(":",$Utime15);
		$d15_HUtime = $cd15_Utime[0];
		$d15_MUtime = $cd15_Utime[1];

		$HW15 = $cd15[2];
		$tHW15 = explode(":",$HW15);
		$cHWtime15 =$tHW15[0];
		$cMWtime15 =$tHW15[1];

		//Day 16
		$d16 = $resEmpDtr[$i]['d16'];
		$dx16 = explode(" ",$d16);
		$AmArr_d16 = $dx16[0];
		$AmDep_d16 = $dx16[1];
		$PmArr_d16 = $dx16[2];
		$PmDep_d16 = $dx16[3];
				
		$calc_d16 = $resEmpDtr[$i]['calc_d16'];
		$cd16 = explode(" ",$calc_d16);
		$Utime16 = $cd16[2];
		$cd16_Utime = explode(":",$Utime16);
		$d16_HUtime = $cd16_Utime[0];
		$d16_MUtime = $cd16_Utime[1];

		$HW16 = $cd16[2];
		$tHW16 = explode(":",$HW16);
		$cHWtime16 =$tHW16[0];
		$cMWtime16 =$tHW16[1];
		
		//Day 17
		$d17 = $resEmpDtr[$i]['d17'];
		$dx17 = explode(" ",$d17);
		$AmArr_d17 = $dx17[0];
		$AmDep_d17 = $dx17[1];
		$PmArr_d17 = $dx17[2];
		$PmDep_d17 = $dx17[3];
				
		$calc_d17 = $resEmpDtr[$i]['calc_d17'];
		$cd17 = explode(" ",$calc_d17);
		$Utime17 = $cd17[2];
		$cd17_Utime = explode(":",$Utime17);
		$d17_HUtime = $cd17_Utime[0];
		$d17_MUtime = $cd17_Utime[1];

		$HW17 = $cd17[2];
		$tHW17 = explode(":",$HW17);
		$cHWtime17 =$tHW17[0];
		$cMWtime17 =$tHW17[1];

		//Day 18
		$d18 = $resEmpDtr[$i]['d18'];
		$dx18 = explode(" ",$d18);
		$AmArr_d18 = $dx18[0];
		$AmDep_d18 = $dx18[1];
		$PmArr_d18 = $dx18[2];
		$PmDep_d18 = $dx18[3];
				
		$calc_d18 = $resEmpDtr[$i]['calc_d18'];
		$cd18 = explode(" ",$calc_d18);
		$Utime18 = $cd18[2];
		$cd18_Utime = explode(":",$Utime18);
		$d18_HUtime = $cd18_Utime[0];
		$d18_MUtime = $cd18_Utime[1];

		$HW18 = $cd18[2];
		$tHW18 = explode(":",$HW18);
		$cHWtime18 =$tHW18[0];
		$cMWtime18 =$tHW18[1];

		//Day 19
		$d19 = $resEmpDtr[$i]['d19'];
		$dx19 = explode(" ",$d19);
		$AmArr_d19 = $dx19[0];
		$AmDep_d19 = $dx19[1];
		$PmArr_d19 = $dx19[2];
		$PmDep_d19 = $dx19[3];
				
		$calc_d19 = $resEmpDtr[$i]['calc_d19'];
		$cd19 = explode(" ",$calc_d19);
		$Utime19 = $cd19[2];
		$cd19_Utime = explode(":",$Utime19);
		$d19_HUtime = $cd19_Utime[0];
		$d19_MUtime = $cd19_Utime[1];

		$HW19 = $cd19[2];
		$tHW19 = explode(":",$HW19);
		$cHWtime19 =$tHW19[0];
		$cMWtime19 =$tHW19[1];

		//Day 20
		$d20 = $resEmpDtr[$i]['d20'];
		$dx20 = explode(" ",$d20);
		$AmArr_d20 = $dx20[0];
		$AmDep_d20 = $dx20[1];
		$PmArr_d20 = $dx20[2];
		$PmDep_d20 = $dx20[3];
				
		$calc_d20 = $resEmpDtr[$i]['calc_d20'];
		$cd20 = explode(" ",$calc_d20);
		$Utime20 = $cd20[2];
		$cd20_Utime = explode(":",$Utime20);
		$d20_HUtime = $cd20_Utime[0];
		$d20_MUtime = $cd20_Utime[1];

		$HW20 = $cd20[2];
		$tHW20 = explode(":",$HW20);
		$cHWtime20 =$tHW20[0];
		$cMWtime20 =$tHW20[1];

		//Day 21
		$d21 = $resEmpDtr[$i]['d21'];
		$dx21 = explode(" ",$d21);
		$AmArr_d21 = $dx21[0];
		$AmDep_d21 = $dx21[1];
		$PmArr_d21 = $dx21[2];
		$PmDep_d21 = $dx21[3];
				
		$calc_d21 = $resEmpDtr[$i]['calc_d21'];
		$cd21 = explode(" ",$calc_d21);
		$Utime21 = $cd21[2];
		$cd21_Utime = explode(":",$Utime21);
		$d21_HUtime = $cd21_Utime[0];
		$d21_MUtime = $cd21_Utime[1];

		$HW21 = $cd21[2];
		$tHW21 = explode(":",$HW21);
		$cHWtime21 =$tHW21[0];
		$cMWtime21 =$tHW21[1];

		//Day 22
		$d22 = $resEmpDtr[$i]['d22'];
		$dx22 = explode(" ",$d22);
		$AmArr_d22 = $dx22[0];
		$AmDep_d22 = $dx22[1];
		$PmArr_d22 = $dx22[2];
		$PmDep_d22 = $dx22[3];
				
		$calc_d22 = $resEmpDtr[$i]['calc_d22'];
		$cd22 = explode(" ",$calc_d22);
		$Utime22 = $cd22[2];
		$cd22_Utime = explode(":",$Utime22);
		$d22_HUtime = $cd22_Utime[0];
		$d22_MUtime = $cd22_Utime[1];

		$HW22 = $cd22[2];
		$tHW22 = explode(":",$HW22);
		$cHWtime22 =$tHW22[0];
		$cMWtime22 =$tHW22[1];

		//Day 23
		$d23 = $resEmpDtr[$i]['d23'];
		$dx23 = explode(" ",$d23);
		$AmArr_d23 = $dx23[0];
		$AmDep_d23 = $dx23[1];
		$PmArr_d23 = $dx23[2];
		$PmDep_d23 = $dx23[3];
				
		$calc_d23 = $resEmpDtr[$i]['calc_d23'];
		$cd23 = explode(" ",$calc_d23);
		$Utime23 = $cd23[2];
		$cd23_Utime = explode(":",$Utime23);
		$d23_HUtime = $cd23_Utime[0];
		$d23_MUtime = $cd23_Utime[1];

		$HW23 = $cd23[2];
		$tHW23 = explode(":",$HW23);
		$cHWtime23 =$tHW23[0];
		$cMWtime23 =$tHW23[1];

		//Day 24
		$d24 = $resEmpDtr[$i]['d24'];
		$dx24 = explode(" ",$d24);
		$AmArr_d24 = $dx24[0];
		$AmDep_d24 = $dx24[1];
		$PmArr_d24 = $dx24[2];
		$PmDep_d24 = $dx24[3];
				
		$calc_d24 = $resEmpDtr[$i]['calc_d24'];
		$cd24 = explode(" ",$calc_d24);
		$Utime24 = $cd24[2];
		$cd24_Utime = explode(":",$Utime24);
		$d24_HUtime = $cd24_Utime[0];
		$d24_MUtime = $cd24_Utime[1];

		$HW24 = $cd24[2];
		$tHW24 = explode(":",$HW24);
		$cHWtime24 =$tHW24[0];
		$cMWtime24 =$tHW24[1];

		//Day 25
		$d25 = $resEmpDtr[$i]['d25'];
		$dx25 = explode(" ",$d25);
		$AmArr_d25 = $dx25[0];
		$AmDep_d25 = $dx25[1];
		$PmArr_d25 = $dx25[2];
		$PmDep_d25 = $dx25[3];

		$calc_d25 = $resEmpDtr[$i]['calc_d25'];
		$cd25 = explode(" ",$calc_d25);
		$Utime25 = $cd25[2];
		$cd25_Utime = explode(":",$Utime25);
		$d25_HUtime = $cd25_Utime[0];
		$d25_MUtime = $cd25_Utime[1];

		$HW25 = $cd25[2];
		$tHW25 = explode(":",$HW25);
		$cHWtime25 =$tHW25[0];
		$cMWtime25 =$tHW25[1];

		//Day 26
		$d26 = $resEmpDtr[$i]['d26'];
		$dx26 = explode(" ",$d26);
		$AmArr_d26 = $dx26[0];
		$AmDep_d26 = $dx26[1];
		$PmArr_d26 = $dx26[2];
		$PmDep_d26 = $dx26[3];

		$calc_d26 = $resEmpDtr[$i]['calc_d26'];
		$cd26 = explode(" ",$calc_d26);
		$Utime26 = $cd26[2];
		$cd26_Utime = explode(":",$Utime26);
		$d26_HUtime = $cd26_Utime[0];
		$d26_MUtime = $cd26_Utime[1];

		$HW26 = $cd26[2];
		$tHW26 = explode(":",$HW26);
		$cHWtime26 =$tHW26[0];
		$cMWtime26 =$tHW26[1];

		//Day 27
		$d27 = $resEmpDtr[$i]['d27'];
		$dx27 = explode(" ",$d27);
		$AmArr_d27 = $dx27[0];
		$AmDep_d27 = $dx27[1];
		$PmArr_d27 = $dx27[2];
		$PmDep_d27 = $dx27[3];

		$calc_d27 = $resEmpDtr[$i]['calc_d27'];
		$cd27 = explode(" ",$calc_d27);
		$Utime27 = $cd27[2];
		$cd27_Utime = explode(":",$Utime27);
		$d27_HUtime = $cd27_Utime[0];
		$d27_MUtime = $cd27_Utime[1];

		$HW27 = $cd27[2];
		$tHW27 = explode(":",$HW27);
		$cHWtime27 =$tHW27[0];
		$cMWtime27 =$tHW27[1];

		//Day 28
		$d28 = $resEmpDtr[$i]['d28'];
		$dx28 = explode(" ",$d28);
		$AmArr_d28 = $dx28[0];
		$AmDep_d28 = $dx28[1];
		$PmArr_d28 = $dx28[2];
		$PmDep_d28 = $dx28[3];

		$calc_d28 = $resEmpDtr[$i]['calc_d28'];
		$cd28 = explode(" ",$calc_d28);
		$Utime28 = $cd28[2];
		$cd28_Utime = explode(":",$Utime28);
		$d28_HUtime = $cd28_Utime[0];
		$d28_MUtime = $cd28_Utime[1];

		$HW28 = $cd28[2];
		$tHW28 = explode(":",$HW28);
		$cHWtime28 =$tHW28[0];
		$cMWtime28 =$tHW28[1];

		//Day 29
		$d29 = $resEmpDtr[$i]['d29'];
		$dx29 = explode(" ",$d29);
		$AmArr_d29 = $dx29[0];
		$AmDep_d29 = $dx29[1];
		$PmArr_d29 = $dx29[2];
		$PmDep_d29 = $dx29[3];

		$calc_d29 = $resEmpDtr[$i]['calc_d29'];
		$cd29 = explode(" ",$calc_d29);
		$Utime29 = $cd29[2];
		$cd29_Utime = explode(":",$Utime29);
		$d29_HUtime = $cd29_Utime[0];
		$d29_MUtime = $cd29_Utime[1];

		$HW29 = $cd29[2];
		$tHW29 = explode(":",$HW29);
		$cHWtime29 =$tHW29[0];
		$cMWtime29 =$tHW29[1];

		//Day 30
		$d30 = $resEmpDtr[$i]['d30'];
		$dx30 = explode(" ",$d30);
		$AmArr_d30 = $dx30[0];
		$AmDep_d30 = $dx30[1];
		$PmArr_d30 = $dx30[2];
		$PmDep_d30 = $dx30[3];

		$calc_d30 = $resEmpDtr[$i]['calc_d30'];
		$cd30 = explode(" ",$calc_d30);
		$Utime30 = $cd30[2];
		$cd30_Utime = explode(":",$Utime30);
		$d30_HUtime = $cd30_Utime[0];
		$d30_MUtime = $cd30_Utime[1];

		$HW30 = $cd30[2];
		$tHW30 = explode(":",$HW30);
		$cHWtime30 =$tHW30[0];
		$cMWtime30 =$tHW30[1];

		//Day 31
		$d31 = $resEmpDtr[$i]['d31'];
		$dx31 = explode(" ",$d31);
		$AmArr_d31 = $dx31[0];
		$AmDep_d31 = $dx31[1];
		$PmArr_d31 = $dx31[2];
		$PmDep_d31 = $dx31[3];

		$calc_d31 = $resEmpDtr[$i]['calc_d31'];
		$cd31 = explode(" ",$calc_d31);
		$Utime31 = $cd31[2];
		$cd31_Utime = explode(":",$Utime31);
		$d31_HUtime = $cd31_Utime[0];
		$d31_MUtime = $cd31_Utime[1];

		$HW31 = $cd31[2];
		$tHW31 = explode(":",$HW31);
		$cHWtime31 =$tHW31[0];
		$cMWtime31 =$tHW31[1];

		$absreason1 = $resEmpDtr[$i]['absreason1'];
		$absreason2 = $resEmpDtr[$i]['absreason2'];
		$absreason3 = $resEmpDtr[$i]['absreason3'];
		$absreason4 = $resEmpDtr[$i]['absreason4'];
		$absreason5 = $resEmpDtr[$i]['absreason5'];
		$absreason6 = $resEmpDtr[$i]['absreason6'];
		$absreason7 = $resEmpDtr[$i]['absreason7'];
		$absreason8 = $resEmpDtr[$i]['absreason8'];
		$absreason9 = $resEmpDtr[$i]['absreason9'];
		$absreason10 = $resEmpDtr[$i]['absreason10'];
		$absreason11 = $resEmpDtr[$i]['absreason11'];
		$absreason12 = $resEmpDtr[$i]['absreason12'];
		$absreason13 = $resEmpDtr[$i]['absreason13'];
		$absreason14 = $resEmpDtr[$i]['absreason14'];
		$absreason15 = $resEmpDtr[$i]['absreason15'];
		$absreason16 = $resEmpDtr[$i]['absreason16'];
		$absreason17 = $resEmpDtr[$i]['absreason17'];
		$absreason18 = $resEmpDtr[$i]['absreason18'];
		$absreason19 = $resEmpDtr[$i]['absreason19'];
		$absreason20 = $resEmpDtr[$i]['absreason20'];
		$absreason21 = $resEmpDtr[$i]['absreason21'];
		$absreason22 = $resEmpDtr[$i]['absreason22'];
		$absreason23 = $resEmpDtr[$i]['absreason23'];
		$absreason24 = $resEmpDtr[$i]['absreason24'];
		$absreason25 = $resEmpDtr[$i]['absreason25'];
		$absreason26 = $resEmpDtr[$i]['absreason26'];
		$absreason27 = $resEmpDtr[$i]['absreason27'];
		$absreason28 = $resEmpDtr[$i]['absreason28'];
		$absreason29 = $resEmpDtr[$i]['absreason29'];
		$absreason30 = $resEmpDtr[$i]['absreason30'];
		$absreason31 = $resEmpDtr[$i]['absreason31'];

		$confirmedd1 = $resEmpDtr[$i]['confirmedd1'];
		$confirmedd2 = $resEmpDtr[$i]['confirmedd2'];
		$confirmedd3 = $resEmpDtr[$i]['confirmedd3'];
		$confirmedd4 = $resEmpDtr[$i]['confirmedd4'];
		$confirmedd5 = $resEmpDtr[$i]['confirmedd5'];
		$confirmedd6 = $resEmpDtr[$i]['confirmedd6'];
		$confirmedd7 = $resEmpDtr[$i]['confirmedd7'];
		$confirmedd8 = $resEmpDtr[$i]['confirmedd8'];
		$confirmedd9 = $resEmpDtr[$i]['confirmedd9'];
		$confirmedd10 = $resEmpDtr[$i]['confirmedd10'];
		$confirmedd11 = $resEmpDtr[$i]['confirmedd11'];
		$confirmedd12 = $resEmpDtr[$i]['confirmedd12'];
		$confirmedd13 = $resEmpDtr[$i]['confirmedd13'];
		$confirmedd14 = $resEmpDtr[$i]['confirmedd14'];
		$confirmedd15 = $resEmpDtr[$i]['confirmedd15'];
		$confirmedd16 = $resEmpDtr[$i]['confirmedd16'];
		$confirmedd17 = $resEmpDtr[$i]['confirmedd17'];
		$confirmedd18 = $resEmpDtr[$i]['confirmedd18'];
		$confirmedd19 = $resEmpDtr[$i]['confirmedd19'];
		$confirmedd20 = $resEmpDtr[$i]['confirmedd20'];
		$confirmedd21 = $resEmpDtr[$i]['confirmedd21'];
		$confirmedd22 = $resEmpDtr[$i]['confirmedd22'];
		$confirmedd23 = $resEmpDtr[$i]['confirmedd23'];
		$confirmedd24 = $resEmpDtr[$i]['confirmedd24'];
		$confirmedd25 = $resEmpDtr[$i]['confirmedd25'];
		$confirmedd26 = $resEmpDtr[$i]['confirmedd26'];
		$confirmedd27 = $resEmpDtr[$i]['confirmedd27'];
		$confirmedd28 = $resEmpDtr[$i]['confirmedd28'];
		$confirmedd29 = $resEmpDtr[$i]['confirmedd29'];
		$confirmedd30 = $resEmpDtr[$i]['confirmedd30'];
		$confirmedd31 = $resEmpDtr[$i]['confirmedd31'];
		$leave_credits = $resEmpDtr[$i]['leave_credits'];

		$data[] = array(
			"id"=>$resEmpDtr[$i]['temp_biorecord_id'],

			"AmArr_d1"=>$AmArr_d1,
			"AmDep_d1"=>$AmDep_d1,
			"PmArr_d1"=>$PmArr_d1,
			"PmDep_d1"=>$PmDep_d1,
			"d1_HUtime"=>$d1_HUtime,
			"d1_MUtime"=>$d1_MUtime,

			"AmArr_d2"=>$AmArr_d2,
			"AmDep_d2"=>$AmDep_d2,
			"PmArr_d2"=>$PmArr_d2,
			"PmDep_d2"=>$PmDep_d2,
			"d2_HUtime"=>$d2_HUtime,
			"d2_MUtime"=>$d2_MUtime,

			"AmArr_d3"=>$AmArr_d3,
			"AmDep_d3"=>$AmDep_d3,
			"PmArr_d3"=>$PmArr_d3,
			"PmDep_d3"=>$PmDep_d3,
			"d3_HUtime"=>$d3_HUtime,
			"d3_MUtime"=>$d3_MUtime,

			"AmArr_d4"=>$AmArr_d4,
			"AmDep_d4"=>$AmDep_d4,
			"PmArr_d4"=>$PmArr_d4,
			"PmDep_d4"=>$PmDep_d4,
			"d4_HUtime"=>$d4_HUtime,
			"d4_MUtime"=>$d4_MUtime,

			"AmArr_d5"=>$AmArr_d5,
			"AmDep_d5"=>$AmDep_d5,
			"PmArr_d5"=>$PmArr_d5,
			"PmDep_d5"=>$PmDep_d5,
			"d5_HUtime"=>$d5_HUtime,
			"d5_MUtime"=>$d5_MUtime,

			"AmArr_d6"=>$AmArr_d6,
			"AmDep_d6"=>$AmDep_d6,
			"PmArr_d6"=>$PmArr_d6,
			"PmDep_d6"=>$PmDep_d6,
			"d6_HUtime"=>$d6_HUtime,
			"d6_MUtime"=>$d6_MUtime,

			"AmArr_d7"=>$AmArr_d7,
			"AmDep_d7"=>$AmDep_d7,
			"PmArr_d7"=>$PmArr_d7,
			"PmDep_d7"=>$PmDep_d7,
			"d7_HUtime"=>$d7_HUtime,
			"d7_MUtime"=>$d7_MUtime,

			"AmArr_d8"=>$AmArr_d8,
			"AmDep_d8"=>$AmDep_d8,
			"PmArr_d8"=>$PmArr_d8,
			"PmDep_d8"=>$PmDep_d8,
			"d8_HUtime"=>$d8_HUtime,
			"d8_MUtime"=>$d8_MUtime,

			"AmArr_d9"=>$AmArr_d9,
			"AmDep_d9"=>$AmDep_d9,
			"PmArr_d9"=>$PmArr_d9,
			"PmDep_d9"=>$PmDep_d9,
			"d9_HUtime"=>$d9_HUtime,
			"d9_MUtime"=>$d9_MUtime,

			"AmArr_d10"=>$AmArr_d10,
			"AmDep_d10"=>$AmDep_d10,
			"PmArr_d10"=>$PmArr_d10,
			"PmDep_d10"=>$PmDep_d10,
			"d10_HUtime"=>$d10_HUtime,
			"d10_MUtime"=>$d10_MUtime,

			"AmArr_d11"=>$AmArr_d11,
			"AmDep_d11"=>$AmDep_d11,
			"PmArr_d11"=>$PmArr_d11,
			"PmDep_d11"=>$PmDep_d11,
			"d11_HUtime"=>$d11_HUtime,
			"d11_MUtime"=>$d11_MUtime,

			"AmArr_d12"=>$AmArr_d12,
			"AmDep_d12"=>$AmDep_d12,
			"PmArr_d12"=>$PmArr_d12,
			"PmDep_d12"=>$PmDep_d12,
			"d12_HUtime"=>$d12_HUtime,
			"d12_MUtime"=>$d12_MUtime,

			"AmArr_d13"=>$AmArr_d13,
			"AmDep_d13"=>$AmDep_d13,
			"PmArr_d13"=>$PmArr_d13,
			"PmDep_d13"=>$PmDep_d13,
			"d13_HUtime"=>$d13_HUtime,
			"d13_MUtime"=>$d13_MUtime,

			"AmArr_d14"=>$AmArr_d14,
			"AmDep_d14"=>$AmDep_d14,
			"PmArr_d14"=>$PmArr_d14,
			"PmDep_d14"=>$PmDep_d14,
			"d14_HUtime"=>$d14_HUtime,
			"d14_MUtime"=>$d14_MUtime,

			"AmArr_d15"=>$AmArr_d15,
			"AmDep_d15"=>$AmDep_d15,
			"PmArr_d15"=>$PmArr_d15,
			"PmDep_d15"=>$PmDep_d15,
			"d15_HUtime"=>$d15_HUtime,
			"d15_MUtime"=>$d15_MUtime,

			"AmArr_d16"=>$AmArr_d16,
			"AmDep_d16"=>$AmDep_d16,
			"PmArr_d16"=>$PmArr_d16,
			"PmDep_d16"=>$PmDep_d16,
			"d16_HUtime"=>$d16_HUtime,
			"d16_MUtime"=>$d16_MUtime,

			"AmArr_d17"=>$AmArr_d17,
			"AmDep_d17"=>$AmDep_d17,
			"PmArr_d17"=>$PmArr_d17,
			"PmDep_d17"=>$PmDep_d17,
			"d17_HUtime"=>$d17_HUtime,
			"d17_MUtime"=>$d17_MUtime,

			"AmArr_d18"=>$AmArr_d18,
			"AmDep_d18"=>$AmDep_d18,
			"PmArr_d18"=>$PmArr_d18,
			"PmDep_d18"=>$PmDep_d18,
			"d18_HUtime"=>$d18_HUtime,
			"d18_MUtime"=>$d18_MUtime,

			"AmArr_d19"=>$AmArr_d19,
			"AmDep_d19"=>$AmDep_d19,
			"PmArr_d19"=>$PmArr_d19,
			"PmDep_d19"=>$PmDep_d19,
			"d19_HUtime"=>$d19_HUtime,
			"d19_MUtime"=>$d19_MUtime,

			"AmArr_d20"=>$AmArr_d20,
			"AmDep_d20"=>$AmDep_d20,
			"PmArr_d20"=>$PmArr_d20,
			"PmDep_d20"=>$PmDep_d20,
			"d20_HUtime"=>$d20_HUtime,
			"d20_MUtime"=>$d20_MUtime,

			"AmArr_d21"=>$AmArr_d21,
			"AmDep_d21"=>$AmDep_d21,
			"PmArr_d21"=>$PmArr_d21,
			"PmDep_d21"=>$PmDep_d21,
			"d21_HUtime"=>$d21_HUtime,
			"d21_MUtime"=>$d21_MUtime,

			"AmArr_d22"=>$AmArr_d22,
			"AmDep_d22"=>$AmDep_d22,
			"PmArr_d22"=>$PmArr_d22,
			"PmDep_d22"=>$PmDep_d22,
			"d22_HUtime"=>$d22_HUtime,
			"d22_MUtime"=>$d22_MUtime,

			"AmArr_d23"=>$AmArr_d23,
			"AmDep_d23"=>$AmDep_d23,
			"PmArr_d23"=>$PmArr_d23,
			"PmDep_d23"=>$PmDep_d23,
			"d23_HUtime"=>$d23_HUtime,
			"d23_MUtime"=>$d23_MUtime,

			"AmArr_d24"=>$AmArr_d24,
			"AmDep_d24"=>$AmDep_d24,
			"PmArr_d24"=>$PmArr_d24,
			"PmDep_d24"=>$PmDep_d24,
			"d24_HUtime"=>$d24_HUtime,
			"d24_MUtime"=>$d24_MUtime,

			"AmArr_d25"=>$AmArr_d25,
			"AmDep_d25"=>$AmDep_d25,
			"PmArr_d25"=>$PmArr_d25,
			"PmDep_d25"=>$PmDep_d25,
			"d25_HUtime"=>$d25_HUtime,
			"d25_MUtime"=>$d25_MUtime,

			"AmArr_d26"=>$AmArr_d26,
			"AmDep_d26"=>$AmDep_d26,
			"PmArr_d26"=>$PmArr_d26,
			"PmDep_d26"=>$PmDep_d26,
			"d26_HUtime"=>$d26_HUtime,
			"d26_MUtime"=>$d26_MUtime,

			"AmArr_d27"=>$AmArr_d27,
			"AmDep_d27"=>$AmDep_d27,
			"PmArr_d27"=>$PmArr_d27,
			"PmDep_d27"=>$PmDep_d27,
			"d27_HUtime"=>$d27_HUtime,
			"d27_MUtime"=>$d27_MUtime,

			"AmArr_d28"=>$AmArr_d28,
			"AmDep_d28"=>$AmDep_d28,
			"PmArr_d28"=>$PmArr_d28,
			"PmDep_d28"=>$PmDep_d28,
			"d28_HUtime"=>$d28_HUtime,
			"d28_MUtime"=>$d28_MUtime,

			"AmArr_d29"=>$AmArr_d29,
			"AmDep_d29"=>$AmDep_d29,
			"PmArr_d29"=>$PmArr_d29,
			"PmDep_d29"=>$PmDep_d29,
			"d29_HUtime"=>$d29_HUtime,
			"d29_MUtime"=>$d29_MUtime,

			"AmArr_d30"=>$AmArr_d30,
			"AmDep_d30"=>$AmDep_d30,
			"PmArr_d30"=>$PmArr_d30,
			"PmDep_d30"=>$PmDep_d30,
			"d30_HUtime"=>$d30_HUtime,
			"d30_MUtime"=>$d30_MUtime,

			"AmArr_d31"=>$AmArr_d31,
			"AmDep_d31"=>$AmDep_d31,
			"PmArr_d31"=>$PmArr_d31,
			"PmDep_d31"=>$PmDep_d31,
			"d31_HUtime"=>$d31_HUtime,
			"d31_MUtime"=>$d31_MUtime,


			"cHWtime1" => $cHWtime1,
			"cMWtime1" => $cMWtime1,

			"cHWtime2" => $cHWtime2,
			"cMWtime2" => $cMWtime2,

			"cHWtime3" => $cHWtime3,
			"cMWtime3" => $cMWtime3,

			"cHWtime4" => $cHWtime4,
			"cMWtime4" => $cMWtime4,

			"cHWtime5" => $cHWtime5,
			"cMWtime5" => $cMWtime5,
			
			"cHWtime6" => $cHWtime6,
			"cMWtime6" => $cMWtime6,

			"cHWtime7" => $cHWtime7,
			"cMWtime7" => $cMWtime7,
			
			"cHWtime8" => $cHWtime8,
			"cMWtime8" => $cMWtime8,

			"cHWtime9" => $cHWtime9,
			"cMWtime9" => $cMWtime9,

			"cHWtime10" => $cHWtime10,
			"cMWtime10" => $cMWtime10,

			"cHWtime11" => $cHWtime11,
			"cMWtime11" => $cMWtime11,

			"cHWtime12" => $cHWtime12,
			"cMWtime12" => $cMWtime12,

			"cHWtime13" => $cHWtime13,
			"cMWtime13" => $cMWtime13,

			"cHWtime14" => $cHWtime14,
			"cMWtime14" => $cMWtime14,

			"cHWtime15" => $cHWtime15,
			"cMWtime15" => $cMWtime15,

			"cHWtime16" => $cHWtime16,
			"cMWtime16" => $cMWtime16,

			"cHWtime17" => $cHWtime17,
			"cMWtime17" => $cMWtime17,

			"cHWtime18" => $cHWtime18,
			"cMWtime18" => $cMWtime18,

			"cHWtime19" => $cHWtime19,
			"cMWtime19" => $cMWtime19,

			"cHWtime20" => $cHWtime20,
			"cMWtime20" => $cMWtime20,

			"cHWtime21" => $cHWtime21,
			"cMWtime21" => $cMWtime21,

			"cHWtime22" => $cHWtime22,
			"cMWtime22" => $cMWtime22,

			"cHWtime23" => $cHWtime23,
			"cMWtime23" => $cMWtime23,

			"cHWtime24" => $cHWtime24,
			"cMWtime24" => $cMWtime24,

			"cHWtime25" => $cHWtime25,
			"cMWtime25" => $cMWtime25,

			"cHWtime26" => $cHWtime26,
			"cMWtime26" => $cMWtime26,

			"cHWtime27" => $cHWtime27,
			"cMWtime27" => $cMWtime27,

			"cHWtime28" => $cHWtime28,
			"cMWtime28" => $cMWtime28,

			"cHWtime29" => $cHWtime29,
			"cMWtime29" => $cMWtime29,

			"cHWtime30" => $cHWtime30,
			"cMWtime30" => $cMWtime30,

			

			"cHWtime31" => $cHWtime31,
			"cMWtime31" => $cMWtime31,

			"absreason1"=>$absreason1,
			"absreason2"=>$absreason2,
			"absreason3"=>$absreason3,
			"absreason4"=>$absreason4,
			"absreason5"=>$absreason5,
			"absreason6"=>$absreason6,
			"absreason7"=>$absreason7,
			"absreason8"=>$absreason8,
			"absreason9"=>$absreason9,
			"absreason10"=>$absreason10,
			"absreason11"=>$absreason11,
			"absreason12"=>$absreason12,
			"absreason13"=>$absreason13,
			"absreason14"=>$absreason14,
			"absreason15"=>$absreason15,
			"absreason16"=>$absreason16,
			"absreason17"=>$absreason17,
			"absreason18"=>$absreason18,
			"absreason19"=>$absreason19,
			"absreason20"=>$absreason20,
			"absreason21"=>$absreason21,
			"absreason22"=>$absreason22,
			"absreason23"=>$absreason23,
			"absreason24"=>$absreason24,
			"absreason25"=>$absreason25,
			"absreason26"=>$absreason26,
			"absreason27"=>$absreason27,
			"absreason28"=>$absreason28,
			"absreason29"=>$absreason29,
			"absreason30"=>$absreason30,
			"absreason31"=>$absreason31,

			"confirmedd1"=>$confirmedd1,
			"confirmedd2"=>$confirmedd2,
			"confirmedd3"=>$confirmedd3,
			"confirmedd4"=>$confirmedd4,
			"confirmedd5"=>$confirmedd5,
			"confirmedd6"=>$confirmedd6,
			"confirmedd7"=>$confirmedd7,
			"confirmedd8"=>$confirmedd8,
			"confirmedd9"=>$confirmedd9,
			"confirmedd10"=>$confirmedd10,
			"confirmedd11"=>$confirmedd11,
			"confirmedd12"=>$confirmedd12,
			"confirmedd13"=>$confirmedd13,
			"confirmedd14"=>$confirmedd14,
			"confirmedd15"=>$confirmedd15,
			"confirmedd16"=>$confirmedd16,
			"confirmedd17"=>$confirmedd17,
			"confirmedd18"=>$confirmedd18,
			"confirmedd19"=>$confirmedd19,
			"confirmedd20"=>$confirmedd20,
			"confirmedd21"=>$confirmedd21,
			"confirmedd22"=>$confirmedd22,
			"confirmedd23"=>$confirmedd23,
			"confirmedd24"=>$confirmedd24,
			"confirmedd25"=>$confirmedd25,
			"confirmedd26"=>$confirmedd26,
			"confirmedd27"=>$confirmedd27,
			"confirmedd28"=>$confirmedd28,
			"confirmedd29"=>$confirmedd29,
			"confirmedd30"=>$confirmedd30,
			"confirmedd31"=>$confirmedd31,
			"leave_credits"=>$leave_credits,
			
			"d1"=>$d1,
			"d2"=>$d2,
			"d3"=>$d3,
			"d4"=>$d4,
			"d5"=>$d5,
			"d6"=>$d6,
			"d7"=>$d7,
			"d8"=>$d8,
			"d9"=>$d9,
			"d10"=>$d10,
			"d11"=>$d11,
			"d12"=>$d12,
			"d13"=>$d13,
			"d14"=>$d14,
			"d15"=>$d15,
			"d16"=>$d16,
			"d17"=>$d17,
			"d18"=>$d18,
			"d19"=>$d19,
			"d20"=>$d20,
			"d21"=>$d21,
			"d22"=>$d22,
			"d23"=>$d23,
			"d24"=>$d24,
			"d25"=>$d25,
			"d26"=>$d26,
			"d27"=>$d27,
			"d28"=>$d28,
			"d29"=>$d29,
			"d30"=>$d30,
			"d31"=>$d31,

			);
		}
	
		$maybe[] = array("maybee"=>"maybe");

		if(COUNT($resEmpDtr) == 0){
			$x =  $response = array(
				"empDtr" => $maybe
				
				);
		}else{
			 ## Response
			$x = $response = array(
				"empDtr" => $data
				);
		}
	  
		
		
	echo json_encode($x);
	die;

}



}