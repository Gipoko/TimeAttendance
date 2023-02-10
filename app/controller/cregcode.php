<?php

/*
*
* frontpage of main controller when user login
*/
class cregcode extends cau {

	public function list() {
		$acontent = array('status'=>false, 'content'=>$this->f3->get('i18n_not_activated_local'), 'title'=>'Message', 'icon'=>'error');
		return $acontent;
		
	}
}