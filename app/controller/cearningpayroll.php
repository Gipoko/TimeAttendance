<?php

/*
*
* frontpage of main controller when user login
*/
class cearningpayroll extends cau {
	
	public function list() {
		$id = $this->f3->GET('POST.temp_id');
    $oEarning = new temp_earning($this->db);
		$resEarning = $oEarning->list($id);
		$data = [];
		for($i=0;$i<count($resEarning);$i++) {
			$data[] = array('id'=>$resEarning[$i]['temp_earning_id'], 'text'=>$resEarning[$i]['rearning_code']);
		}
        
		echo json_encode(array('earnings'=>$this->getList()));
		die;
	}

public function add() {
		$oEarning = new temp_earning($this->db);
		$oEarning->add($this->f3->GET('POST'));
		echo json_encode(array('earnings'=>$this->getList()));
		die;
	}

	public function edit() {
		$oEarning = new temp_earning($this->db);
        $oEarning->edit($this->f3->GET('POST.temp_earning_id'), $this->f3->GET('POST'));
		$id = $this->f3->GET('POST.temp_id');
		echo json_encode(array('earnings'=>$this->getList($id)));
		die;
	}

	public function delete() {
		$oEarning = new temp_earning($this->db);
        $oEarning->delete($this->f3->GET('POST.temp_earning_id'));
		$id = $this->f3->GET('POST.temp_id');
		echo json_encode(array('earnings'=>$this->getList($id)));
		die;
	}

	public function getList() {
		$id = $this->f3->GET('POST.temp_id');
		$oEarning = new temp_earning($this->db);
		$researnings = $oEarning->list($id);

		$aearnings = [];
		for($i=0;$i<count($researnings);$i++) {
			$action = '<div class="button-items">

			<button type="button"
			data-id="'.$researnings[$i]['temp_earning_id'].'"
			data-rearning_code="'.$researnings[$i]['rearning_code'].'" 
            data-rearning_default_amt="'.$researnings[$i]['rearning_default_amt'].'" 
            data-rearning_percentage_tax="'.$researnings[$i]['rearning_percentage_tax'].'"
			 data-rearning_taxtotal="'.$researnings[$i]['rearning_taxtotal'].'"  
            data-rearning_additional="'.$researnings[$i]['rearning_additional'].'"
			 data-rearning_addtotal="'.$researnings[$i]['rearning_addtotal'].'"
			 data-rearning_start_date="'.$researnings[$i]['rearning_start_date'].'"
			 data-rearning_end_date="'.$researnings[$i]['rearning_end_date'].'"   
			class="btn btnEarningEdit">
				<i class="fas fa-edit  font-size-12 align-top"></i></button>
			<button type="button"
			data-id="'.$researnings[$i]['temp_earning_id'].'"
			data-rearning_code="'.$researnings[$i]['rearning_code'].'" 
            data-rearning_default_amt="'.$researnings[$i]['rearning_default_amt'].'" 
            data-rearning_percentage_tax="'.$researnings[$i]['rearning_percentage_tax'].'"
			 data-rearning_taxtotal="'.$researnings[$i]['rearning_taxtotal'].'"  
            data-rearning_additional="'.$researnings[$i]['rearning_additional'].'"
			 data-rearning_addtotal="'.$researnings[$i]['rearning_addtotal'].'"
			 data-rearning_start_date="'.$researnings[$i]['rearning_start_date'].'"
			 data-rearning_end_date="'.$researnings[$i]['rearning_end_date'].'"  
			class="btn btnEarningDelete">
				<i class="fas fa-eraser font-size-12 align-top"></i></button>
		</div>';

			$aearnings[] = array(
				'temp_earning_id'=>$researnings[$i]['temp_earning_id'],
                'rearning_code'=>$researnings[$i]['rearning_code'],
                'rearning_default_amt'=>$researnings[$i]['rearning_default_amt'],
                'rearning_percentage_tax'=>$researnings[$i]['rearning_percentage_tax'],
				'rearning_taxtotal'=>$researnings[$i]['rearning_taxtotal'],
                'rearning_additional'=>$researnings[$i]['rearning_additional'],
				'rearning_addtotal'=>$researnings[$i]['rearning_addtotal'],
				'rearning_start_date'=>$researnings[$i]['rearning_start_date'],
				'rearning_end_date'=>$researnings[$i]['rearning_end_date'],
				'action'=>$action
			);
		}
		return $aearnings;
	}
}