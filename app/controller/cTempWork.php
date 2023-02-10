<?php

/*
*
* frontpage of main controller when user login
*/



class cTempWork extends cau {

	public function getWorkByTempID() {
		$temp_id = $this->f3->GET('POST.temp_id');
		$oTempWork = new temp_work($this->db);
		$resData = $oTempWork->getWorkByTempID($temp_id);

		echo json_encode($resData);
		die;
	}

	public function updatedup() {

		date_default_timezone_set('Asia/Manila');
		$tempworkid = $this->f3->GET('POST.temp_work_id');
		$tempid = $this->f3->GET('POST.transferTempID');

		$oldDiv = $this->f3->GET('POST.currentDivision');
		$oldSec = $this->f3->GET('POST.currentDivUnit');
		$oldRepTo = $this->f3->GET('POST.currentReportingTo');

		$newDiv = $this->f3->GET('POST.ddNewDivision');
		$newDivUnit = $this->f3->GET('POST.ddNewDivUnit');
		$newRepTo = $this->f3->GET('POST.ddNewReportingTo');

		$oWork = new temp_work($this->db);
		$resTop = $oWork->tempCurrentWork($tempid);
		$newTop =  new ArrayObject($resTop[0]);
		$currentTop =  new ArrayObject($resTop[0]);

		unset($newTop['temp_work_id']);
		unset($newTop['temp_work_created']);
		unset($newTop['temp_work_updated']);
		unset($currentTop['temp_work_id']);
		unset($currentTop['temp_work_created']);
		unset($currentTop['temp_work_updated']);
		// var_dump($currentTop);

		if ($oldDiv != $newDiv)  {

			$newTop['rdivision_id'] = $newDiv;
			$newTop['temp_work_division_date_from']= date('Y-m-d');
			$newTop['temp_work_division_date_to']= '9999-12-31';

			$currentTop['temp_work_division_date_to']= date('Y-m-d', strtotime("yesterday"));
		} else {
			$newTop['rdivision_id'] = $newDiv;
		}

		if ($oldSec != $newDivUnit)  {
			$newTop['rdivunit_id'] = $newDivUnit;
			$newTop['temp_work_divunit_date_from']= date('Y-m-d');
			$newTop['temp_work_divunit_date_to']= '9999-12-31';

			$currentTop['temp_work_divunit_date_to']= date('Y-m-d', strtotime("yesterday"));
		}

		if ($oldRepTo != $newRepTo)  {
			$newTop['temp_work_reporting_to_id'] = $newRepTo;
			$newTop['temp_work_reporting_to_date_from']= date('Y-m-d');
			$newTop['temp_work_reporting_to_date_to']= '9999-12-31';

			$currentTop['temp_work_reporting_to_date_to']= date('Y-m-d', strtotime("yesterday"));
		}

		if ($oldDiv != $newDiv || $oldSec != $newDivUnit || $oldRepTo != $newRepTo)  {
			$newTop['temp_work_position_date_to']= '9999-12-31';
			$newTop['temp_work_grade_date_to']= '9999-12-31';
			$newTop['temp_work_step_date_to']= '9999-12-31';
			$newTop['temp_work_salary_to']= '9999-12-31';
			$newTop['temp_work_employment_type_date_to']= '9999-12-31';
			$newTop['temp_work_reporting_to_date_to']= '9999-12-31';

			$currentTop['temp_work_position_date_to']= date('Y-m-d', strtotime("yesterday"));
			$currentTop['temp_work_grade_date_to']= date('Y-m-d', strtotime("yesterday"));
			$currentTop['temp_work_step_date_to']= date('Y-m-d', strtotime("yesterday"));
			$currentTop['temp_work_salary_to']= date('Y-m-d', strtotime("yesterday"));
			$currentTop['temp_work_employment_type_date_to']= date('Y-m-d', strtotime("yesterday"));
			$currentTop['temp_work_reporting_to_date_to']= date('Y-m-d', strtotime("yesterday"));
		}

		$status = true;
		$msgContent = "Update of Work done successfully";
		$msgTitle = "Success";
		try {
			$oWork->add((array)$newTop);
			$oWork->edit($tempworkid, (array)$currentTop);
		} catch (PDOException $e) {
			$status = false;
			$msgContent = $e->getMessage();
			$msgTitle = "Error Encountered";
		}

		echo json_encode(array('status'=>$status, 'msgTitle'=>$msgTitle,'msgContent'=>$msgContent));

		die;


	}

	public function updateEmploymentType() {

		date_default_timezone_set('Asia/Manila');
		$tempworkid = $this->f3->GET('POST.EmploymentTypeTempWorkID');
		$tempid = $this->f3->GET('POST.EmploymentTypeTempID');

		$oldEmploymentType = $this->f3->GET('POST.currentEmploymentType');
		$newEmploymentType = $this->f3->GET('POST.ddNewEmploymentType');


		$oWork = new temp_work($this->db);
		$resTop = $oWork->tempCurrentWork($tempid);
		$newTop =  new ArrayObject($resTop[0]);
		$currentTop =  new ArrayObject($resTop[0]);


		unset($newTop['temp_work_id']);
		unset($newTop['temp_work_created']);
		unset($newTop['temp_work_updated']);
		unset($currentTop['temp_work_id']);
		unset($currentTop['temp_work_created']);
		unset($currentTop['temp_work_updated']);
		// var_dump($currentTop);

		$status = true;
		$msgContent = "Update of Employment Type done successfully";
		$msgTitle = "Success";

		if ($oldEmploymentType != $newEmploymentType)  {
			$newTop['remployment_type_id']= $newEmploymentType;

			$newTop['temp_work_agency_date_from']= date('Y-m-d');
			$newTop['temp_work_division_date_from']= date('Y-m-d');
			$newTop['temp_work_divunit_date_from']= date('Y-m-d');
			$newTop['temp_work_position_date_from']= date('Y-m-d');
			$newTop['temp_work_grade_date_from']= date('Y-m-d');
			$newTop['temp_work_step_date_from']= date('Y-m-d');
			$newTop['temp_work_salary_from']= date('Y-m-d');
			$newTop['temp_work_employment_type_date_from']= date('Y-m-d');
			$newTop['temp_work_reporting_to_date_from']= date('Y-m-d');

			$newTop['temp_work_agency_date_to']= '9999-12-31';
			$newTop['temp_work_division_date_to']= '9999-12-31';
			$newTop['temp_work_divunit_date_to']= '9999-12-31';
			$newTop['temp_work_position_date_to']= '9999-12-31';
			$newTop['temp_work_grade_date_to']= '9999-12-31';
			$newTop['temp_work_step_date_to']= '9999-12-31';
			$newTop['temp_work_salary_to']= '9999-12-31';
			$newTop['temp_work_employment_type_date_to']= '9999-12-31';
			$newTop['temp_work_reporting_to_date_to']= '9999-12-31';

			$currentTop['temp_work_agency_date_to']= date('Y-m-d', strtotime("yesterday"));
			$currentTop['temp_work_division_date_to']= date('Y-m-d', strtotime("yesterday"));
			$currentTop['temp_work_divunit_date_to']= date('Y-m-d', strtotime("yesterday"));
			$currentTop['temp_work_position_date_to']= date('Y-m-d', strtotime("yesterday"));
			$currentTop['temp_work_grade_date_to']= date('Y-m-d', strtotime("yesterday"));
			$currentTop['temp_work_step_date_to']= date('Y-m-d', strtotime("yesterday"));
			$currentTop['temp_work_salary_to']= date('Y-m-d', strtotime("yesterday"));
			$currentTop['temp_work_employment_type_date_to']= date('Y-m-d', strtotime("yesterday"));
			$currentTop['temp_work_reporting_to_date_to']= date('Y-m-d', strtotime("yesterday"));

			try {
				$oWork->add((array)$newTop);
				$oWork->edit($tempworkid, (array)$currentTop);
			} catch (PDOException $e) {
				$status = false;
				$msgContent = $e->getMessage();
				$msgTitle = "Error Encountered";
			}
		} else {
			$status = true;
			$msgContent = "No changes done";
			$msgTitle = "Note";
		}

		echo json_encode(array('status'=>$status, 'msgTitle'=>$msgTitle,'msgContent'=>$msgContent));

		die;


	}

	public function updateEmployeePosition() {

		date_default_timezone_set('Asia/Manila');
		$tempid = $this->f3->GET('POST.EmployeePositionTempID');
		$tempworkid = $this->f3->GET('POST.EmployeePositionTempWorkID');
		$oldJob = $this->f3->GET("POST.currentJobPosition");
		$oldGrade = $this->f3->GET("POST.currentGrade");
		$oldStep = $this->f3->GET("POST.currentStep");
		$oldSalary = $this->f3->GET("POST.currentSalary");
		$newJob = $this->f3->GET("POST.ddNewJobPosition");
		$newGrade = $this->f3->GET("POST.newGrade");
		$newStep = $this->f3->GET("POST.newStep");
		$newSalary = $this->f3->GET("POST.newSalary");


		$oWork = new temp_work($this->db);
		$resTop = $oWork->tempCurrentWork($tempid);
		$newTop =  new ArrayObject($resTop[0]);
		$currentTop =  new ArrayObject($resTop[0]);

		unset($newTop['temp_work_id']);
		unset($newTop['temp_work_created']);
		unset($newTop['temp_work_updated']);
		unset($currentTop['temp_work_id']);
		unset($currentTop['temp_work_created']);
		unset($currentTop['temp_work_updated']);

		if ($oldJob != $newJob) {
			$newTop['rposition_id'] = $newJob;
			$newTop['temp_work_position_date_from']= date('Y-m-d');
		}

		if ($oldGrade != $newGrade) {
			$newTop['rgradestep_gradeno'] = $newGrade;
			$newTop['temp_work_grade_date_from']= date('Y-m-d');
		}

		if ($oldStep != $newStep) {
			$newTop['rgradestep_stepno'] = $newStep;
			$newTop['temp_work_step_date_from']= date('Y-m-d');

		}

		if ($oldSalary != $newSalary) {
			$newTop['rgradestep_salary'] = $newSalary;
			$newTop['temp_work_salary_from']= date('Y-m-d');

		}

		if ($oldSalary != $newSalary || $oldJob != $newJob || $oldGrade != $newGrade || $oldStep != $newStep) {

			$newTop['temp_work_agency_date_to']= '9999-12-31';
			$currentTop['temp_work_agency_date_to']= date('Y-m-d', strtotime("yesterday"));

			$newTop['temp_work_division_date_to']= '9999-12-31';
			$currentTop['temp_work_division_date_to']= date('Y-m-d', strtotime("yesterday"));

			$newTop['temp_work_divunit_date_to']= '9999-12-31';
			$currentTop['temp_work_divunit_date_to']= date('Y-m-d', strtotime("yesterday"));

			$newTop['temp_work_employment_type_date_to']= '9999-12-31';
			$currentTop['temp_work_employment_type_date_to']= date('Y-m-d', strtotime("yesterday"));

			$newTop['temp_work_reporting_to_date_to']= '9999-12-31';
			$currentTop['temp_work_reporting_to_date_to']= date('Y-m-d', strtotime("yesterday"));

			$newTop['temp_work_salary_to']= '9999-12-31';
			$currentTop['temp_work_salary_to']= date('Y-m-d', strtotime("yesterday"));

			$newTop['temp_work_step_date_to']= '9999-12-31';
			$currentTop['temp_work_step_date_to']= date('Y-m-d', strtotime("yesterday"));

			$newTop['temp_work_grade_date_to']= '9999-12-31';
			$currentTop['temp_work_grade_date_to']= date('Y-m-d', strtotime("yesterday"));

			$newTop['temp_work_position_date_to']= '9999-12-31';
			$currentTop['temp_work_position_date_to']= date('Y-m-d', strtotime("yesterday"));
		}

		$status = true;
		$msgContent = "Update of Position done successfully";
		$msgTitle = "Success";
		try {
			$oWork->add((array)$newTop);
			$oWork->edit($tempworkid, (array)$currentTop);
		} catch (PDOException $e) {
			$status = false;
			$msgContent = $e->getMessage();
			$msgTitle = "Error Encountered";
		}

		echo json_encode(array('status'=>$status, 'msgTitle'=>$msgTitle,'msgContent'=>$msgContent));
		die;
	}

	public function history() {
		if($this->f3->VERB=='GET') {

			$oUserMenu = new menu_skote();
			$menu = $oUserMenu->loadMenu();

			$this->f3->SET('sidebar', $menu);
			$this->f3->set('content','/page/hr/details/employeeWorkHistory.html');
			$this->f3->set('layout','/page/layout.html');

		} else {
			$oWorkHist = new temp_work($this->db);
			$resWorkHist = $oWorkHist->tempWorkHistory($this->f3->GET('SESSION.temp_id'));
	
			$aWorkHist = [];
			for($i=0;$i<count($resWorkHist);$i++) {
				$division = '<div class="text-wrap wrap-200">';
				$division .='<address>';
				$division .='<strong>'.$resWorkHist[$i]['rdivision_name'].'</strong><br>';
				$division .='<span class="badge bg-success">'.$resWorkHist[$i]['temp_work_division_date_from'].'</span><br><span class="badge bg-info">'.$resWorkHist[$i]['temp_work_division_date_to'].'</span>';
				$division .='</address>';
				$division .='</div>';
				
				$unit = '<div class="text-wrap wrap-200">';
				$unit .='<address>';
				$unit .='<strong>'.$resWorkHist[$i]['rdivision_sectionunit_name'].'</strong><br>';
				$unit .='<span class="badge bg-success">'.$resWorkHist[$i]['temp_work_divunit_date_from'].'</span><br><span class="badge bg-info">'.$resWorkHist[$i]['temp_work_divunit_date_to'].'</span>';
				$unit .='</address>';
				$unit .='</div>';

				$position = '<div class="text-wrap wrap-200">';
				$position .='<address>';
				$position .='<strong>'.$resWorkHist[$i]['rposition_name'].'</strong><br>';
				$position .='<span class="badge bg-success">'.$resWorkHist[$i]['temp_work_position_date_from'].'</span><br><span class="badge bg-info">'.$resWorkHist[$i]['temp_work_position_date_to'].'</span>';
				$position .='</address>';
				$position .='</div>';

				$grade = '<div class="text-wrap wrap-200">';
				$grade .='<address>';
				$grade .='<strong>'.$resWorkHist[$i]['rgradestep_gradeno'].'</strong><br>';
				$grade .='<span class="badge bg-success">'.$resWorkHist[$i]['temp_work_grade_date_from'].'</span><br><span class="badge bg-info">'.$resWorkHist[$i]['temp_work_grade_date_to'].'</span>';
				$grade .='</address>';
				$grade .='</div>';

				$step = '<div class="text-wrap wrap-200">';
				$step .='<address>';
				$step .='<strong>'.$resWorkHist[$i]['rgradestep_stepno'].'</strong><br>';
				$step .='<span class="badge bg-success">'.$resWorkHist[$i]['temp_work_step_date_from'].'</span><br><span class="badge bg-info">'. $resWorkHist[$i]['temp_work_step_date_to'].'</span>';
				$step .='</address>';
				$step .='</div>';

				$salary = '<div class="text-wrap wrap-200">';
				$salary .='<address>';
				$salary .='<strong>'.$resWorkHist[$i]['rgradestep_salary'].'</strong><br>';
				$salary .='<span class="badge bg-success">'.$resWorkHist[$i]['temp_work_salary_from'].'</span><br><span class="badge bg-info">'.$resWorkHist[$i]['temp_work_salary_to'].'</span>';
				$salary .='</address>';
				$salary .='</div>';

				$empType = '<div class="text-wrap wrap-200">';
				$empType .='<address>';
				$empType .='<strong>'.$resWorkHist[$i]['remployment_type_desc'].'</strong><br>';
				$empType .='<span class="badge bg-success">'.$resWorkHist[$i]['temp_work_employment_type_date_from'].'</span><br><span class="badge bg-info">'.$resWorkHist[$i]['temp_work_employment_type_date_to'].'</span>';
				$empType .='</address>';
				$empType .='</div>';

				$reportingTo = '<div class="text-wrap wrap-200">';
				$reportingTo .='<address>';
				$reportingTo .='<strong>'.$resWorkHist[$i]['reportingTo'].'</strong><br>';
				$reportingTo .='<span class="badge bg-success">'.$resWorkHist[$i]['temp_work_reporting_to_date_from'].'</span><br><span class="badge bg-info">'.$resWorkHist[$i]['temp_work_reporting_to_date_to'].'</span>';
				$reportingTo .='</address>';
				$reportingTo .='</div>';

				$aWorkHist[] = array(
					'temp_work_id'=>$resWorkHist[$i]['temp_work_id'],
					'division'=>$division,
					'unit'=>$unit,
					'position'=>$position,
					'grade'=>$grade,
					'step'=>$step,
					'salary'=>$salary,
					'empType'=>$empType,
					'reportingTo'=>$reportingTo
				);
			}
			echo json_encode(array('workhistory'=>$aWorkHist));
			die;
		}
	}
}