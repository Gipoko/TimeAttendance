<?php

/*
*
* frontpage of main controller when user login
*/
class cBank extends cau {

	public function list() {
		$oBank = new refProfile();
		$resBank = $oBank->getBank();
		$data = [];
		for($i=0;$i<count($resBank);$i++) {
			$data[] = array('id'=>$resBank[$i]['rbank_id'], 'text'=>$resBank[$i]['rbank_name']);
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
			$this->f3->set('content','page/setup/personal/bank.html');
			$this->f3->set('layout','page/layout.html');
			}
		} else {

			echo json_encode(array('banks'=>$this->getList()));
			die;
		}
	}

	
	public function add() {
		$oTitle = new rbank($this->db);
		$oTitle->add($this->f3->GET('POST'));
		echo json_encode(array('banks'=>$this->getList()));
		die;
	}

	public function edit() {
		$obank = new rbank($this->db);

		$obank->edit($this->f3->GET('POST.rbank_id'), $this->f3->GET('POST'));
		echo json_encode(array('banks'=>$this->getList()));
		die;
	}

	public function delete() {
		$obank = new rbank($this->db);

		$obank->delete($this->f3->GET('POST.rbank_id'));
		echo json_encode(array('banks'=>$this->getList()));
		die;
	}

	public function getList() {
		$obank = new rbank($this->db);
		$resBanks = $obank->list();

		$aBanks = [];
		for($i=0;$i<count($resBanks);$i++) {
			$action = '<div class="button-items">

			<button type="button"
			data-id="'.$resBanks[$i]['rbank_id'].'"
			data-val="'.$resBanks[$i]['rbank_name'].'" 
			class="btn btnBankEdit">
				<i class="fas fa-edit  font-size-12 align-top"></i></button>
			<button type="button"
			data-id="'.$resBanks[$i]['rbank_id'].'"
			data-val="'.$resBanks[$i]['rbank_name'].'" 
			class="btn btnBankDelete">
				<i class="fas fa-eraser font-size-12 align-top"></i></button>
		</div>';

			$aBanks[] = array(
				'rbank_id'=>$resBanks[$i]['rbank_id'],

				'rbank_name'=>$resBanks[$i]['rbank_name'],
				'action'=>$action
			);
		}
		return $aBanks;
	}
}