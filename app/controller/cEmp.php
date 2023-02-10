<?php
/*
*
*
*/
class cEmp extends cau {

	public function info(){

		if($this->f3->VERB=='GET') {
			$oUserMenu = new menu_skote();
			$menu = $oUserMenu->loadMenu();

			$oTemp = new temp($this->db);
			$temp = $oTemp->findByHashCode($this->f3->GET('SESSION.temp_hashcode'));

			$this->f3->SET('temp', $temp);
			$this->f3->SET('sidebar', $menu);
			$this->f3->set('content','/page/hr/details/employee-info.html');
			$this->f3->set('layout','/page/layout.html');
		}
	}

	public function uploadPicture() {

		$id = $this->f3->GET('SESSION.temp_hashcode');

		// var_dump($_FILE);
		// die;

		$img = $_POST['image'];
		$folderPath = "public/employee/picture/";

		$image_parts = explode(";base64,", $img);
		$image_type_aux = explode("image/", $image_parts[0]);
		$image_type = $image_type_aux[1];

		$image_base64 = base64_decode($image_parts[1]);
		$fileName = $id. '.png';

		$file = $folderPath . $fileName;
		file_put_contents($file, $image_base64);
		$oImage = new Image($file);
		$oImage->resize(300, 300);
		$this->f3->write( $file, $oImage->dump('png',9) );

		echo json_encode(array('status'=>true, 'msg'=>'Uploaded successfully', 'title'=>'Message', 'icon'=>'success', 'file'=>$file));
		die;
	}
}