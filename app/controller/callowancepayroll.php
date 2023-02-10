<?php

/*
*
* frontpage of main controller when user login
*/
class callowancepayroll extends cau {
	
	public function list() {
		
		$id = $this->f3->GET('POST.temp_id');
		$oAllowance = new temp_allowance($this->db);
		$resAllowance = $oAllowance->list($id);
		$data = [];
		for($i=0;$i<count($resAllowance);$i++) {
			$data[] = array('id'=>$resAllowance[$i]['temp_allowance_id'], 'text'=>$resAllowance[$i]['rallowance_code']);
		}
        
		$id = $this->f3->GET('POST.temp_id');
		echo json_encode(array('allowances'=>$this->getList($id)));
		die;
	}

public function add() {
	
		$oAllowance = new temp_allowance($this->db);
		$oAllowance->add($this->f3->GET('POST'));
		$id = $this->f3->GET('POST.temp_id');
		echo json_encode(array('allowances'=>$this->getList($id)));
		die;
	}

	public function edit() {
		$oAllowance = new temp_allowance($this->db);

		$oAllowance->edit($this->f3->GET('POST.temp_allowance_id'), $this->f3->GET('POST'));
		$id = $this->f3->GET('POST.temp_id');
		echo json_encode(array('allowances'=>$this->getList($id)));
		die;
	}

	public function delete() {
		$oAllowance = new temp_allowance($this->db);

		$oAllowance->delete($this->f3->GET('POST.temp_allowance_id'));
		$id = $this->f3->GET('POST.temp_id');
		echo json_encode(array('allowances'=>$this->getList($id)));
		die;
	}

	public function getList($id) {

		$oAllowance = new temp_allowance($this->db);
		$resallowances = $oAllowance->list($id);

		$aallowances = [];
		for($i=0;$i<count($resallowances);$i++) {
			$action = '<div class="button-items">

			<button type="button"
			data-id="'.$resallowances[$i]['temp_allowance_id'].'"
			data-rallowance_code="'.$resallowances[$i]['rallowance_code'].'" 
            data-rallowance_default_amt="'.$resallowances[$i]['rallowance_default_amt'].'" 
            data-rallowance_percentage_tax="'.$resallowances[$i]['rallowance_percentage_tax'].'"
			data-rallowance_taxtotal="'.$resallowances[$i]['rallowance_taxtotal'].'" 
            data-rallowance_additional="'.$resallowances[$i]['rallowance_additional'].'"
			data-rallowance_addtotal="'.$resallowances[$i]['rallowance_addtotal'].'"
			data-rallowance_start_date="'.$resallowances[$i]['rallowance_start_date'].'"
			data-rallowance_end_date="'.$resallowances[$i]['rallowance_end_date'].'" 
			class="btn btnAllowanceEdit">
				<i class="fas fa-edit  font-size-12 align-top"></i></button>
			<button type="button"
			data-id="'.$resallowances[$i]['temp_allowance_id'].'"
			data-rallowance_code="'.$resallowances[$i]['rallowance_code'].'" 
            data-rallowance_default_amt="'.$resallowances[$i]['rallowance_default_amt'].'" 
            data-rallowance_percentage_tax="'.$resallowances[$i]['rallowance_percentage_tax'].'"
			data-rallowance_taxtotal="'.$resallowances[$i]['rallowance_taxtotal'].'" 
            data-rallowance_additional="'.$resallowances[$i]['rallowance_additional'].'"
			data-rallowance_addtotal="'.$resallowances[$i]['rallowance_addtotal'].'"
			data-rallowance_start_date="'.$resallowances[$i]['rallowance_start_date'].'"
			data-rallowance_end_date="'.$resallowances[$i]['rallowance_end_date'].'" 
			class="btn btnAllowanceDelete">
				<i class="fas fa-eraser font-size-12 align-top"></i></button>
		</div>';

			$aallowances[] = array(
				'temp_allowance_id'=>$resallowances[$i]['temp_allowance_id'],
                'rallowance_code'=>$resallowances[$i]['rallowance_code'],
                'rallowance_default_amt'=>$resallowances[$i]['rallowance_default_amt'],
                'rallowance_percentage_tax'=>$resallowances[$i]['rallowance_percentage_tax'],
				'rallowance_taxtotal'=>$resallowances[$i]['rallowance_taxtotal'],
                'rallowance_additional'=>$resallowances[$i]['rallowance_additional'],
				'rallowance_addtotal'=>$resallowances[$i]['rallowance_addtotal'],
				'rallowance_start_date'=>$resallowances[$i]['rallowance_start_date'],
				'rallowance_end_date'=>$resallowances[$i]['rallowance_end_date'],
				'action'=>$action
			);
		}
		return $aallowances;
	}

	public function getAllowanceList() {
		$id = $this->f3->GET('POST.temp_id');
		$result = $this->getList($id);
		echo json_encode(array('allowances'=>$result));
		die;
	}
}