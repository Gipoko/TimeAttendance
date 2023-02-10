<?php
class cpayrollconfig extends cau{

public function index(){
    if($this->f3->VERB=='GET') {
    $oUserMenu = new menu_skote();
			$menu = $oUserMenu->loadMenu();
           
			$this->f3->SET('sidebar', $menu);
            if($this->f3->GET('SESSION.user_group_id') === 5)
			{
				 $this->f3->set('content','page/unauthorized.html');
				 $this->f3->set('layout','page/unauth.html');
			}else{
			$this->f3->set('content','/page/setup/payroll/payrollconfig.html');
			$this->f3->set('layout','/page/layout.html');
            }
            $record = new rpayrollconfig($this->db);
            $this->f3->set('rpayroll_config', $record->all());
 
    
    }else{
        
    }
        }
        public function Edit() {
          // var_dump('we are hear');
          var_dump($_POST); //normal php command to capture POSTED coming from javascript
          $oRPayConfig = new rpayrollconfig($this->db);
          $oRPayConfig->edit($this->f3->GET("POST.rpayconfig_id"), $this->f3->GET('POST'));
          die;
    
    
    }

}
