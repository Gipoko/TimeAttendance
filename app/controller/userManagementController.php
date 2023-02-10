<?php

class userManagementController extends cau{

	public function index() {
		if($this->f3->VERB=='GET') {

			$oUserMenu = new menu_skote();
			$menu = $oUserMenu->loadMenu();
			$oUserGroup = new userGroup($this->db);
			$resGroup = $oUserGroup->getUserGroup();

			$this->f3->set('userGroups',$resGroup);
			$this->f3->SET('sidebar', $menu);

			if($this->f3->GET('SESSION.user_group_id') === 5)
			{
				 $this->f3->set('content','page/unauthorized.html');
				 $this->f3->set('layout','page/unauth.html');
			}else{
				 $this->f3->set('content','page/user-management/account.html');
				 $this->f3->set('layout','page/layout.html');
				}
		    } else {
			
			$draw = $this->f3->GET('POST.draw');
			$row = $this->f3->GET('POST.start');

			$rowperpage = $this->f3->GET('POST.length'); // Rows display per page

				$columnIndex = $this->f3->GET("POST.order[0]['column']"); // Column index
			//$columnIndex = $_POST['order'][0]['column']; // Column index
			//var_dump($columnIndex);
			$columnName = $this->f3->GET("POST.columns[$columnIndex]['data']"); // Column name

			$columnSortOrder = $this->f3->GET("POST.order[0]['dir']"); // asc or desc
			$searchValue = $this->f3->GET("POST.search['value']"); // Search value

			## Search
			$searchQuery = "";
			if($searchValue != ''){
			$searchQuery = " and (
				temp_first like '%".$searchValue."%' or
				rposition_desc like '%".$searchValue."%' or
				temp_mobile like '%".$searchValue."%' or
				temp_efn like '%".$searchValue."%' or
				temp_last like '%".$searchValue."%'
									) ";
			}


			$oUser = new User($this->db);

			$result = $oUser->countRecords();

			$totalRecords = count($result);
			$totalRecordwithFilter = $totalRecords;

			// var_dump($totalRecordwithFilter, $totalRecords);
			// die;
			// var_dump('totalRecordwithFilter', $totalRecordwithFilter);
			// die;

			if ($searchQuery !="") {
				$totalRecordwithFilter = $oUser->countRecordsWithFilter($searchQuery);
				//$totalRecordwithFilter = $oRecords[0]['totalFilteredRecords'];
			}

			## Fetch records
			$oRecords = $oUser->getRecords($searchQuery, $columnName, $columnSortOrder, $row, $rowperpage);
			// $totalRecords = count($oRecords);
			//$totalRecordwithFilter = count($oRecords);
			$data = [];

			for($i=0;$i<count($oRecords);$i++) {
				$hashcode = $oRecords[$i]['temp_hashcode'];
				$tempid = $oRecords[$i]['temp_id'];

				$userName = "<address><strong>".$oRecords[$i]['tuser_username']."</strong>";
				if ($oRecords[$i]['user_group_name'] == '') {
					if ($oRecords[$i]['tuser_username'] !='') {
						$userName .="<br>";
					} else {
						$userName .="<strong>no username assigned</strong><br>"; 
					}
					$userName .= '<span class="badge badge-pill badge-soft-danger font-size-11">- no assigned group</span></address>';
				} else {
					if ($oRecords[$i]['tuser_username'] !='') {
						$userName .="<br>"; 
					} 
					$userName .= '- '.$oRecords[$i]['user_group_name']." group </address>";
				}
				$action =  '<div class="d-flex gap-2 flex-wrap">';

				$action .= '<div class="btn-group dropend">';
				$btn = "btn-info";
				if ($oRecords[$i]['tuser_enabled'] =='N') {
					$btn = "btn-danger";
				}
				$action .= '	<button type="button" class="btn btn-sm '.$btn.' dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">';
				$action .= '		<i class="fas fa-cog"></i>';
				$action .= '	</button>';
				$action .= '	<div class="dropdown-menu">';
				if ($oRecords[$i]['tuser_username'] =='') {
					$action .= '		<a class="dropdown-item btnUserCreateUsername" href="#" data-hash="'.$hashcode.'" data-id="'.$tempid.'">Create Username</a>';
				} else {

					if ($oRecords[$i]['tuser_enabled'] =='N') {
						$action .= '		<a class="dropdown-item btnUserAccountEnable" href="#" data-hash="'.$hashcode.'" data-id="'.$tempid.'">Enable</a>';
					} else {
						$action .= '		<a class="dropdown-item btnUserAccountChangeUsername" href="#" data-hash="'.$hashcode.'" data-id="'.$tempid.'">Change Username</a>';
						$action .= '		<a class="dropdown-item  btnUserAccountDisable" href="#" data-hash="'.$hashcode.'" data-id="'.$tempid.'">Disable</a>';
						$action .= '		<a class="dropdown-item btnUserAccountChangePassword" href="#" data-hash="'.$hashcode.'" data-id="'.$tempid.'">Reset Password</a>';
						$action .= '		<a class="dropdown-item btnUserAccountUserGroup" href="#" data-hash="'.$hashcode.'" data-id="'.$tempid.'">Set User Group</a>';
					}


				}

				$action .= '	</div>';
				$action .= '</div>';
				$action .= '</div>';

				$data[] = array(
					"temp_id"=>$oRecords[$i]['temp_id'],
					"temp_efn"=>$oRecords[$i]['temp_efn'],
					"fullName"=>$oRecords[$i]['fullName'], 
					"temp_mobile"=>$oRecords[$i]['temp_mobile'],
					"temp_datejoined"=>$oRecords[$i]['temp_datejoined'],
					"tuser_ids"=>$oRecords[$i]['tuser_ids'],
					"tuser_username"=>$userName,
					"user_group_name"=>$oRecords[$i]['user_group_name'],
					"temp_hashcode"=>$oRecords[$i]['temp_hashcode'],
					"rposition_name"=>$oRecords[$i]['rposition_name'],
					"user_group_id"=>$oRecords[$i]['user_group_id'],
					"action"=>$action
				);
			}

			## Response
			$response = array(
			"draw" => intval($draw),
			"iTotalRecords" => $totalRecords,
			"iTotalDisplayRecords" => $totalRecordwithFilter,
			"aaData" => $data
			);

			echo json_encode($response);
			die;
		}

	}

	public function changeusername() {
		$oUser = new User($this->db);
		$oUser->changeusername($this->f3->GET('POST.tuser_ids'), $this->f3->GET('POST.tuser_username'));

		echo json_encode(array('status'=>true, 'msgContent'=>"Username changed successfully", 'msgTitle'=>'Message', 'icon'=>'success'));
		
		die;
	}

	public function changepassword() {
		$oUser = new User($this->db);
		$password = password_hash($this->f3->GET('POST.tuser_password'), PASSWORD_BCRYPT);
		$oUser->changeUserPassword($this->f3->GET('POST.pid'), $password);

		echo json_encode(array('status'=>true, 'msgContent'=>'password changed successfully', 'msgTitle'=>'Message', 'icon'=>'success'));
		
		die;
	}

	public function accountdisable() {
		$oUser = new User($this->db);
		$oUser->accountdisable($this->f3->GET('POST.tuser_ids'), $this->f3->GET('POST.tuser_enabled'));

		echo json_encode(array('status'=>true, 'msg'=>'Account Disabled successfully', 'title'=>'Message', 'icon'=>'success'));
		
		die;
	}

	public function accountenable() {
		$oUser = new User($this->db);
		$oUser->accountenable($this->f3->GET('POST.id'), $this->f3->GET('POST.enabled'));

		echo json_encode(array('status'=>true, 'msg'=>'Account Disabled successfully', 'title'=>'Message', 'icon'=>'success'));
		
		die;
	}

	public function createusername() {

		$id= $this->f3->GET('POST.cuid');
		$username= $this->f3->GET('POST.brandnew_username');
		$password = $this->f3->GET('POST.brand_new_password');
		$password = password_hash($password, PASSWORD_BCRYPT);

		$errMsg = "Username and password created successfully";
		$error = true;
		$icon = "success";
		try {
			$oUser = new User($this->db);
			if ($id === '') {
				$this->f3->SET('POST.tuser_activated', 1);
				$this->f3->SET('POST.tuser_username', $username);
				$this->f3->SET('POST.tuser_password', $password);

				$id = $oUser->add($this->f3->GET('POST'));
				$oTemp = new temp($this->db);
				$oTemp->updatePersonUserID($this->f3->GET('POST.empcreateusernameid'), $id);
			} else {
				$oUser->createusername($id, $username, $password);
				$oTemp->updatePersonUserID($this->f3->GET('POST.empcreateusernameid'), $id);
			}
			
			
		} catch (PDOException $e) {
			$errMsg = $e->getMessage();
			$error = false;
			$icon = "error";
		}
		echo json_encode(array('status'=>$error, 'msgContent'=>$errMsg, 'msgTitle'=>'Message', 'icon'=>$icon));

		die;
	}

	public function setusergroup() {
		$oUser = new User($this->db);
		$oUser->setusergroup($this->f3->GET('POST.uid'), $this->f3->GET('POST.user_group_id'));
		echo json_encode(array('status'=>true, 'msgContent'=>'User Group assigned successfully', 'msgTitle'=>'Message', 'icon'=>'success'));
		die;
	}

	public function login() {
		if(!empty($this->f3->get('SESSION.logged_in')) || !is_null($this->f3->get('SESSION.logged_in'))){

            $this->f3->reroute('/page/main');
        }

		if($this->f3->VERB=='POST') {

			$ip = $_SERVER['REMOTE_ADDR'];
			if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
				$ip = $_SERVER['HTTP_CLIENT_IP'];
			} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
				$ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
			}
			$user_id="not logged in";

			$captcha = $this->f3->GET('POST.recaptcha');

			if ($captcha != $this->f3->GET('SESSION.captcha_code')) {
				echo json_encode(array('status'=>false, 'msg'=>$this->f3->get('i18n_captcha_error'), 'title'=>'Error', 'icon'=>'error'));
				die;
			}

			$user = new User($this->db);
			$user->getByName( $this->f3->get('POST.username') );

			if($user->dry() || ! password_verify($this->f3->get('POST.password'), $user->password))	{
				// $this->f3->logger->write( "LOG IN: ".$this->f3->get('POST.username')." login failed (ip: " .$ip .")",'r' );
				sleep(1);
				echo json_encode(array('status'=>false, 'msg'=>$this->f3->get('i18n_wrong_login'), 'title'=>'Error', 'icon'=>'error'));
				die;
			}
			else if ($user->activated===0) {
				// $this->f3->logger->write( "LOG IN: ".$this->f3->get('POST.username')." not activated (ip: " .$ip .")",'r' );
				echo json_encode(array('status'=>false, 'msg'=>$this->f3->get('i18n_not_activated'), 'title'=>'Message', 'icon'=>'error'));
				die;

			}
			else {
				$this->f3->set('SESSION.user_id', $user->id);
				$user->login($user->id);
				// $this->f3->logger->write( "LOG IN: ".$this->f3->get('POST.username')." login success (ip: " .$ip .")",'r' );
				$this->f3->set('SESSION.logged_in', 'true');
				$this->f3->set('SESSION.dr34fwcwewqxsde23dgrrtvwewqawsz', $user->email);
				$this->f3->set('SESSION.timestamp', time());
				$this->f3->set('SESSION.user_type', $user->user_type);

				$oTemp = new temp($this->db);
				$resTemp = $oTemp->findEmployeeByUserID($user->id);
				$this->f3->set('SESSION.temp_hashcode', $resTemp[0]['temp_hashcode']);
				$this->f3->set('SESSION.employee_id', $resTemp[0]['temp_id']);

				echo json_encode(array('status'=>true, 'msg'=>'Welcome Back, ' . $user->username, 'title'=>'Message', 'icon'=>'success', 'mainpage'=>'/page/main'));

				die;
				// $this->f3->reroute('/');
			}
		}
		else {
			$this->f3->CSRF = $this->f3->session->csrf();
			$this->f3->SET('SESSION.name', $this->f3->get('PARAMS.0'));
			$this->f3->copy('CSRF','SESSION.'.$this->f3->GET('SESSION.name').'.csrf');

			$this->f3->set('view','user/login.htm');
			$this->f3->set('layout','user/layout.htm');
		}
	}

	public function confirm_registration() {
		$user = new User($this->db);
		$user->getByHash($this->f3->get('GET.h'));
		if(strcmp($this->f3->get('POST.hash'),$this->f3->get('GET.h'))===0)
		{
			$user->activate($user->id);
			$this->f3->set('POST.registration_ok',true);
			$this->f3->set('view','user/confirm_registration.htm');
		}
		else
		{ //check if account is already activated
			$user->checkActivatedHash($this->f3->get('GET.h'));
			if(strcmp($this->f3->get('POST.hash'),$this->f3->get('GET.h'))===0)
			{
				$this->f3->set('message',$this->f3->get('i18n_alreadyactivated') );
				$this->f3->set('page_head',$this->f3->get('i18n_registration'));
				$this->f3->set('view','page/message.htm');
			}
			else
			{
				$this->f3->set('message',$this->f3->get('i18n_reg_conf_failed') );
				$this->f3->set('page_head',$this->f3->get('i18n_registration'));
				$this->f3->set('view','page/message.htm');
			}
		}
	}

	public function update_registration() {
		// first activation posted
		$user = new User($this->db);
		$sessionlogin = false;

		$this->f3->set('POST.activated',1);

		$user->edit($this->f3->get('POST.user_id'));

		$this->f3->copy('POST','SESSION');
		$this->f3->set('SESSION.login_message',$this->f3->get('i18n_reg_update_success') );
		$this->f3->reroute('/login');
	}

	public function pw_reset() {
		$user = new User($this->db);
		$user->checkActivatedHash($this->f3->get('GET.h'));
		$this->f3->set('SESSION.user_id',$user->id);

		if($this->f3->exists('POST.reset_pw')){
			$pwcheck = $this->check_password( $this->f3->get('POST.new_password') , $this->f3->get('POST.confirm'));
			if (strlen($pwcheck) > 0) //pwcheck error message returned
			{
				$this->f3->set('message', $pwcheck);
				$this->f3->set('view','user/change-pw.htm');
			}
			else{
				if($this->setpw( $this->f3->get('POST.new_password'), $user->id))
				{
					$this->f3->reroute('/login');
				}
				else{
					$this->f3->error(403);
				}
			}
		}
		else if(strcmp($this->f3->get('POST.hash'),$this->f3->get('GET.h'))===0)
		{
			$this->f3->set('view','user/change-pw.htm');
		}
		else
		{
			$this->f3->set('page_head',$this->f3->get('i18n_error'));
			$this->f3->set('message',$this->f3->get('i18n_register_oops') );
			$this->f3->set('view','page/message.htm');
		}
	}

	private function setpw( $newpw, $user_id ) {
		$user = new User($this->db);
		$user->getById($user_id);

		$password = password_hash($newpw, PASSWORD_BCRYPT);

		//check if user id = session id for security
		if($user_id == $this->f3->get('SESSION.user_id'))
		{
			$this->f3->set('POST.password', $password);
			$user->edit($user_id, $this->f3->get('POST'));
			return true;
		}
		else {
			return false;
		}
	}

	public function edit_registration() {
		if($this->f3->VERB==="POST")
		{
			$user_id=$this->f3->get('SESSION.user_id');
			if($this->f3->get('POST.user_id') == $user_id)
			{
				if(null!==$this->f3->get('POST.password'))
				{
					$passwordcheck = $this->check_password($this->f3->get('POST.password'), $this->f3->get('POST.confirm'));
					if( $passwordcheck==="" && $this->setpw( $this->f3->get('POST.password'), $this->f3->get('POST.user_id')) )
					{
						$this->f3->set('alert_type',"success");
						$this->f3->set('message',$this->f3->get('i18n_password_changed'));
					}
					else
					{
						$this->f3->set('alert_type',"danger");
						$this->f3->set('message',$passwordcheck);
					}
				}

				$user = new User($this->db);
				$user->getById($user_id);
				$user->edit($user_id, $this->f3->get('POST'));
				$this->f3->set('SESSION.logged_in', 1);
				$user->login($user->id);
			}
			else {
				$this->f3->error(403);
			}
		}
		$this->f3->copy('SESSION','POST');

		$this->f3->set('view','user/editregistration.htm');
	}

	public function success() {
		$this->f3->set('view','user/success.htm');
	}

	public function sendactmail($email, $hash) {
		$confirmation_link = $this->f3->get('SCHEME')."://".$this->f3->get('HOST')."/confirm_registration?h=".$hash;
		$mail = new Mail();
		$mail->send( // sender, recipient, subject, msg
			$this->f3->get('from_email') ,
			$email,
			$this->f3->get('i18n_confirmation_mail_subject') . " " . $this->f3->get('HOST'),
			$this->f3->get('i18n_confirmation_mail_message')."<a href=\"".$confirmation_link."\">".$confirmation_link . "</a>"
		);

	}

	private function pw_reset_mail($email, $hash) {
		$confirmation_link = $this->f3->get('SCHEME')."://".$this->f3->get('HOST')."/pw_reset?h=".$hash;
		$mail = new Mail();
		$mail->send( // sender, recipient, subject, msg
			$this->f3->get('from_email') ,
			$email,
			$this->f3->get('i18n_confirmation_mail_subject') . " " . $this->f3->get('HOST'),
			$this->f3->get('i18n_reset_pw_mail_message')."<a href=\"".$confirmation_link."\">".$confirmation_link . "</a>"
		);

	}

	public function sendactivationmail() {
		if($this->f3->exists('POST.sendmail'))
		{
			$hash=$this->createHash();
			$user = new User($this->db);
			$user->getByEmail($this->f3->get('POST.email'));
			$this->f3->set('POST.hash', $hash);
			$user->edit($user->id);
			$this->sendactmail($this->f3->get('POST.email'), $hash);
			$this->f3->set('page_head',$this->f3->get('i18n_registration'));
			$this->f3->set('message', $this->f3->get('i18n_conf_mail_sent'));
			$this->f3->set('view','page/message.htm');
		}
		else
		{
			$this->f3->set('view','user/send_activation_mail.htm');
		}
	}

	private function check_password($pw, $confirm) {
		if(strlen($pw) < 8)
		{
			return $this->f3->get('i18n_password_too_short');
		}
		else if($pw !== $confirm)
		{
			return $this->f3->get('i18n_user_wrong_confirm');
		}
		else
		{
			return "";
		}
	}

	public function create() {
		if($this->f3->exists('POST.create'))
		{
			$pwcheck = $this->check_password( $this->f3->get('POST.password'), $this->f3->get('POST.confirm'));
			if (strlen($pwcheck) > 0)
			{
				$this->f3->set('message', $pwcheck);
				$this->f3->set('view','user/create.htm');
			}
			else{
				$password = password_hash($this->f3->get('POST.password'), PASSWORD_BCRYPT);
				$this->f3->set('POST.password', $password);

				$hash = $this->createHash();
				$this->f3->set('POST.hash', $hash);
				$user = new User($this->db);
				$user_added=$user->add($this->f3->get('POST'));

				if($user_added==1)
				{
					$this->sendactmail($this->f3->get('POST.email'), $hash);

					$this->f3->set('page_head',$this->f3->get('i18n_registration'));
					$this->f3->set('message', $this->f3->get('i18n_conf_mail_sent'));
					$this->f3->set('view','page/message.htm');
				}
				else if($user_added==10) //user taken
				{
					$this->f3->set('message', $this->f3->get('i18n_username_taken'));
					$this->f3->set('view','user/create.htm');
				}
				else if($user_added==11) //email taken
				{
					if($user->activated==0)
					{
						$this->f3->set('message', $this->f3->get('i18n_not_activated'));
					}
					else
					{
						$this->f3->set('message', $this->f3->get('i18n_email_taken'));
					}
					$this->f3->set('view','user/create.htm');
				}
			}
		}
		else
		{
			$this->f3->set('view','user/create.htm');
		}
	}

	public function logout() {
		$this->f3->clear('SESSION');
		$this->f3->reroute('/');
	}

	public function update() {
		$user = new User($this->db);

		if($this->f3->exists('POST.update'))
		{
			$user->edit($this->f3->get('POST.id'));
			$this->f3->reroute('/success/User Updated');
		}
		else
		{
			$user->getById($this->f3->get('PARAMS.id'));
			$this->f3->set('user',$user);
			$this->f3->set('page_head',$this->f3->get('i18n_changepassword'));
			$this->f3->set('view','admin/update.htm');
		}
	}

	public function lostpassword() {
		if($this->f3->exists('POST.reset_pw'))
		{
			$hash=$this->createHash();
			$user = new User($this->db);
			$user->getByEmail($this->f3->get('POST.email'));
			if(! $user->dry()){
				$this->f3->set('POST.hash', $hash);
				$user->edit($user->id, $this->f3->get('POST'));
				$this->pw_reset_mail($this->f3->get('POST.email'), $hash);
			}
			$this->f3->set('page_head', $this->f3->get('i18n_new_password_request_header'));
			$this->f3->set('message', $this->f3->get('i18n_new_password_request'));
			$this->f3->set('view','page/message.htm');
		}
		else
		{
			$this->f3->set('view','user/reset-pw.htm');
		}
	}

	private function createHash() { //this should be somewhat unpredictible
		return md5( str_shuffle(time(). $this->f3->get('POST.username') . $this->f3->get('POST.email') ) );
	}

	public function delete() {
		if($this->f3->exists('PARAMS.id'))
		{
			$user = new User($this->db);
			$user->delete($this->f3->get('PARAMS.id'));
		}
		$this->f3->reroute('/success/User Deleted');
	}

	public function getCsrf() {
		$this->f3->CSRF = $this->f3->session->csrf();
		$this->f3->SET('SESSION.name', $this->f3->get('PARAMS.0'));
		$this->f3->copy('CSRF','SESSION.'.$this->f3->GET('SESSION.name').'.csrf');
		echo json_encode(array('status'=>true, 'awsdetrgcvrerbhnyun'=>$this->f3->CSRF));
		die;
	}

	public function pwChange() {
		$un = $this->f3->GET('POST.username');
		$pw = $this->f3->GET('POST.password');
		$np = $this->f3->GET('POST.newpassword');
		$rnp = $this->f3->GET('POST.retypenewpassword');

		$oUser = new User($this->db);
		$oUser->getByName($un);
		if($oUser->dry()) {
			echo json_encode(array('status'=>false, 'msg'=>'Username not found', 'title'=>'Message', 'icon'=>'error'));
			die;
		} else {
			//verify the password
			if (!password_verify($pw, $oUser->password)) {
				echo json_encode(array('status'=>false, 'msg'=>'Existing password is not correct', 'title'=>'Message', 'icon'=>'error'));
				die;
			} else {
				$hp = password_hash($rnp, PASSWORD_BCRYPT);
				$oUser->changePassword($un, $hp);
				echo json_encode(array('status'=>true, 'msg'=>'Password changed successfully', 'title'=>'Message', 'icon'=>'success'));
die;
			}
		}

		die;
	}
}