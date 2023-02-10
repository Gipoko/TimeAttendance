<?php

/*
*
* frontpage of main controller when user login
*/
class cTitle extends cau {
	
	public function list() {
		$oTitle = new refProfile();
		$resTitle = $oTitle->getTitles();
		$data = [];
		for($i=0;$i<count($resTitle);$i++) {
			$data[] = array('id'=>$resTitle[$i]['rtitle_id'], 'text'=>$resTitle[$i]['rtitle_desc']);
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
			$this->f3->set('content','page/setup/personal/title.html');
			$this->f3->set('layout','page/layout.html');
			}
		} else {

			echo json_encode(array('titles'=>$this->getList()));
			die;
		}
	}

	
	public function add() {
		$oTitle = new rtitle($this->db);
		$oTitle->add($this->f3->GET('POST'));
		echo json_encode(array('titles'=>$this->getList()));
		die;
	}

	public function edit() {
		$oTitle = new rtitle($this->db);

		$oTitle->edit($this->f3->GET('POST.rtitle_id'), $this->f3->GET('POST'));
		echo json_encode(array('titles'=>$this->getList()));
		die;
	}

	public function delete() {
		$oTitle = new rtitle($this->db);

		$oTitle->delete($this->f3->GET('POST.rtitle_id'));
		echo json_encode(array('titles'=>$this->getList()));
		die;
	}

	public function getList() {
		$oTitle = new rtitle($this->db);
		$resTitles = $oTitle->list();

		$aTitles = [];
		for($i=0;$i<count($resTitles);$i++) {
			$action = '<div class="button-items">

			<button type="button"
			data-id="'.$resTitles[$i]['rtitle_id'].'"
			data-val="'.$resTitles[$i]['rtitle_desc'].'" 
			class="btn btnTitleEdit">
				<i class="fas fa-edit  font-size-12 align-top"></i></button>
			<button type="button"
			data-id="'.$resTitles[$i]['rtitle_id'].'"
			data-val="'.$resTitles[$i]['rtitle_desc'].'" 
			class="btn btnTitleDelete">
				<i class="fas fa-eraser font-size-12 align-top"></i></button>
		</div>';

			$aTitles[] = array(
				'rtitle_id'=>$resTitles[$i]['rtitle_id'],

				'rtitle_desc'=>$resTitles[$i]['rtitle_desc'],
				'action'=>$action
			);
		}
		return $aTitles;
	}
}