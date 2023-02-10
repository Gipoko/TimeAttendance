<?php
/*
*
* user controller
*/
class cuser extends cbase {


	public function login() {

		if(!empty($this->f3->get('SESSION.logged_in')) || !is_null($this->f3->get('SESSION.logged_in'))){

            $this->f3->reroute('/page/index');
        }

		if($this->f3->VERB=='GET') {
			$this->f3->SET('bg', rand(1,5));
			$this->f3->set('layout','page/user/login/layout.html');

		} else {

			//get captcha
			$captcha = $this->f3->GET('POST.recaptcha');
			$sessCaptcha = $this->f3->GET('SESSION.captcha_code');
			$postedEmail = $this->f3->get('POST.tuser_username');
			$postedPassword = $this->f3->get('POST.tuser_password');

			$acontent = array();
			//check for captcha combination
			if ($captcha != $sessCaptcha) {
				$acontent = array('status'=>false, 'content'=>$this->f3->get('i18n_captcha_error'), 'title'=>'Error', 'icon'=>'error');

			} else {

				$user = new tuser($this->db);
				$user->getByEmail( $postedEmail, false );
				if($user->dry() || ! password_verify($postedPassword, $user->tuser_password)) {
					sleep(1);
					$acontent = array('status'=>false, 'content'=>$this->f3->get('i18n_wrong_login'), 'title'=>'Error', 'icon'=>'error');
				}
				else if ($user->tuser_activated===0) {
					// $this->f3->logger->write( "LOG IN: ".$this->f3->get('POST.username')." not activated (ip: " .$ip .")",'r' );
					$acontent = array('status'=>false, 'content'=>$this->f3->get('i18n_not_activated_local'), 'title'=>'Message', 'icon'=>'error');

				}
				else {
					$this->f3->set('SESSION.user_id', $user->tuser_ids);
					$user->login($user->tuser_ids);
					// $this->f3->logger->write( "LOG IN: ".$this->f3->get('POST.username')." login success (ip: " .$ip .")",'r' );
					$this->f3->set('SESSION.logged_in', 'true');
					$this->f3->set('SESSION.timestamp', time());
					
					
					$this->f3->set('SESSION.user_group_id', $user->user_group_id);

					$oTemp = new temp($this->db);
					$this->f3->set('SESSION.temp_biometric_id', $oTemp->temp_biometric_id);
					$oTemp->getUserInfoByUserID($user->tuser_ids);
					$this->f3->set('SESSION.temp_id', $oTemp->temp_id);
					$this->f3->set('SESSION.temp_biometric_id', $oTemp->temp_biometric_id);
					$this->f3->set('SESSION.temp_hashcode', $oTemp->temp_hashcode);
					$this->f3->set('SESSION.temp_first', $oTemp->temp_first);
					$acontent = array('status'=>true, 'content'=>'Welcome Back', 'title'=>'Message', 'icon'=>'success', 'mainpage'=>'/page/index');
				}
			}
			echo json_encode($acontent);
			die;
		}
	}


	public function logout()
	{
		$this->f3->clear('SESSION');
		$this->f3->reroute('/');
	}






}