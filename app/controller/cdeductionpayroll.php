<?php

/*
*
* frontpage of main controller when user login
*/
class cdeductionpayroll extends cau {
	
	public function list() {

        

		$oDeduction = new temp_deduction($this->db);
		$resDeduction = $oDeduction->list();
		$data = [];
		for($i=0;$i<count($resDeduction);$i++) {
			$data[] = array('id'=>$resDeduction[$i]['temp_deduction_id'], 'text'=>$resDeduction[$i]['rdeduction_code']);
		}
        
		echo json_encode(array('deductions'=>$this->getList()));
		die;
	}

public function add() {
		$oDeduction = new temp_deduction($this->db);
		$oDeduction->add($this->f3->GET('POST'));
		$temp_id = $this->f3->GET('POST.temp_id');
		echo json_encode(array('deductions'=>$this->getList($temp_id)));
		die;
	}

	public function edit() {
		$oDeduction = new temp_deduction($this->db);
		$temp_id = $this->f3->GET('POST.temp_id');
		$oDeduction->edit($this->f3->GET('POST.temp_deduction_id'), $this->f3->GET('POST'));
		echo json_encode(array('deductions'=>$this->getList($temp_id)));
		die;
	}

	public function delete() {
		$temp_id = $this->f3->GET('POST.temp_id');

		$oDeduction = new temp_deduction($this->db);

		$oDeduction->delete($this->f3->GET('POST.temp_deduction_id'));
		echo json_encode(array('deductions'=>$this->getList($temp_id)));
		die;
	}

	public function getList($tempId) {
		$oDeduction = new temp_deduction($this->db);
		$resdeductions = $oDeduction->list($tempId);

		$adeductions = [];
		for($i=0;$i<count($resdeductions);$i++) {
			$action = '<div class="button-items">

			<button type="button"
			data-id="'.$resdeductions[$i]['temp_deduction_id'].'"
			data-rdeduction_code="'.$resdeductions[$i]['rdeduction_code'].'" 
            data-rdeduction_default_amt="'.$resdeductions[$i]['rdeduction_default_amt'].'" 
            data-rdeduction_percentage_tax="'.$resdeductions[$i]['rdeduction_percentage_tax'].'"
			data-rdeduction_taxtotal="'.$resdeductions[$i]['rdeduction_taxtotal'].'" 
            data-rdeduction_additional="'.$resdeductions[$i]['rdeduction_additional'].'"
			data-rdeduction_addtotal="'.$resdeductions[$i]['rdeduction_addtotal'].'" 
			data-rdeduction_start_date="'.$resdeductions[$i]['rdeduction_start_date'].'"
			data-rdeduction_end_date="'.$resdeductions[$i]['rdeduction_end_date'].'"
			class="btn btnDeductionEdit">
				<i class="fas fa-edit  font-size-12 align-top"></i></button>
			<button type="button"
			data-id="'.$resdeductions[$i]['temp_deduction_id'].'"
			data-rdeduction_code="'.$resdeductions[$i]['rdeduction_code'].'" 
            data-rdeduction_default_amt="'.$resdeductions[$i]['rdeduction_default_amt'].'" 
            data-rdeduction_percentage_tax="'.$resdeductions[$i]['rdeduction_percentage_tax'].'"
			data-rdeduction_taxtotal="'.$resdeductions[$i]['rdeduction_taxtotal'].'" 
            data-rdeduction_additional="'.$resdeductions[$i]['rdeduction_additional'].'"
			data-rdeduction_addtotal="'.$resdeductions[$i]['rdeduction_addtotal'].'" 
			data-rdeduction_start_date="'.$resdeductions[$i]['rdeduction_start_date'].'"
			data-rdeduction_end_date="'.$resdeductions[$i]['rdeduction_end_date'].'"
			class="btn btnDeductionDelete">
				<i class="fas fa-eraser font-size-12 align-top"></i></button>
		</div>';

			$adeductions[] = array(
				'temp_deduction_id'=>$resdeductions[$i]['temp_deduction_id'],
                'rdeduction_code'=>$resdeductions[$i]['rdeduction_code'],
                'rdeduction_default_amt'=>$resdeductions[$i]['rdeduction_default_amt'],
                'rdeduction_percentage_tax'=>$resdeductions[$i]['rdeduction_percentage_tax'],
				'rdeduction_taxtotal'=>$resdeductions[$i]['rdeduction_taxtotal'],
                'rdeduction_additional'=>$resdeductions[$i]['rdeduction_additional'],
				'rdeduction_addtotal'=>$resdeductions[$i]['rdeduction_addtotal'],
				'rdeduction_start_date'=>$resdeductions[$i]['rdeduction_start_date'],
				'rdeduction_end_date'=>$resdeductions[$i]['rdeduction_end_date'],
				'action'=>$action
			);
		}
		return $adeductions;
	}

	public function getDeductionsList() {
		$temp_id = $this->f3->GET('POST.temp_id');
		$result = $this->getList($temp_id);
		echo json_encode(array('deductions'=>$result));
		die;
	}
}