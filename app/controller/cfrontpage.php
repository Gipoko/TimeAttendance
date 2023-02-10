<?php

/*
*
* frontpage of main controller when user login
*/
class cfrontpage extends cau {

	public function index() {

		if($this->f3->VERB=='GET') {
			$oUserMenu = new menu_skote();
			$menu = $oUserMenu->loadMenu();

			$this->f3->SET('sidebar', $menu);
			$this->f3->set('content','page/frontpage/main.html');
			$this->f3->set('layout','page/layout.html');
		}
	}
}