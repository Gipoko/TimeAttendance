<?php

class curm extends cau {

	private $oMenu;
	private $sMenu;
	private $firstTime;
	private $childrenFound;
	private $html;
	private $levelCounter;

	function loadMenu() {
		$this->firstTime = true;
		$this->childrenFound = false;
		$this->html = "";
		$this->levelCounter = 1;
		$oMenu = new tusermenu($this->db);
		$this->createMenu($oMenu, 0, true);
		$find = '<ul aria-expanded="false" class="collapse"></ul>';
		$replace = "";
		$result = str_replace($find, $replace, $this->html);

		return $result;
	}

	function countMenuChildren($id) {
		return $menu->countMenuChildren($id);
	}

	function createMenu($menu, $parentID){

		$result = $menu->getMenuLevel($parentID);
		if ($this->firstTime) {
			$this->html .= '<ul id="sidebarnav">';

		} else {
			$this->html .= '<ul aria-expanded="false" class="collapse">';
		}
		$this->firstTime = false;
		for($i=0;$i<count($result);$i++) {
			$haveChildren = (int)$menu->countMenuChildren($result[$i]['menu_id']);
			// var_dump('chil', $haveChildren);
			if ($haveChildren >0) {

				$this->html .= '<li>';
				$this->html .= '<a';
				$this->html .= '  class="has-arrow waves-effect waves-dark"';
				$this->html .= '  href="javascript:void(0)"';
				$this->html .= '  aria-expanded="false">';
				$this->html .= '<i class="'.$result[$i]['menu_icon'].'"></i>';
				if ($this->levelCounter == 1){
					$this->html .= '<span class="hide-menu">'.$result[$i]['menu_name'].'</span></a>';
				} else {
					$this->html .= '<span>'.$result[$i]['menu_name'].'</span></a>';
				}
				
				$this->levelCounter += 1;
				$this->createMenu($menu,$result[$i]['menu_id']);
				$this->levelCounter -= 1;
				$this->html .= '</li>';

			} else {

				if ($result[$i]['menu_parent_id'] ==0){
					$this->html .= '<li>';
					$this->html .= '<a';
					$this->html .= '  class="waves-effect waves-dark"';
					$this->html .= '  href="'.$result[$i]['menu_route'].'"';
					$this->html .= '  aria-expanded="false">';
					$this->html .= '  <i class="'.$result[$i]['menu_icon'].'"></i>';
					$this->html .= '  <span class="hide-menu">'.$result[$i]['menu_name'].'</span></a>';
					$this->html .= '</li>';
				  
				} else {
					$this->html .= '<li><a href="'.$result[$i]['menu_route'].'">'.$result[$i]['menu_name'].'</a>';
					$this->html .= '</li>';
				}

				
			}

		// 	//
		   
		//    $this->html .= '</li>';
		}
		$this->html .= '</ul>';

	}
}