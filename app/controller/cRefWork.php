<?php

/*
*/

class cRefWork extends authenticatedController {

	public function getRefWork() {

		$ocRefWork = new refWork();
		$resDivision = $ocRefWork->getDivision();
		$resSectionUnit = $ocRefWork->getSectionUnit();
		$resPosition = $ocRefWork->getPosition();
		$resGradeStep = $ocRefWork->getGradeStep();

		echo json_encode(array(
			'divisions'=>$resDivision,
			'sectionunits'=>$resSectionUnit,
			'positions'=>$resPosition,
			'gradessteps'=>$resGradeStep
		));
		die;
	}

}