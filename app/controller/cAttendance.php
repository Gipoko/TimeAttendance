<?php
/*
*
* frontpage of main controller when user login
*/
use PhpOffice\PhpSpreadsheet\Worksheet\RowDimension;
class cAttendance extends cau {

	public function uploadattendance() {
		if($this->f3->VERB=='GET') {
			$oUserMenu = new menu_skote();
			$menu = $oUserMenu->loadMenu();

			$legend = new dtrlegend($this->db);
			$this->f3->set('legend', $legend->all());

			$this->f3->SET('sidebar', $menu);
			if($this->f3->GET('SESSION.user_group_id') === 5)
			{
				 $this->f3->set('content','page/unauthorized.html');
				 $this->f3->set('layout','page/unauth.html');
			}else{
			$this->f3->set('content','page/attendance/upload.html');
			$this->f3->set('layout','page/layout.html');
			}
			
			
		}else {

			$a=$this->f3->GET('POST.a');
			$ayr=$this->f3->GET('POST.years');
			$amnth=$this->f3->GET('POST.months');

			$rows = json_decode($a, true);

			try {

				$this->readJSONRowData($rows);
				$oBio = new tbiorecord($this->db);
				$ym = $oBio->getAllYearMonth();

				$empbio = $oBio->getEmpBioRecord($ayr, $amnth);

				echo json_encode(array('status'=>true, 'msg'=>'uploaded successfully',  'yearsMonths'=>$ym, 'biolist'=>$empbio));

			} catch (Exception $e) {

				echo $e;
				die;
			}

			die;
		}
	}

	public function legend(){
			$legend = new dtrlegend($this->db);
			$this->f3->set('legend', $legend->all());
			$c =$legend->all();

			for($x=0;$x<count($c);$x++){
				$data[] = array(
					"id"=>$c[$x]['dtrlegend_id'],
					"code"=>$c[$x]['dtrlegend_code'],
					"desc"=>$c[$x]['dtrlegend_desc'],
						);
			}
					## Response
					$response = array(
					"aaData" => $data
						);
					echo json_encode ($response);
					die;
			}

	private function readJSONRowData($rows) {


		$oBio = new tbiorecord($this->db);
		$oEmp = new temp($this->db);
		for($i=0;$i < count($rows);$i++) {
			$id = $rows[$i][0]; 	//employee id
			$yr = $rows[$i][1];		//year
			$mnth = $rows[$i][2];	//month

			for($p = 3; $p<=count($rows[$i])-3;$p++) {
				if ($rows[$i][$p] == '') {
					$rows[$i][$p] = '00:00 00:00 00:00 00:00';
				}
			}

			$v[0] = array(
				  'temp_biometric_id'=>$rows[$i][0],
				  'temp_biorecord_yr'=>$rows[$i][1],
				  'temp_biorecord_mnth'=>$rows[$i][2],
				  'd1'=>$rows[$i][3],
				  'd2'=>$rows[$i][4],
				  'd3'=>$rows[$i][5],
				  'd4'=>$rows[$i][6],
				  'd5'=>$rows[$i][7],
				  'd6'=>$rows[$i][8],
				  'd7'=>$rows[$i][9],
				  'd8'=>$rows[$i][10],
				  'd9'=>$rows[$i][11],
				  'd10'=>$rows[$i][12],
				  'd11'=>$rows[$i][13],
				  'd12'=>$rows[$i][14],
				  'd13'=>$rows[$i][15],
				  'd14'=>$rows[$i][16],
				  'd15'=>$rows[$i][17],
				  'd16'=>$rows[$i][18],
				  'd17'=>$rows[$i][19],
				  'd18'=>$rows[$i][20],
				  'd19'=>$rows[$i][21],
				  'd20'=>$rows[$i][22],
				  'd21'=>$rows[$i][23],
				  'd22'=>$rows[$i][24],
				  'd23'=>$rows[$i][25],
				  'd24'=>$rows[$i][26],
				  'd25'=>$rows[$i][27],
				  'd26'=>$rows[$i][28],
				  'd27'=>$rows[$i][29],
				  'd28'=>$rows[$i][30],
				  'd29'=>$rows[$i][31],
				  'd30'=>$rows[$i][32],
				  'd31'=>$rows[$i][33]
				);


			$found = $oEmp->searchByBioID($id);

			//check if found in table tperson
			if (count($found)==0) {
				//var_dump($rows[$i]);
				echo json_encode(array('status'=>false, 'msg'=>"Employee ID $id is not found. Pls add this employee before uploading the attendance log, thank you"));
				die;
			}

			//search in the biorecord table
			$foundSaved = $oBio->search($id, $yr, $mnth);

			//check if the record is found
			if (count($foundSaved) == 0) {

				//insert to database if not found

				$oBio->add($v[0]);

			} else { //found in biorecord it was enterED previously
				//check THE day if it is already confirmed
				for($m=1;$m<32;$m++) {
					$confirmed = 'confirmedd' . strval($m);
					$day = 'd' . strval($m);
					$dayValue= $v[0]["$day"];

					$newDayValue = $dayValue;
					//var_dump($foundSaved[0]["$day"] . ' ' . $dayValue . '\n');

					if ((int)$foundSaved[0]["$confirmed"] == 0) {
						$aExploded = explode(' ', $newDayValue);

						$oBio->updateDayValue($id, $yr, $mnth, $day, $dayValue);

						// if ($newDayValue == "00:00 00:00 00:00 00:00" && ($foundSaved[0]["$day"] == "00:00 00:00 00:00 00:00" || $foundSaved[0]["$day"] == "")) {
						if ($newDayValue == "00:00 00:00 00:00 00:00" && (empty($foundSaved[0]["$day"]))) {
							$oBio->updateDayValue($id, $yr, $mnth, $day, $dayValue);
						} else if ($foundSaved[0]["$day"] == "00:00 00:00 00:00 00:00" && $newDayValue != "00:00 00:00 00:00 00:00") {

							$oBio->updateDayValue($id, $yr, $mnth, $day, $dayValue);
						} else if ($foundSaved[0]["$day"] != "00:00 00:00 00:00 00:00" && $newDayValue != "00:00 00:00 00:00 00:00") {
							//var_dump('$newDayValue first : ', $newDayValue);
							//check if length of data in db is equal with newvalue
							if (strlen($foundSaved[0]["$day"]) == strlen($newDayValue)) {
							}

							//$newDayValue .= ' ' . $foundSaved[0]["$day"];

							$aExploded = explode(' ', $newDayValue);

							for($q=0;$q<count($aExploded);$q++) {
								if ($aExploded[$q] != ' ' || $aExploded[$q] =='\n' || $aExploded[$q] =='\n') {
									$aExploded[$q] = substr(trim($aExploded[$q]),0,5);
								}
							}

							$newArr = array_unique($aExploded);
							$fArray = array_filter($newArr);
							// die;

							sort($fArray);
							$newStr = implode(' ', $fArray);
							$oBio->updateDayValue($id, $yr, $mnth, $day, $newStr);
						}
						//update the record

						//$oBio->setDayToConfirm($id, $yr, $mnth, $confirmed);
					}

				}
				//die;
				//check if confirmed
				//if confirmed dont update
			}
		}

	}

	public function updateDayTimeEntries() {
		$calc = $this->f3->GET('POST.calc');
		
		$reason = $this->f3->GET('POST.reason');
		$rea = $this->f3->GET('POST.rea');
		$bioid = $this->f3->GET('POST.temp_biorecord');
		$confirmedd = 'confirmedd' . $this->f3->GET('POST.day');
		$day = 'd' . $this->f3->GET('POST.day');
		$timeEntries = $this->f3->GET('POST.timeEntries');

		$oBio = new tbiorecord($this->db);
		$oBio->updateDayTimeEntries($bioid, $day, $confirmedd, $timeEntries,$rea,$reason,$calc);
		die;
	}



	public function index() {

		if($this->f3->VERB=='GET') {
			$oUserMenu = new menu_skote();
			$menu = $oUserMenu->loadMenu();

			$legend = new dtrlegend($this->db);
			$this->f3->set('legend', $legend->all());
			$c =$legend->all();
			
			$this->f3->SET('sidebar', $menu);
			if($this->f3->GET('SESSION.user_group_id') === 5)
			{
				 $this->f3->set('content','page/unauthorized.html');
				 $this->f3->set('layout','page/unauth.html');
			}else{
			$this->f3->set('content','page/attendance/viewAttendance.html');
			$this->f3->set('layout','page/layout.html');
			}
			$YearMonth = new rAttendance($this->db);
			$this->f3->set('YearMonth', $YearMonth->getYearMonth());

			$division = new rdivision($this->db);
			$this->f3->set('division', $division->getDivision());
		}else{
			$year = $this->f3->GET('POST.year');
	        $month = $this->f3->GET('POST.month');
			$division = $this->f3->GET('POST.division');
			$oBio = new rAttendance($this->db);
			$result = $oBio->countRecords();
		
			$empbio = $oBio->getEmpBioRecord($year,$month,$division);
		
			for($i=0;$i<COUNT($empbio);$i++){
				$id = $empbio[$i]['temp_biorecord_id'];
                $name = $empbio[$i]['temp_first']." ".$empbio[$i]['temp_last'];
				// .$empbio[$i]['temp_mid']." "
				//d1
		
				$absreason1 = $empbio[$i]['absreason1'];
				$d1 = $empbio[$i]['calc_d1'];
				$cd1 = explode(" ",$d1);
				$cd1H = explode(":",$cd1[2]);
				 if($absreason1 != '0'){
					$dd1 = $absreason1;
				 }else if($cd1H[1] == 0 && $cd1H[0] == 0){
					$dd1 = " ";
				 }
				 else{
					$dd1 =$cd1H[1].'</br>'.$cd1H[0];
				 }

				 //d2
				 $absreason2 = $empbio[$i]['absreason2'];
				$d2 = $empbio[$i]['calc_d2'];
				$cd2 = explode(" ",$d2);
				$cd2H = explode(":",$cd2[2]);
				 if($absreason2 != '0'){
					$dd2 = $absreason2;
				 }else if($cd2H[1] == 0 && $cd2H[0] == 0){
					$dd2 = " ";
				 }else{
					$dd2 = $cd2H[1].'</br>'.$cd2H[0];
				 }

				  //d3
				  $absreason3 = $empbio[$i]['absreason3'];
				  $d3 = $empbio[$i]['calc_d3'];
				  $cd3 = explode(" ",$d3);
				  $cd3H = explode(":",$cd3[2]);
				   if($absreason3 != '0'){
					  $dd3 = $absreason3;
				   }else if($cd3H[1] == 0 && $cd3H[0] == 0){
					$dd3 = " ";
				 }else{
					  $dd3 = $cd3H[1].'</br>'.$cd3H[0];
				   }

				  //d4
				  $absreason4 = $empbio[$i]['absreason4'];
				  $d4 = $empbio[$i]['calc_d4'];
				  $cd4 = explode(" ",$d4);
				  $cd4H = explode(":",$cd4[2]);
				   if($absreason4 != '0'){
					  $dd4 = $absreason4;
				   }else if($cd4H[1] == 0 && $cd4H[0] == 0){
					$dd4 = " ";
				 }else{
					  $dd4 =$cd4H[1].'</br>'.$cd4H[0];
				   }  

				  //d5
				  $absreason5 = $empbio[$i]['absreason5'];
				  $d5 = $empbio[$i]['calc_d5'];
				  $cd5 = explode(" ",$d5);
				  $cd5H = explode(":",$cd5[2]);
				   if($absreason5 != '0'){
					  $dd5 = $absreason5;
				   }else if($cd5H[1] == 0 && $cd5H[0] == 0){
					$dd5 = " ";
				 }else{
					  $dd5 = $cd5H[1].'</br>'.$cd5H[0];
				   } 

				   //d6
				  $absreason6 = $empbio[$i]['absreason6'];
				  $d6 = $empbio[$i]['calc_d6'];
				  $cd6 = explode(" ",$d6);
				  $cd6H = explode(":",$cd6[2]);
				   if($absreason6 != '0'){
					  $dd6 = $absreason6;
				   }else if($cd6H[1] == 0 && $cd6H[0] == 0){
					$dd6 = " ";
				 }else{
					  $dd6 = $cd6H[1].'</br>'.$cd6H[0];
				   }

				   //d7
				  $absreason7 = $empbio[$i]['absreason7'];
				  $d7 = $empbio[$i]['calc_d7'];
				  $cd7 = explode(" ",$d7);
				  $cd7H = explode(":",$cd7[2]);
				   if($absreason7 != '0'){
					  $dd7 = $absreason7;
				   }else if($cd7H[1] == 0 && $cd7H[0] == 0){
					$dd7 = " ";
				 }else{
					  $dd7 = $cd7H[1].'</br>'.$cd7H[0];
				   }

				   //d8
				  $absreason8 = $empbio[$i]['absreason8'];
				  $d8 = $empbio[$i]['calc_d8'];
				  $cd8 = explode(" ",$d8);
				  $cd8H = explode(":",$cd8[2]);
				   if($absreason8 != '0'){
					  $dd8 = $absreason8;
				   }else if($cd8H[1] == 0 && $cd8H[0] == 0){
					$dd8 = " ";
				 }else{
					  $dd8 = $cd8H[1].'</br>'.$cd8H[0];
				   }

				   //d9
				  $absreason9 = $empbio[$i]['absreason9'];
				  $d9 = $empbio[$i]['calc_d9'];
				  $cd9 = explode(" ",$d9);
				  $cd9H = explode(":",$cd9[2]);
				   if($absreason9 != '0'){
					  $dd9 = $absreason9;
				   }else if($cd9H[1] == 0 && $cd9H[0] == 0){
					$dd9 = " ";
				 }else{
					  $dd9 = $cd9H[1].'</br>'.$cd9H[0];
				   }

				   //d10
				  $absreason10 = $empbio[$i]['absreason10'];
				  $d10 = $empbio[$i]['calc_d10'];
				  $cd10 = explode(" ",$d10);
				  $cd10H = explode(":",$cd10[2]);
				   if($absreason10 != '0'){
					  $dd10 = $absreason10;
				   }else if($cd10H[1] == 0 && $cd10H[0] == 0){
					$dd10 = " ";
				 }else{
					  $dd10 = $cd10H[1].'</br>'.$cd10H[0];
				   }

				   //d11
				  $absreason11 = $empbio[$i]['absreason11'];
				  $d11 = $empbio[$i]['calc_d11'];
				  $cd11 = explode(" ",$d11);
				  $cd11H = explode(":",$cd11[2]);
				   if($absreason11 != '0'){
					  $dd11 = $absreason11;
				   }else if($cd11H[1] == 0 && $cd11H[0] == 0){
					$dd11 = " ";
				 }else{
					  $dd11 = $cd11H[1].'</br>'.$cd11H[0];
				   }

				   //d12
				  $absreason12 = $empbio[$i]['absreason12'];
				  $d12 = $empbio[$i]['calc_d12'];
				  $cd12 = explode(" ",$d12);
				  $cd12H = explode(":",$cd12[2]);
				   if($absreason12 != '0'){
					  $dd12 = $absreason12;
				   }else if($cd12H[1] == 0 && $cd12H[0] == 0){
					$dd12 = " ";
				 }else{
					  $dd12 = $cd12H[1].'</br>'.$cd12H[0];
				   }

				   //d13
				  $absreason13 = $empbio[$i]['absreason13'];
				  $d13 = $empbio[$i]['calc_d13'];
				  $cd13 = explode(" ",$d13);
				  $cd13H = explode(":",$cd13[2]);
				   if($absreason13 != '0'){
					  $dd13 = $absreason13;
				   }else if($cd13H[1] == 0 && $cd13H[0] == 0){
					$dd13 = " ";
				 }else{
					  $dd13 = $cd13H[1].'</br>'.$cd13H[0];
				   }

				   //d14
				  $absreason14 = $empbio[$i]['absreason14'];
				  $d14 = $empbio[$i]['calc_d14'];
				  $cd14 = explode(" ",$d14);
				  $cd14H = explode(":",$cd14[2]);
				   if($absreason14 != '0'){
					  $dd14 = $absreason14;
				   }else if($cd14H[1] == 0 && $cd14H[0] == 0){
					$dd14 = " ";
				 }else{
					  $dd14 = $cd14H[1].'</br>'.$cd14H[0];
				   }

				   //d15
				  $absreason15 = $empbio[$i]['absreason15'];
				  $d15 = $empbio[$i]['calc_d15'];
				  $cd15 = explode(" ",$d15);
				  $cd15H = explode(":",$cd15[2]);
				   if($absreason15 != '0'){
					  $dd15 = $absreason15;
				   }else if($cd15H[1] == 0 && $cd15H[0] == 0){
					$dd15 = " ";
				 }else{
					  $dd15 = $cd15H[1].'</br>'.$cd15H[0];
				   }

				     //d16
				  $absreason16 = $empbio[$i]['absreason16'];
				  $d16 = $empbio[$i]['calc_d16'];
				  $cd16 = explode(" ",$d16);
				  $cd16H = explode(":",$cd16[2]);
				   if($absreason16 != '0'){
					  $dd16 = $absreason16;
				   }else if($cd16H[1] == 0 && $cd16H[0] == 0){
					$dd16 = " ";
				 }else{
					  $dd16 = $cd16H[1].'</br>'.$cd16H[0];
				   }

				     //d17
				  $absreason17 = $empbio[$i]['absreason17'];
				  $d17 = $empbio[$i]['calc_d17'];
				  $cd17 = explode(" ",$d17);
				  $cd17H = explode(":",$cd17[2]);
				   if($absreason17 != '0'){
					  $dd17 = $absreason17;
				   }else if($cd17H[1] == 0 && $cd17H[0] == 0){
					$dd17 = " ";
				 }else{
					  $dd17 = $cd17H[1].'</br>'.$cd17H[0];
				   }
 
				     //d18
				  $absreason18 = $empbio[$i]['absreason18'];
				  $d18 = $empbio[$i]['calc_d18'];
				  $cd18 = explode(" ",$d18);
				  $cd18H = explode(":",$cd18[2]);
				   if($absreason18 != '0'){
					  $dd18 = $absreason18;
				   }else if($cd18H[1] == 0 && $cd18H[0] == 0){
					$dd18 = " ";
				 }else{
					  $dd18 = $cd18H[1].'</br>'.$cd18H[0];
				   }

				     //d19
				  $absreason19 = $empbio[$i]['absreason19'];
				  $d19 = $empbio[$i]['calc_d19'];
				  $cd19 = explode(" ",$d19);
				  $cd19H = explode(":",$cd19[2]);
				   if($absreason19 != '0'){
					  $dd19 = $absreason19;
				   }else if($cd19H[1] == 0 && $cd19H[0] == 0){
					$dd19 = " ";
				 }else{
					  $dd19 = $cd19H[1].'</br>'.$cd19H[0];
				   }

				     //d20
				  $absreason20 = $empbio[$i]['absreason20'];
				  $d20 = $empbio[$i]['calc_d20'];
				  $cd20 = explode(" ",$d20);
				  $cd20H = explode(":",$cd20[2]);
				   if($absreason20 != '0'){
					  $dd20 = $absreason20;
				   }else if($cd20H[1] == 0 && $cd20H[0] == 0){
					$dd20 = " ";
				 }else{
					  $dd20 = $cd20H[1].'</br>'.$cd20H[0];
				   }

				       //d21
				  $absreason21 = $empbio[$i]['absreason21'];
				  $d21 = $empbio[$i]['calc_d21'];
				  $cd21 = explode(" ",$d21);
				  $cd21H = explode(":",$cd21[2]);
				   if($absreason21 != '0'){
					  $dd21 = $absreason21;
				   }else if($cd21H[1] == 0 && $cd21H[0] == 0){
					$dd21 = " ";
				 }else{
					  $dd21 = $cd21H[1].'</br>'.$cd21H[0];
				   }

				       //d22
				  $absreason22 = $empbio[$i]['absreason22'];
				  $d22 = $empbio[$i]['calc_d22'];
				  $cd22 = explode(" ",$d22);
				  $cd22H = explode(":",$cd22[2]);
				   if($absreason22 != '0'){
					  $dd22 = $absreason22;
				   }else if($cd22H[1] == 0 && $cd22H[0] == 0){
					$dd22 = " ";
				 }else{
					  $dd22 = $cd22H[1].'</br>'.$cd22H[0];
				   }

				       //d23
				  $absreason23 = $empbio[$i]['absreason23'];
				  $d23 = $empbio[$i]['calc_d23'];
				  $cd23 = explode(" ",$d23);
				  $cd23H = explode(":",$cd23[2]);
				   if($absreason23 != '0'){
					  $dd23 = $absreason23;
				   }else if($cd23H[1] == 0 && $cd23H[0] == 0){
					$dd23 = " ";
				 }else{
					  $dd23 = $cd23H[1].'</br>'.$cd23H[0];
				   }

				       //d24
				  $absreason24 = $empbio[$i]['absreason24'];
				  $d24 = $empbio[$i]['calc_d24'];
				  $cd24 = explode(" ",$d24);
				  $cd24H = explode(":",$cd24[2]);
				   if($absreason24 != '0'){
					  $dd24 = $absreason24;
				   }else if($cd24H[1] == 0 && $cd24H[0] == 0){
					$dd24 = " ";
				 }else{
					  $dd24 = $cd24H[1].'</br>'.$cd24H[0];
				   }

				       //d25
				  $absreason25 = $empbio[$i]['absreason25'];
				  $d25 = $empbio[$i]['calc_d25'];
				  $cd25 = explode(" ",$d25);
				  $cd25H = explode(":",$cd25[2]);
				   if($absreason25 != '0'){
					  $dd25 = $absreason25;
				   }else if($cd25H[1] == 0 && $cd25H[0] == 0){
					$dd25 = " ";
				 }else{
					  $dd25 = $cd25H[1].'</br>'.$cd25H[0];
				   }

				       //d26
				  $absreason26 = $empbio[$i]['absreason26'];
				  $d26 = $empbio[$i]['calc_d26'];
				  $cd26 = explode(" ",$d26);
				  $cd26H = explode(":",$cd26[2]);
				   if($absreason26 != '0'){
					  $dd26 = $absreason26;
				   }else if($cd26H[1] == 0 && $cd26H[0] == 0){
					$dd26 = " ";
				 }else{
					  $dd26 = $cd26H[1].'</br>'.$cd26H[0];
				   }

				       //d27
				  $absreason27 = $empbio[$i]['absreason27'];
				  $d27 = $empbio[$i]['calc_d27'];
				  $cd27 = explode(" ",$d27);
				  $cd27H = explode(":",$cd27[2]);
				   if($absreason27 != '0'){
					  $dd27 = $absreason27;
				   }else if($cd27H[1] == 0 && $cd27H[0] == 0){
					$dd27 = " ";
				 }else{
					  $dd27 = $cd27H[1].'</br>'.$cd27H[0];
				   }

				       //d28
				  $absreason28 = $empbio[$i]['absreason28'];
				  $d28 = $empbio[$i]['calc_d28'];
				  $cd28 = explode(" ",$d28);
				  $cd28H = explode(":",$cd28[2]);
				   if($absreason28 != '0'){
					  $dd28 = $absreason28;
				   }else if($cd28H[1] == 0 && $cd28H[0] == 0){
					$dd28 = " ";
				 }else{
					  $dd28 = $cd28H[1].'</br>'.$cd28H[0];
				   }

				       //d29
				  $absreason29 = $empbio[$i]['absreason29'];
				  $d29 = $empbio[$i]['calc_d29'];
				  $cd29 = explode(" ",$d29);
				  $cd29H = explode(":",$cd29[2]);
				   if($absreason29 != '0'){
					  $dd29 = $absreason29;
				   }else if($cd29H[1] == 0 && $cd29H[0] == 0){
					$dd29 = " ";
				 }else{
					  $dd29 = $cd29H[1].'</br>'.$cd29H[0];
				   }

				       //d30
				  $absreason30 = $empbio[$i]['absreason30'];
				  $d30 = $empbio[$i]['calc_d30'];
				  $cd30 = explode(" ",$d30);
				  $cd30H = explode(":",$cd30[2]);
				   if($absreason30 != '0'){
					  $dd30 = $absreason30;
				   }else if($cd30H[1] == 0 && $cd30H[0] == 0){
					$dd30 = " ";
				 }else{
					  $dd30 = $cd30H[1].'</br>'.$cd30H[0];
				   }

				      //d31
				  $absreason31 = $empbio[$i]['absreason31'];
				  $d31 = $empbio[$i]['calc_d31'];
				  $cd31 = explode(" ",$d31);
				  $cd31H = explode(":",$cd31[2]);
				   if($absreason31 != '0'){
					  $dd31 = $absreason31;
				   }else if($cd31H[1] == 0 && $cd31H[0] == 0){
					$dd31 = " ";
				 }else{
					  $dd31 = $cd31H[1].'</br>'.$cd31H[0];
				   }

				 $lm =  (int)$cd1H[1] + (int)$cd2H[1] + (int)$cd3H[1] + (int)$cd4H[1] + (int)$cd5H[1] +
				        (int)$cd6H[1] + (int)$cd7H[1] + (int)$cd8H[1] + (int)$cd9H[1] + (int)$cd10H[1] +
				   		(int)$cd11H[1] + (int)$cd12H[1] + (int)$cd13H[1] + (int)$cd14H[1] + (int)$cd15H[1] +
						(int)$cd16H[1] + (int)$cd17H[1] + (int)$cd18H[1] + (int)$cd19H[1] + (int)$cd20H[1] +
						(int)$cd21H[1] + (int)$cd22H[1] + (int)$cd23H[1] + (int)$cd24H[1] + (int)$cd25H[1] +
						(int)$cd26H[1] + (int)$cd27H[1] + (int)$cd28H[1] + (int)$cd29H[1] + (int)$cd30H[1] +
						(int)$cd31H[1];
				 $lh =  (int)$cd1H[0] + (int)$cd2H[0] + (int)$cd3H[0] + (int)$cd4H[0] + (int)$cd5H[0] +
				        (int)$cd6H[0] + (int)$cd7H[0] + (int)$cd8H[0] + (int)$cd9H[0] + (int)$cd10H[0] +
				   		(int)$cd11H[0] + (int)$cd12H[0] + (int)$cd13H[0] + (int)$cd14H[0] + (int)$cd15H[0] +
						(int)$cd16H[0] + (int)$cd17H[0] + (int)$cd18H[0] + (int)$cd19H[0] + (int)$cd20H[0] +
						(int)$cd21H[0] + (int)$cd22H[0] + (int)$cd23H[0] + (int)$cd24H[0] + (int)$cd25H[0] +
						(int)$cd26H[0] + (int)$cd27H[0] + (int)$cd28H[0] + (int)$cd29H[0] + (int)$cd30H[0] +
						(int)$cd31H[0];

						if($lm > 60){
							$min = $lm;
							$hr = floor($min / 60);
							$hrl = floor($lh);
							$rmin = $min % 60;

							$lh = $hr + $hrl;
							$lm = $rmin;
						}

					$array = [$dd1,$dd2,$dd3,$dd4,$dd5,$dd6,$dd7,$dd8,$dd9,$dd10,
					$dd11,$dd12,$dd13,$dd14,$dd15,$dd16,$dd17,$dd18,$dd19,$dd20,
					$dd21,$dd22,$dd23,$dd24,$dd25,$dd26,$dd27,$dd28,$dd29,$dd30,
					$dd31];
					$count = array_count_values($array);
					$vl = $count['VL'];
					$sl = $count['SL'];
					$mc6 = $count['MC6'];
					$parl = $count['PARL'];
						
					$x = "";
				
				$data[] = array(
					"id"=>$empbio[$i]['temp_biorecord_id'],
					"year"=>$empbio[$i]['temp_biorecord_yr'],
					"month"=>$empbio[$i]['temp_biorecord_mnth'],
                    "Name"=>$name,
					"temp_birtin"=>$empbio[$i]['temp_birtin'],
					"d1"=>$dd1,
					"d2"=>$dd2,
					"d3"=>$dd3,
					"d4"=>$dd4,
					"d5"=>$dd5,
					"d6"=>$dd6,
					"d7"=>$dd7,
					"d8"=>$dd8,
					"d9"=>$dd9,
					"d10"=>$dd10,
					"d11"=>$dd11,
					"d12"=>$dd12,
					"d13"=>$dd13,
					"d14"=>$dd14,
					"d15"=>$dd15,
					"d16"=>$dd16,
					"d17"=>$dd17,
					"d18"=>$dd18,
					"d19"=>$dd19,
					"d20"=>$dd20,
					"d21"=>$dd21,
					"d22"=>$dd22,
					"d23"=>$dd23,
					"d24"=>$dd24,
					"d25"=>$dd25,
					"d26"=>$dd26,
					"d27"=>$dd27,
					"d28"=>$dd28,
					"d29"=>$dd29,
					"d30"=>$dd30,
					"d31"=>$dd31,
					"SL"=>$sl,
					"VL"=>$vl,
					"MC6"=>$mc6,
					"PARL"=>$parl,
					"x"=>$x,
					"LH"=>$lh,
					"LM"=>$lm
					
	
				);
				
		}
		return $data;
			
		}
	}


	public function getAllattendance($year,$month){
		
	    $result = $this->index($year,$month);
	    echo json_encode(array('attendance'=>$result));
	    die;
	}

	public function upload(){
		$target_dir = "public/dtr/";
		$file =$target_dir . basename($_FILES["File"]["name"]);

		$lines = array();
		$fopen = fopen($file, 'r');
		while (!feof($fopen)) {
			$line=fgets($fopen);
			$line=trim($line);
			$lines[]=$line;
		}
		fclose($fopen);
		$finalOutput = array();
	    foreach ($lines as $string){
			$string = preg_replace('!\s+!', ' ', $string);
			$row = explode(" ", $string);
		    array_push($finalOutput,$row);
}
		$oAttendance = new rAttendance($this->db);
		foreach ($finalOutput as $output){
			$year = explode("-",$output[3]);
			$oAttendance->add($output,$year);
		}
	die;
	}

	// public function getYearMonth() {
	// 	$oYrMnth = new rAttendance($this->db);
	// 	$resYearMonth = $oYrMnth->getYearMonth();

	// 	$data = [];
	// 	for($i=0;$i<count($resYearMonth);$i++) {
	// 		$ym = $resYearMonth[$i]['temp_dtrbio_yy'] .'-'.$resYearMonth[$i]['temp_dtrbio_mm'];
	// 		$data[] = array('id'=>$ym, 'text'=>$ym);
	// 	}

	// 	echo json_encode($data);
	// 	die;
	// }

	// public function getYearMonthList() {
	// 	$oYrMnth = new rAttendance($this->db);
	// 	$yr = substr($this->f3->GET('POST.ym'),0,4);
	// 	$month = substr($this->f3->GET('POST.ym'),5);

	// 	$resYearMonth = $oYrMnth->getYearMonthList($yr, $month);

	// 	echo json_encode(array('attendanceLog'=>$resYearMonth));
	// 	die;
	// }



	public function getYearMonth() {
		$oYrMnth = new rAttendance($this->db);
		$resYearMonth = $oYrMnth->getYearMonth();

		$data = [];
		for($i=0;$i<count($resYearMonth);$i++) {
			$ym = $resYearMonth[$i]['temp_biorecord_yr'] .'-'.$resYearMonth[$i]['temp_biorecord_mnth'];
			$data[] = array('id'=>$ym, 'text'=>$ym);
		}

		echo json_encode($data);
		die;
	}

	public function getYearMonthList() {
		$oYrMnth = new rAttendance($this->db);
		$yr = substr($this->f3->GET('POST.ym'),0,4);
		$month = substr($this->f3->GET('POST.ym'),5);

		$resYearMonth = $oYrMnth->getYearMonthList($yr, $month);

		for($i=0;$i<count($resYearMonth);$i++) {
			$tempResult = $resYearMonth[$i];
			$j=0;

			foreach($tempResult as $key => $value) {
				if ($j >=3 && $j<=33) {
					$value = str_replace("\n", " ", $value);
					$aNewVal = explode(" ", $value);

					for($a=0;$a<count($aNewVal);$a++) {
						if ($aNewVal[$a] !='') {
							if ($aNewVal[$a] !='00:00') {
								$tempDateFormat = new DateTime($aNewVal[$a]);
								$aNewVal[$a] = $tempDateFormat->format('h:ia');
							} else {
								$aNewVal[$a] = '00:00';
							}
						}
					}
					//var_dump($aNewVal);

					$tempResult[$key] = trim(implode(" ", $aNewVal));
				}

				$j++;
			}
			$resYearMonth[$i] = $tempResult;
		}

		echo json_encode(array('attendanceLog'=>$resYearMonth));
		die;
	}

	public function getEmployeeAttendance() {
		$id = $this->f3->GET('POST.temp_id');
		$yy = $this->f3->GET('POST.temp_dtrbio_yy');
		$mm = $this->f3->GET('POST.temp_dtrbio_mm');
		$oLogs = new rAttendance($this->db);
		$res = $oLogs->getEmployeeAttendance($id, $yy, $mm);


			echo json_encode(array('attendanceLogs'=>$res));
			die;

	}

	public function printAttendanceLog() {

		$id = $this->f3->GET('POST.temp_dtrbio_id');
		$oDtr = new rAttendance($this->db);
		$result = $oDtr->getYearMonthListByDtrID($id);

		$totalCols = count($result[0]);
		$newCols = $result[0];

		$yr = $newCols['temp_dtrbio_yr'];
		$month = $newCols['temp_dtrbio_mm'];
		$aTimeInAM = [];
		$aTimeOutAM = [];
		$aTimeInPM = [];
		$aTimeOutPM = [];

		$j=0;
		foreach ($newCols as $key => $value) {
			$pos = strpos($key, 'temp_dtrbio_dd');
			if ($pos === 0) {
				$aTime = explode(" ", trim($value));
				if (count($aTime) == 2) {
					array_push($aTime, "00:00");
					array_push($aTime, "00:00");
					$aTime[3] = $aTime[1];
					$aTime[1] = '00:00';
				}

				$aTimeInAM[]  = $aTime[0];
				$aTimeOutAM[] = $aTime[1];
				$aTimeInPM[]  = $aTime[2];
				$aTimeOutPM[] = $aTime[3];

			}

			$j++;
			if ($j > 36) {
				break;
			}
		}

		$spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load("public/xls-template/report-template.xlsx");

		//change it
		$sheet = $spreadsheet->getActiveSheet();
		$sheet->setCellValue('A2', $newCols['fullName']);
		$sheet->setCellValue('J2', $newCols['fullName']);

		$sheet->setCellValue('D3', date_format(date_create("$yr-$month-01"),"F Y"));
		$sheet->setCellValue('M3', date_format(date_create("$yr-$month-01"),"F Y"));

		$totalDays=cal_days_in_month(CAL_GREGORIAN,$month,$yr);

		$j=0;
		$row = 9;
		$currentDate = 1;
		for($i=0;$i<count($aTimeInAM);$i++){

			$sheet->setCellValue('B' . $row, ($aTimeInAM[$i] =="00:00" ? '-' : substr('00'.date("g:i", strtotime("$aTimeInAM[$i] UTC") ), -5)));
			$sheet->setCellValue('C' . $row, ($aTimeOutAM[$i] =="00:00" ? '-' : substr('00'.date("g:i", strtotime("$aTimeOutAM[$i] UTC") ), -5)));
			$sheet->setCellValue('D' . $row, ($aTimeInPM[$i] =="00:00" ? '-' : substr('00'.date("g:i", strtotime("$aTimeInPM[$i] UTC") ), -5)));
			$sheet->setCellValue('E' . $row, ($aTimeOutPM[$i] =="00:00" ? '-' : substr('00'.date("g:i", strtotime("$aTimeOutPM[$i] UTC") ), -5)));

			$sheet->setCellValue('K' . $row, ($aTimeInAM[$i] =="00:00" ? '-' : substr('00'.date("g:i", strtotime("$aTimeInAM[$i] UTC") ), -5)));
			$sheet->setCellValue('L' . $row, ($aTimeOutAM[$i] =="00:00" ? '-' : substr('00'.date("g:i", strtotime("$aTimeOutAM[$i] UTC") ), -5)));
			$sheet->setCellValue('M' . $row, ($aTimeInPM[$i] =="00:00" ? '-' : substr('00'.date("g:i", strtotime("$aTimeInPM[$i] UTC") ), -5)));
			$sheet->setCellValue('N' . $row, ($aTimeOutPM[$i] =="00:00" ? '-' : substr('00'.date("g:i", strtotime("$aTimeOutPM[$i] UTC") ), -5)));
			$row++;


		}


		//write it again to Filesystem with the same name (=replace)
		$writer = new Xlsx($spreadsheet);
		$writer->save('public/xls-template/yourspreadsheet.xlsx');
		die;
	}

}