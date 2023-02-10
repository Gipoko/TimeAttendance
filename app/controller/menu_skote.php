<?php

class menu_skote extends cau {

	private $oMenu;
	private $sMenu;
	private $firstTime;
	private $childrenFound;
	private $html;
	private $levelCounter;
	private $token;

	function loadMenu() {
		$oSec = new csec();
		$this->token = $oSec->getToken(32);

		$this->firstTime = true;
		$this->childrenFound = false;
		$this->html = "";
		$this->levelCounter = 0;
		$oMenu = new tusermenu($this->db);
		$this->createMenu($oMenu, 0, true);
		$find = '<ul aria-expanded="false" class="collapse"></ul>';
		$replace = "";
		$result = str_replace($find, $replace, $this->html);
		$session = $this->f3->GET('SESSION.user_group_id');
// var_dump($session);
// die;
       
		return $result;
		echo $session;
	}

	function countMenuChildren($id) {
		return $menu->countMenuChildren($id);
	}

	function createMenu($menu, $parentID){

		$result = $menu->getMenuLevel($parentID);
		if ($this->firstTime) {
			$this->html .= '<ul class="metismenu list-unstyled" id="side-menu">';

		} else {
			$this->html .= '<ul class="sub-menu" aria-expanded="false">';
		}
		$this->firstTime = false;
		for($i=0;$i<count($result);$i++) {
			$haveChildren = (int)$menu->countMenuChildren($result[$i]['menu_id']);
			$menu_name = $result[$i]['menu_name'];
			// var_dump('chil', $haveChildren);
			
			if ($haveChildren >0) {
				if ($this->levelCounter == 0) {
				
					$this->html .= '<li>';
					if($menu_name === 'Employee' AND $this->f3->GET('SESSION.user_group_id') === 5)
					{
						$this->html .= '	<a href="javascript: void(0);" class="has-arrow waves-effect">';
						$this->html .= '		<i class="'.$result[$i]['menu_icon'].'"></i>';
						$this->html .= '		<span key="t-ecommerce">'.$result[$i]['menu_name'].'</span>';
						$this->html .= '	</a>';
					}
					if($this->f3->GET('SESSION.user_group_id') <= 4)
					{
						$this->html .= '	<a href="javascript: void(0);" class="has-arrow waves-effect">';
						$this->html .= '		<i class="'.$result[$i]['menu_icon'].'"></i>';
						$this->html .= '		<span key="t-ecommerce">'.$result[$i]['menu_name'].'</span>';
						$this->html .= '	</a>';
					}
					
					
				} else if ($this->levelCounter == 1) {
					$this->html .= '<li><a href="javascript: void(0);" class="has-arrow" key="t-level-2-1">'.$result[$i]['menu_name'].'</a>';
				}

				$this->levelCounter += 1;
				$this->createMenu($menu,$result[$i]['menu_id']);
				$this->levelCounter -= 1;
				$this->html .= 		'</li>';
			
			} else {
				if ($this->levelCounter == 0) {
					$this->html .= '<li>';
					$this->html .= '	<a href="'.$result[$i]['menu_route'].'" class="waves-effect">';
					$this->html .= '		<i class="'.$result[$i]['menu_icon'].'"></i>';
					$this->html .= '		<span key="t-chat">'.$result[$i]['menu_name'].'</span>';
					$this->html .= '	</a>';
					$this->html .= '</li>';
				} else {
					$key = '';
					if (strpos($result[$i]['menu_route'], 'list') > 0 ) {
						$key = '/*';
					}
				
					$this->html .= '<li><a href="'.$result[$i]['menu_route'].$key.'" key="t-level-2-1">'.$result[$i]['menu_name'].'</a></li>';
				
			}
			}
		}

		
		
		$this->html .= '</ul>';

	}
}