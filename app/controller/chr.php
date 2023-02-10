<?php
/*
*
*
*/
// require_once('vendor/autoload.php');

/* use NXP\Exception\DivisionByZeroException;
use NXP\Exception\IncorrectExpressionException;
use NXP\Exception\IncorrectNumberOfFunctionParametersException;
use NXP\Exception\MathExecutorException;
use NXP\Exception\UnknownFunctionException;
use NXP\Exception\UnknownVariableException;
use NXP\MathExecutor;
 */
class chr extends cau {

	public function list(){

/* 		$executor = new MathExecutor();

		echo $executor->execute('1 + 2 * (2000/250)');
		echo "<br>";
		$executor->setVar('BASIC_SALARY', 2000)->setVar('TAX',.3);

		echo $executor->execute("BASIC_SALARY * TAX");
		die; */
		$deduction = new rdeduction($this->db);
		$this->f3->set('rpr_deduction', $deduction->all());

		$earning = new rearning($this->db);
		$this->f3->set('rpr_earning', $earning->all());

		$allowance = new rallowance($this->db);
		$this->f3->set('rpr_allowance', $allowance->all());

		if($this->f3->VERB=='GET') {

			$oUserMenu = new menu_skote();
			$menu = $oUserMenu->loadMenu();

			$this->f3->SET('sidebar', $menu);
			if($this->f3->GET('SESSION.user_group_id') === 5)
			{
				 $this->f3->set('content','page/unauthorized.html');
				 $this->f3->set('layout','page/unauth.html');
			}else{
			$this->f3->set('content','/page/hr/employee/employee-list.html');
			$this->f3->set('layout','/page/layout.html');
			}
		} else 
		{

			
			$draw = $this->f3->GET('POST.draw');
			$row = $this->f3->GET('POST.start');

			$rowperpage = $this->f3->GET('POST.length'); // Rows display per page

				$columnIndex = $this->f3->GET("POST.order[0]['column']"); // Column index
			//$columnIndex = $_POST['order'][0]['column']; // Column index
			//var_dump($columnIndex);
			$columnName = $this->f3->GET("POST.columns[$columnIndex]['data']"); // Column name

			switch ($columnName) {
				case 'fullName':
					$columnName = 'temp_last';
					break;
				case 'picture':
					$columnName = 'temp_efn';
					break;
				case 'dob_gender':
					$columnName = 'temp_gender';
					break;
				case 'fullAddress':
					$columnName = 'citymuncode';
					break;
				case 'fileDetails':
					$columnName = 'brgycode';
					break;
				case 'divDetails':
					$columnName = 'rdivision_name';
					break;
				default:
					# code...
					break;
			}

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

			$oTemp = new temp($this->db);

			$result = $oTemp->countRecords();

			$totalRecords = $result[0]['totalRecords'];

			$totalRecordWithFilter = $totalRecords;
            ## Total number of record with filtering
            if ($searchQuery !="") {

                $totalRecordWithFilter = $oTemp->countRecordsWithFilter($searchQuery);
            }

			## Fetch records
			$oRecords = $oTemp->getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage);


			$data = [];

			for($i=0;$i<count($oRecords);$i++) {
				$hashcode = $oRecords[$i]['temp_hashcode'];
				$tempid = $oRecords[$i]['temp_id'];
				$rsched_id = $oRecords[$i]['rsched_id'];

				$fullName = "<div class='text-wrap width-150'>".'<address>';
				$fullName .= $oRecords[$i]['temp_first'] . ' ' .$oRecords[$i]['temp_mid'].' '.$oRecords[$i]['lastSuffix'].'<br>';
				$fullName .= $oRecords[$i]['rposition_desc'].'<br>';
				$fullName .= '<span class="badge bg-success">'.$oRecords[$i]['temp_efn'].'</span>';
				$fullName .= '</address> </div>';

				$fullAddress = "<div>";
				$fullAddress .= "<address>";
				$fullAddress .= "	".$oRecords[$i]['temp_bldgno']. ' '.$oRecords[$i]['temp_street']. " St., ".'Zone '.$oRecords[$i]['temp_zone']. ",<br>";
				$fullAddress .= "	".$oRecords[$i]['brgydesc']."<br>";
				$fullAddress .= "		".$oRecords[$i]['citymundesc']. ", ".$oRecords[$i]['provdesc']."<br>";
				$fullAddress .= "		".$oRecords[$i]['temp_mobile']."<br>";
				$fullAddress .= "	</address>";
				$fullAddress .= "</div>";
				$action = '';

				if ($employeeFullAccess =="N") {
					$action =  '';
				} else {
                    $action .= '<div class="dropdown me-1">';
                    $action .= '  <button';
                    $action .= '    type="button"';
                    $action .= '    class="btn btn-sm btn-info dropdown-toggle"';
                    $action .= '    id="dropdownMenuOffset"';
                    $action .= '    data-bs-toggle="dropdown"';
                    $action .= '    aria-haspopup="true"';
                    $action .= '    aria-expanded="false"';
                    $action .= '    data-offset="10,20"';
                    $action .= '  >';
                    $action .= '    <i class="fas fa-user"></i>';
                    $action .= '  </button>';
                    $action .= '  <div';
                    $action .= '    class="dropdown-menu"';
                    $action .= '    aria-labelledby="dropdownMenuOffset"';
                    $action .= '  >';
					// $action .= '		<button class="dropdown-item btnEmployeePayroll" data-hash="'.$hashcode.'" data-id="'.$tempid.'">Set Payroll</button>';
					$action .= '		<a class="dropdown-item btnEmployeeEdit" href="#" data-hash="'.$hashcode.'" data-id="'.$tempid.'" data-rsched="'.$rsched_id.'">Edit Details</a>';
					$action .= '		<a class="dropdown-item btnEmployeeTransfer" href="#" data-hash="'.$hashcode.'" data-id="'.$tempid.'" >Transfer Employee</a>';
					$action .= '		<a class="dropdown-item btnEmployeePosition" href="#" data-hash="'.$hashcode.'" data-id="'.$tempid.'">Change Position</a>';
					$action .= '		<a class="dropdown-item btnEmployeeEmploymentType" href="#" data-hash="'.$hashcode.'" data-id="'.$tempid.'">Change Employment Type</a>';
					$action .= '		<a class="dropdown-item btnEmployeeDelete" href="#" data-hash="'.$hashcode.'" data-id="'.$tempid.'">Delete</a>';
                    $action .= '  </div>';
                    $action .= '</div>';
				}


				$fileDetails = "<div class='text-wrap width-150'>".'<address>';
				$fileDetails .= $oRecords[$i]['remployment_type_desc'].'<br>';
				$fileDetails .= '</address> </div>';

				$picture = '';
				$picture .= '<div class="col">';
				$picture .= '	<div class="d-flex">';
				$picture .= '		<div class="flex-shrink-0 me-3">';
				$picture .= '			<img src="/public/employee/picture/'.$oRecords[$i]['temp_hashcode'].'.png?'.rand().'" alt="" width="50" height="50" class="avatar-sm rounded-circle">';
				$picture .= '		</div>';

				$picture .= '	</div>';
				$picture .= '</div>';

				$dobGender = "<address>";
				$dobGender .= $oRecords[$i]['temp_dob']."<br>";
				$dobGender .= $oRecords[$i]['temp_marital'].", " . $oRecords[$i]['temp_gender'];
				$dobGender .= "</address>";

				$divDetails = "<div class='text-wrap width-150'>".'<address>';
				$divDetails .= $oRecords[$i]['rdivision_name']."<br><br>";
				$divDetails .= $oRecords[$i]['rdivision_sectionunit_name'];
				$divDetails .= "</address>";

				$data[] = array(
					"temp_hashcode"=>$oRecords[$i]['temp_hashcode'],
					"picture"=>$picture,
					"fullName"=>$fullName,
					"dob_gender"=>$dobGender,
					"fileDetails"=>$fileDetails,
					"fullAddress"=>$fullAddress,
					"divDetails"=>$divDetails,
					"action"=>$action
				);
			}

			## Response
			$response = array(
			"draw" => intval($draw),
			"iTotalRecords" => $totalRecords,
			"iTotalDisplayRecords" => $totalRecordWithFilter,
			"aaData" => $data
			);

			echo json_encode($response);
			die;
		}
	}


	/*
	* add new employee
	*/
	public function add() {
		$lastId = 0;
		$msgContent = 'New employee saved successfully';
		$status = false;
		$msgTitle = "Success";
		$oEmp = new temp($this->db);

		$found = $oEmp->findDuplicateName($this->f3->GET('POST.temp_first'),
		$this->f3->GET('POST.temp_mid'), $this->f3->GET('POST.temp_last'),
		$this->f3->GET('POST.temp_suffice'),$this->f3->GET('POST.temp_dob'));
		if ($found) {
			echo json_encode(array('status'=>false, 'msgTitle'=>"Duplicate Error",'msgContent'=>"Duplicate employee name found", 'icon'=>'error'));
			die;
		}

		$icon = 'success';
		try {
			date_default_timezone_set('America/New_York');
			$date= date('Y-m-d') ;
			$this->setEmptyDateToNull();
			$oSec = new cSec();

			$hashCode = $oSec->getToken(64);

			$this->f3->SET('POST.temp_hashcode', $hashCode);
			$lastId = $oEmp->add($this->f3->GET('POST'));
			$this->f3->SET('POST.temp_id', $lastId);

			//save temp to work
			$oWork = new temp_work($this->db);
			$this->f3->SET('POST.temp_work_agency_date_from', $date);
			$this->f3->SET('POST.temp_work_agency_date_to', '9999-12-31');

			$this->f3->SET('POST.temp_work_division_date_from', $date);
			$this->f3->SET('POST.temp_work_division_date_to', '9999-12-31');

			$this->f3->SET('POST.temp_work_divunit_date_from', $date);
			$this->f3->SET('POST.temp_work_divunit_date_to', '9999-12-31');

			$this->f3->SET('POST.temp_work_position_date_from', $date);
			$this->f3->SET('POST.temp_work_position_date_to', '9999-12-31');

			$this->f3->SET('POST.temp_work_grade_date_from', $date);
			$this->f3->SET('POST.temp_work_grade_date_to', '9999-12-31');

			$this->f3->SET('POST.temp_work_step_date_from', $date);
			$this->f3->SET('POST.temp_work_step_date_to', '9999-12-31');

			$this->f3->SET('POST.temp_work_salary_from', $date);
			$this->f3->SET('POST.temp_work_salary_to', '9999-12-31');

			$this->f3->SET('POST.temp_work_employment_type_date_from', $date);
			$this->f3->SET('POST.temp_work_employment_type_date_to', '9999-12-31');

			$this->f3->SET('POST.temp_work_reporting_to_date_from', $date);
			$this->f3->SET('POST.temp_work_reporting_to_date_to', '9999-12-31');


			$oWork->add($this->f3->GET('POST'));

			copy("public/employee/picture/unknown.png","public/employee/picture/".$hashCode.".png");
			$status = true;
		} catch (PDOException $e) {
			$status = false;
			$msgContent = $e->getMessage();
			$msgTitle = "Error Encountered";
			$icon = 'error';
		}
		echo json_encode(array('status'=>$status, 'msgTitle'=>$msgTitle,'msgContent'=>$msgContent, 'icon'=>$icon));
		die;
	}

	public function edit() {

		$status = false;
		$msgTitle = "Error";
		$msgContent = "error found during saving.";
		$temp_id = $this->f3->GET('POST.temp_id');

		if ($temp_id ===0) {
			$msgContent = "Employee system ID modified, please contact the developer.";
			echo json_encode(array('status'=>$status, 'msgTitle'=>$msgTitle,'msgContent'=>$msgContent,'icon'=>'error'));
			die;
		}
		$fldVal = $this->f3->GET('POST.philsys_id');
		$oTemp = new temp($this->db);
		$isDuplicate = $oTemp->findDuplicate('philsys_id', $fldVal, $temp_id);

		if ($isDuplicate) {
			$msgContent = "Duplicate Philsys ID detected.";
			echo json_encode(array('status'=>$status, 'msgTitle'=>$msgTitle,'msgContent'=>$msgContent,'icon'=>'error'));
			die;
		}

		$status = true;
		$msgTitle = "Success";
		$msgContent = "Update done successfully";
		$icon="success";
		//get the lastest employee work_id
		try {
		//find the employee id
		$otemp = new temp($this->db);
		$oTemp->updatePerson($temp_id);

		$oWork = new temp_work($this->db);
		$resWork = $oWork->tempCurrentWork($temp_id);
		$oWork->edit($resWork[0]['temp_work_id'], $this->f3->GET('POST'));

		} catch (PDOException $e) {
			$status = false;
			$msgContent = $e->getMessage();
			$msgTitle = "Error Encountered";
			$icon="error";
		}

		echo json_encode(array('status'=>$status, 'msgTitle'=>$msgTitle,'msgContent'=>$msgContent,'icon'=>$icon));
		die;

	}

	public function Delete() {
		$id = $this->f3->GET('POST.temp_id');
		$oTemp = new temp($this->db);
	
		$errMsg = "";
		$error = false;
		try {
			$lastId = $oTemp->deleteEmployee($id);
		} catch (PDOException $e) {
			//There are active records in child table
			$errMsg = $e->getMessage();
			$error = true;
		}
	
		if ($error) {
			echo json_encode(array('status'=>false, 'msgContent'=>$errMsg, 'msgTitle'=>'Error', 'icon'=>'error'));
	
		} else {
			echo json_encode(array('status'=>true, 'msgContent'=>"Employee deleted successfully", 'msgTitle'=>'success', 'icon'=>'success'));
	
		}
		die;
	}

	public function search() {

	}


	private function setEmptyDateToNull() {
		$doi = $this->f3->GET('POST.philsys_doi');
		$atmExpire = $this->f3->GET('POST.temp_bank_expire');

		if ($doi =='') {
			$this->f3->SET('POST.philsys_doi', null);
		}

		if ($atmExpire =='') {
			$this->f3->SET('POST.temp_bank_expire', null);
		}
	}

	public function getReportingTo() {
		$oTemp = new temp($this->db);
		$resTemp = $oTemp->getReportingTo(1, $this->f3->GET('POST.excluded'));

		$data = [];
		for($i=0;$i<count($resTemp);$i++) {
			$data[] = array('id'=>$resTemp[$i]['temp_id'], 'text'=>$resTemp[$i]['fullName']);
		}
		echo json_encode($data);
		die;
	}

	public function validate() {
		$params = $this->f3->GET('POST');
		$aFld = [];
		$aVal = [];

		foreach($params as $key=>$val) {
			$aFld[] = $key;
			$aVal[] = $val;
		}
		$oTemp = new temp($this->db);

		//find the field and the value
		//0 means we are adding new record
		if ($aVal[1] ==='0') {
			$res = $oTemp->findFieldValue($aFld[0], $aVal[0]);
			echo ((count($res) == 0 ) ? "true" : "false");

		} else {
			//we are in editing mode
			$res = $oTemp->findFieldValue($aFld[0], $aVal[0]);
			if (count($res) == 0) {
				echo "true";
			} else {
				echo (($res[0]['temp_id'] == $aVal[1] ) ? "true" : "false");
			}
		}

		die;
	}

	public function findHash() {
		$hashCode=$this->f3->GET('POST.temp_hashcode');
		$oTemp = new temp($this->db);
		$res = $oTemp->findHash($hashCode);

		$oWork = new temp_work($this->db);
		$resWork = $oWork->getWorkByTempID($res[0]['temp_id']);

		echo json_encode(array('details'=>$res, 'works'=>$resWork));
		die;
	}

	private function findDuplicateName($obj, $posted){
		$res = $obj.findDuplicateName($this->f3->GET('POST.temp_first'),
									  $this->f3->GET('POST.temp_mid'),
									  $this->f3->GET('POST.temp_last'),
									  $this->f3->GET('POST.temp_suffice'),
									  $this->f3->GET('POST.temp_dob'));
		$totalCount = count($res);
		if ($posted['temp_id'] == '0') {
			if ($totalCount > 0 ) {
				return true;
			} else {
				return false;
			}
		} else {
			if ($posted['temp_id'] != $res[0]['temp_id']) {
				return true;
			} else {
				return false;
			}
		}
		die;
	}
	public function getEmployeeList() {
		$oTemp = new temp($this->db);
		$result = $oTemp-> getEmployeeList();
		$data = [];
		for($i=0;$i<count($result);$i++) {
			$data[] = array('id'=>$result[$i]['temp_id'], 'text'=>$result[$i]['fullName']);
		}

		echo json_encode($data);
		die;
	}
}