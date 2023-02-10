<?php

/*
*
* frontpage of main controller when user login
*/
class cGradeStep extends cau {

	public function findGradeStep() {
		$grade = $this->f3->GET('POST.gradeno');
		$step = $this->f3->GET('POST.stepno');

		if ($grade == '' || $step == '') {
			echo json_encode(array('rgradestep_salary'=>0));
			die;
		}
		$year = date('Y');
		$oList = new rGradeStep($this->db);
		$resGradeNo = $oList->findGradeStep($grade, $step, $year);

		echo json_encode($resGradeNo[0]);
		die;
	}
}