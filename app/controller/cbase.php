<?php

/*
* filename : base.php
* function : Base Controller to manage when a user will access the system
* purpose  :  
*/
require_once('conn.php');

class cbase {

	protected $f3;
	protected $db;

	function afterroute() {
		$this->f3->SET('random', uniqid());
		echo Template::instance()->render($this->f3->GET('layout'));

	}

	function __construct() {

		
		$con = new conn();		//conn.php

		$conString  = $con::DB_DNS . ":";

		$conString .= "host=" . $con::DB_HOST . ";";
		$conString .= "port=" . $con::DB_PORT . ";";
		$conString .= "dbname=" . $con::DB_NAME;

		$f3=Base::instance();
		$db=new DB\SQL($conString,$con::DB_USER, $con::DB_PASS, array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));

		$this->f3=$f3;
		$this->db=$db;

	}

	public function beforeroute(){
		
	}


}