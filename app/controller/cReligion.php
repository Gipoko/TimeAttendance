<?php

/*
*
* frontpage of main controller when user login
*/
class cReligion extends cau {

	public function list() {
		$oCountry = new refProfile();
		$resReligion = $oCountry->getReligion();
		$data = [];
		for($i=0;$i<count($resReligion);$i++) {
			$data[] = array('id'=>$resReligion[$i]['rreligion_id'], 'text'=>$resReligion[$i]['rreligion_desc']);
		}

		echo json_encode($data);
		die;
	}

	public function index() {

		if($this->f3->VERB=='GET') {
			$oUserMenu = new menu_skote();
			$menu = $oUserMenu->loadMenu();

			$this->f3->SET('sidebar', $menu);
			if($this->f3->GET('SESSION.user_group_id') === 5)
			{
				 $this->f3->set('content','page/unauthorized.html');
				 $this->f3->set('layout','page/unauth.html');
			}else{
			$this->f3->set('content','page/setup/personal/religion.html');
			$this->f3->set('layout','page/layout.html');
			}
		} else {

			echo json_encode(array('religions'=>$this->getList()));
			die;
		}
	}

	
	public function add() {
		$oTitle = new rreligion($this->db);
		$oTitle->add($this->f3->GET('POST'));
		echo json_encode(array('religions'=>$this->getList()));
		die;
	}

	public function edit() {
		$oReligion = new rreligion($this->db);

		$oReligion->edit($this->f3->GET('POST.rreligion_id'), $this->f3->GET('POST'));
		echo json_encode(array('religions'=>$this->getList()));
		die;
	}

	public function delete() {
		$oReligion = new rreligion($this->db);

		$oReligion->delete($this->f3->GET('POST.rreligion_id'));
		echo json_encode(array('religions'=>$this->getList()));
		die;
	}

	public function getList() {
		$oReligion = new rreligion($this->db);
		$resReligions = $oReligion->list();

		$aReligions = [];
		for($i=0;$i<count($resReligions);$i++) {
			$action = '<div class="button-items">

			<button type="button"
			data-id="'.$resReligions[$i]['rreligion_id'].'"
			data-val="'.$resReligions[$i]['rreligion_desc'].'" 
			class="btn btnReligionEdit">
				<i class="fas fa-edit  font-size-12 align-top"></i></button>
			<button type="button"
			data-id="'.$resReligions[$i]['rreligion_id'].'"
			data-val="'.$resReligions[$i]['rreligion_desc'].'" 
			class="btn btnReligionDelete">
				<i class="fas fa-eraser font-size-12 align-top"></i></button>
		</div>';

			$aReligions[] = array(
				'rreligion_id'=>$resReligions[$i]['rreligion_id'],

				'rreligion_desc'=>$resReligions[$i]['rreligion_desc'],
				'action'=>$action
			);
		}
		return $aReligions;
	}
}