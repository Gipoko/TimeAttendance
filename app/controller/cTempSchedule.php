<?php

/*
*
* frontpage of main controller when user login
*/
class cTempSchedule extends cau {
	
	public function list() {
		
		$id = $this->f3->GET('POST.temp_id');
		$oSchedule = new temp_schedule($this->db);
		$resSchedule = $oSchedule->list($id);
		$data = [];
		for($i=0;$i<count($resSchedule);$i++) {
			$data[] = array('id'=>$resSchedule[$i]['temp_schedule_id'], 'text'=>$resSchedule[$i]['rsched_name']);
		}
        
		$id = $this->f3->GET('POST.temp_id');
		echo json_encode(array('schedules'=>$this->getList($id)));
		die;
	}

public function add() {
	
		$oSchedule = new temp_schedule($this->db);
		$oSchedule->add($this->f3->GET('POST'));
		$id = $this->f3->GET('POST.temp_id');
		echo json_encode(array('schedules'=>$this->getList($id)));
		die;
	}

	public function edit() {
		$oSchedule = new temp_schedule($this->db);

		$oSchedule->edit($this->f3->GET('POST.temp_schedule_id'), $this->f3->GET('POST'));
		$id = $this->f3->GET('POST.temp_id');
		echo json_encode(array('schedules'=>$this->getList($id)));
		die;
	}

	public function delete() {
		$oSchedule = new temp_schedule($this->db);

		$oSchedule->delete($this->f3->GET('POST.temp_schedule_id'));
		$id = $this->f3->GET('POST.temp_id');
		echo json_encode(array('schedules'=>$this->getList($id)));
		die;
	}

	public function getList($id) {

		$oSchedule = new temp_schedule($this->db);
		$resschedules = $oSchedule->list($id);

		$aschedules = [];
		for($i=0;$i<count($resschedules);$i++) {
			$action = '<div class="button-items">

			<button type="button"
			data-id="'.$resschedules[$i]['temp_schedule_id'].'"
			data-rsched_name="'.$resschedules[$i]['rsched_name'].'" 
            data-rsched_amtimein="'.$resschedules[$i]['rsched_amtimein'].'" 
            data-rsched_amtimeout="'.$resschedules[$i]['rsched_amtimeout'].'"
			data-rsched_pmtimein="'.$resschedules[$i]['rsched_pmtimein'].'" 
            data-rsched_pmtimeout="'.$resschedules[$i]['rsched_pmtimeout'].'"
			data-rsched_entry="'.$resschedules[$i]['rsched_entry'].'" 
			class="btn btnScheduleEdit">
				<i class="fas fa-edit  font-size-12 align-top"></i></button>
			<button type="button"
			data-id="'.$resschedules[$i]['temp_schedule_id'].'"
			data-rsched_name="'.$resschedules[$i]['rsched_name'].'" 
            data-rsched_amtimein="'.$resschedules[$i]['rsched_amtimein'].'" 
            data-rsched_amtimeout="'.$resschedules[$i]['rsched_amtimeout'].'"
			data-rsched_pmtimein="'.$resschedules[$i]['rsched_pmtimein'].'" 
            data-rsched_pmtimeout="'.$resschedules[$i]['rsched_pmtimeout'].'"
			data-rsched_entry="'.$resschedules[$i]['rsched_entry'].'" 
			class="btn btnScheduleDelete">
				<i class="fas fa-eraser font-size-12 align-top"></i></button>
		</div>';

			$aschedules[] = array(
				'temp_schedule_id'=>$resschedules[$i]['temp_schedule_id'],
                'rsched_name'=>$resschedules[$i]['rsched_name'],
                'rsched_amtimein'=>$resschedules[$i]['rsched_amtimein'],
                'rsched_amtimeout'=>$resschedules[$i]['rsched_amtimeout'],
				'rsched_pmtimein'=>$resschedules[$i]['rsched_pmtimein'],
                'rsched_pmtimeout'=>$resschedules[$i]['rsched_pmtimeout'],
				'rsched_entry'=>$resschedules[$i]['rsched_entry'],
				'action'=>$action
			);
		}
		return $aschedules;
	}

	public function getScheduleList() {
		$id = $this->f3->GET('POST.temp_id');
		$result = $this->getList($id);
		echo json_encode(array('schedules'=>$result));
		die;
	}
}