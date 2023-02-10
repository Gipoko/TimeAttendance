$(document).ready( function () {

    //create the datatable instance

  var $modalFix = $("#modalFix");
  var $modalLeave = $("#modalLeave");
  var cmdActTimeEntryEdit = 0;
  var dayTable;
  var dayTableId;

  var $rowEdited;

  var $timeEntryAddSave = $("#timeEntryAddSave");
  var $timeEntryEditSave= $("#timeEntryEditSave");
  var $timeEntryEditCancel = $("#timeEntryEditCancel");

  $timeEntryAddSave.show();
  $timeEntryEditSave.hide();
  $timeEntryEditCancel.hide();
  legends();
 

    $aa = [];
    $aa.push({ width: 200, targets: 1 });
    $aa.push({
      render: function (data, type, full, meta) {
          return "<div class='text-wrap width-200'>" + data + "</div>";
      }});

    $aa.push({ width: 200, targets: 1 });
    var  $cntr = 0;
    var $oldBioID = 0;
    for($p=4;$p<=34;$p++) {
      $obj = {
        render: function (data, type, full, meta) {

          $cntr++;
          if ($cntr>31) $cntr = 1;
          return "<div>" + renderCell(data, type, full, meta, $cntr) + "</div>";
        },
        targets: $p
      };
      $aa.push( $obj );
      $obj={};
    }
    $cntr=0;

    $bb=[];
    
    $bb.push({ "data": "temp_biorecord_id" });
    $bb.push({ "data": "fullname" });
    $bb.push({ "data": "temp_biorecord_yr" });
    $bb.push({ "data": "temp_biorecord_mnth" });

    for($i=1;$i<=31;$i++) {
      $bb.push({ "data": "d" + $i })
    }

    

    $tblTimesheetLog = $('#tblTimesheetLog').DataTable( {
      "responsive": false,
      "processing": true,
      "autoWidth": true,
      "ordering": false,
     scrollX:        true,
     paging:         false,
     fixedColumns:   {
         leftColumns: 1
     },

     "columns": $bb,
     columnDefs: $aa,
    scrollY:        "350px",
    paging:         false,
    scrollCollapse: true,
         fixedColumns:   {
             leftColumns: 1,
             rightColumns: 1
         }
   } );

   function legends() {
    $.ajax({
      type: 'get',
      url: '/page/attendance/legend/*',
      dataType: 'JSON',
      success: function(data) {
        let x = data.aaData.length; 
        console.log(data.aaData);
        let legend = "";
        let legend2 = "";
        for (let i = 0; i < 12; i++) {
        var code = data.aaData[i].code;
        var desc = data.aaData[i].desc;
        
        legend += '<p style="margin-bottom:0%;">'+code+'-'+desc+'</p>';
        }  

        for (let i = 11; i < x; i++) {
            var code = data.aaData[i].code;
            var desc = data.aaData[i].desc;
            
            legend2 += '<p style="margin-bottom:0%;">'+code+'-'+desc+'</p>';
            }  

        $("#legend").html(legend);
        $("#newline").html(legend2);
        
      }
     });

  }
   

   function legend() {
    $.ajax({
      type: 'get',
      url: '/page/attendance/legend/*',
      dataType: 'JSON',
      success: function(data) {
        var x = data.aaData.length;
        
        console.log(data.aaData);
        var $select = "<select id='reason' data-bs-toggle='tooltip' data-bs-placement='top' title='Select leave'>";
        $select += '<option value="0">Leave</option>';
        for (var i = 0; i < x; i++) {
  
      var code = data.aaData[i].code;
      var id = data.aaData[i].id;
      $select += '<option value="'+code+'">'+code+'</option>';	
        } 
      $select += "</select>";
        window.x = $select;
      }
     });

    var $flextime =  '<select id="flex-time" data-bs-toggle="tooltip" data-bs-placement="top" title="Select Schedule">';
      $flextime +='<option value="00/00">Sched</option>';
      $flextime +='<option value="07/16">7am - 4pm</option>';
      $flextime +='<option value="08/17">8am - 5pm</option>';
      $flextime +='<option value="09/18">9am - 6pm</option>';
     $flextime +='</select>';

     window.g = $flextime;
  }


   function renderCell(data, type, full, meta, $DayId) {

    let result = data.split('\n');
    let isEnabled = parseInt(full["confirmedd"+$DayId]);

    //note :dayTable breakdown as follows
    //dayTable id name
    //_1 is the record id in table
    //_1 is day in the table
    $table = "";
    $table += "<table id='dayTable_"+full.temp_biorecord_id+"_"+$DayId+"' class='table'>";
    for($i=0;$i<result.length;$i++) {
      $table += "<tr>";
      $table += "<td>";
      $table += result[$i];
      $table += "</td>";
      $table += "</tr>";
    }

    $table += "</table>";
    $grpbtn = '';
    if (isEnabled === 0) {
      
      $grpbtn = '<div class="btn-group btn-group-sm" role="group" aria-label="Basic example">';
      $grpbtn +=''+window.x+'';
      $grpbtn += ''+window.g+'';
      $grpbtn +='<button type="button" class="btn btn-outline-secondary btnFix" data-bs-container="#tooltip-container" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit Time"><i class="bx bx-wrench font-size-12"></i></button>';
      $grpbtn +='<button type="button" class="btn btn-outline-secondary btnApprove" data-bs-container="#tooltip-container" data-bs-toggle="tooltip" data-bs-placement="top" title="Confirm Time Data"><i class="bx bx-save font-size-12"></i></button>';
      
      $grpbtn +='</div>';
    }

      return $table + $grpbtn;
   }
    //upload attendance
    $("#btnUpload2").click(function() {
      legend()
  
        var fileUpload = document.getElementById("file");
        let selected = fileUpload.files[0];

        // (B2) READ CSV INTO ARRAY
        let reader = new FileReader();
        reader.readAsText(selected);

        reader.addEventListener("loadend", () => {
          // (B2-1) SPLIT ROWS & COLUMNS
          data = reader.result.split("\r\n");

          obj = {};
          ar = [];
          $s = '';
          $date = '';
          $.LoadingOverlay("show", {
            image       : "",
            text        : "Loading..."
          });

          
        // date  20,10
          
          for(i = 0;i < data.length;i++) {
            // $date = data[i].substr(62,11);
            // $date = $date.substr(7,4) + '-' + ( $date.substr(4,2).trim()).substring(-2) + '-' + $date.substr(1,2);

            // // $date = data[i].substr(62,10);
            // // $date = $date.substr(6,4) + '-' + ('0' + $date.substr(0,2).trim()).substring(-2) + '-' + $date.substr(3,2);

            // // j = {
            // //   temp_biometric_id : temp_biodata[i].substr(0, 5).trim(),
            // //   data[i].substr(42,3).trim(),
            // //   new Date($date),
            // //   data[i].substr(84).trim(),
            // // }
            var datas =  data[i];
            var empdata = datas.split(',');

            var empid = empdata[0];
            var company = empdata[2];
            var $date =  empdata[3];

            var time_entry = empdata[5];
            var time = time_entry.split(';');
            var timee = time.join(' ');

            var xtime = timee.substr(0,5).trim()+' '+timee.substr(9,5).trim()+' '+timee.substr(18,5).trim()+' '+timee.substr(27,5).trim();
            // +' '+timee.substr(36,5).trim()+' '+timee.substr(45,5).trim()
            j = [
              // data[i].substr(0, 5).trim(),
              //  data[i].substr(42,3).trim(),
              //  new Date($date),
              //  data[i].substr(84).trim(),
              empid,
              company,
              new Date($date),
              xtime

             ]
         
            ar.push(j);

          }


          newArray = dataToFields(ar);
          //clear the old array
          ar=[];
     
          $srvTimeSheet = sendToServer(JSON.stringify(newArray));
          // alert('xx');
          //console.log($srvTimeSheet);
          // alert($date)
          alert('file uploaded successfully in the server');
          $.LoadingOverlay("hide");

          //
        });

          return false;

      });

      function sendToServer($rows) {
        $jrows = JSON.parse($rows);
        //find the unique value of month
        $uniqMonths = [];
        $uniqBuwan = 0;
        $uniqYear = [];
        $uniqTaon = 0;
        for($i=0;$i<$jrows.length;$i++) {
          // console.log($jrows[$i]);
          if ($jrows[$i][2] != $uniqBuwan || $jrows[$i][1] != $uniqTaon) {
            $uniqBuwan = $jrows[$i][2];
            $uniqTaon = $jrows[$i][1];
            $uniqMonths.push($uniqBuwan);
            $uniqYear.push($uniqTaon);
          }
        }
        // console.log($uniqMonths, $uniqYear);
        // alert('uniquie');
        $.ajax({
          url: '/page/attendance/uploadattendance/*',
          type: 'POST',
          data: {a: $rows, years: $uniqYear.toString(), months :$uniqMonths.toString()},

          success: function(response){
            count = 10000;
            $data = JSON.parse(response);

            if($data.status){
              // alert($data.status);
              $yrmn = $data.yearsMonths;
              $biolist = $data.biolist;

              $("#selyearMonth").empty();
              $("#selyearMonth").append("<option value=''>Select...</option>");
              for( var i = 0; i<$yrmn.length; i++){
                  var $id = $yrmn[i]['temp_biorecord_yr'];
                  var $name = $yrmn[i]['temp_biorecord_mnth'];
                  var $d = $id + '/' + $name;
                  console.log('ddddd', $id, $name, $d);
              }


              $totalDays = getDaysInCurrentMonth($biolist[0]['temp_biorecord_yr'], $biolist[0]['temp_biorecord_mnth']);

              for($i=0;$i < $biolist.length;$i++) {
                for($j=1;$j<=31;$j++) {
                    $cd = 'd'+ $j.toString();
                    text = $biolist[$i]['d'+$j];
                    $d1 = text.replace(/ /g, "\n");
                    $biolist[$i]['d'+$j] = $d1;
                    //console.log($i, $j, $d1);
                }
              }
              // console.log($data);
              // alert('data');
              $tblTimesheetLog.clear().rows.add($biolist).draw();
              return $biolist;
            }else {

                alert('file not uploaded....' + $data.msg);
                return 1;
            }
          },
      });
      return 0;

      }


      function getDaysInCurrentMonth($year, $month) {
        const date = new Date($year, $month, 1);

        return new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0
        ).getDate();
        }


      function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
      }

      function formatDate(date) {
        return [
          date.getFullYear(),
          padTo2Digits(date.getMonth() + 1),
          padTo2Digits(date.getDate()),
        ].join('-');
      }


      function dataToFields(ar) {
        $record = [];
        $record.push(['id', 'yr', 'mnth', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd10', 'd11', 'd12', 'd13', 'd14', 'd15',
                 'd16', 'd17', 'd18', 'd19', 'd20', 'd21', 'd22', 'd23', 'd24', 'd25', 'd26', 'd27', 'd28', 'd29', 'd30', 'd31']);

          ar.shift();
          // console.log(JSON.stringify(ar));
          ar.sort(function (a,b) {
          if (parseInt(a[0]) > parseInt(b[0])) return  1;
          if (parseInt(a[0]) < parseInt(b[0])) return -1;
          if (a[2] > b[2]) return  1;
          if (a[2] < b[2]) return -1;
          return 0;
        });

        //convert the date to string
        $currentID = 0;

        //get all unique id
        $newArray = [];
        for($i=0;$i<ar.length;$i++){

          ar[$i][2] = formatDate(ar[$i][2]);

          $id = parseInt(ar[$i][0]);
          if ($currentID !== $id) {
            $currentID = $id;
            $newArray.push($id);
          }
        }

        $aTime = [];
        for($i=0;$i< $newArray.length;$i++) {
          $aID = ar.filter( (e)=> {
            //console.log(e[0], e[0] == $newArray[$i]);
            return parseInt(e[0]) == $newArray[$i];
          });

          $value = ['id', 'yr', 'mnth',
          '00:00 00:00 00:00 00:00', '00:00 00:00 00:00 00:00', '00:00 00:00 00:00 00:00', '00:00 00:00 00:00 00:00', '00:00 00:00 00:00 00:00',
          '00:00 00:00 00:00 00:00', '00:00 00:00 00:00 00:00', '00:00 00:00 00:00 00:00', '00:00 00:00 00:00 00:00', '00:00 00:00 00:00 00:00',
          '00:00 00:00 00:00 00:00', '00:00 00:00 00:00 00:00', '00:00 00:00 00:00 00:00', '00:00 00:00 00:00 00:00', '00:00 00:00 00:00 00:00',
          '00:00 00:00 00:00 00:00', '00:00 00:00 00:00 00:00', '00:00 00:00 00:00 00:00', '00:00 00:00 00:00 00:00', '00:00 00:00 00:00 00:00',
          '00:00 00:00 00:00 00:00', '00:00 00:00 00:00 00:00', '00:00 00:00 00:00 00:00', '00:00 00:00 00:00 00:00', '00:00 00:00 00:00 00:00',
          '00:00 00:00 00:00 00:00', '00:00 00:00 00:00 00:00', '00:00 00:00 00:00 00:00', '00:00 00:00 00:00 00:00', '00:00 00:00 00:00 00:00',
          '00:00 00:00 00:00 00:00'
        ];

          for($j=0;$j<$aID.length;$j++) {
            // console.log($aID[$j]);
            $value[0] = parseInt($aID[$j][0]);
            $value[1] = parseInt($aID[$j][2].substr(0,4));
            $value[2] = parseInt($aID[$j][2].substr(5,2));
            $day = parseInt($aID[$j][2].substr(8,2));

            $value[$day+2] = $aID[$j][3];
          }

          $aTime.push($value);

        }

        return $aTime;

        }

        // $('#tblTimesheetLog tbody').on('click', '.btnAddLeave', function () {
          
        
        //   $modalLeave.modal('show');
         
          
        // });

      $('#tblTimesheetLog tbody').on('click', '.btnFix', function () {

        $timeEntryAddSave.show();
        $timeEntryEditSave.hide();
        $timeEntryEditCancel.hide();


        //copy the table content of the cell
        dayTable = $(this).parent().parent().children('table');
        dayTableId = dayTable.attr('id');
        // alert(dayTableId);
        
        $sib = $(this).parent().parent().children('table').clone();


        //change table id name to tempTable
        $sib.attr('id', 'tempTable');
        $sib.addClass('table-hover');
        $(".newTable").html($sib);

        $("#tempTable").sortable({
          items: "tbody > tr",
          cursor: 'move',
          opacity: 0.6
        })
      .disableSelection();

        var i = 0;
        var t = document.getElementById('tempTable');

        $("#tempTable tr").each(function() {
          var val1 = $(t.rows[i].cells[0]).text();
          $(this).append($("<td><button class='btn btn-primary btn-sm btnEditTimeCell'><i class='bx bx-edit-alt font-size-16'></i></button>&nbsp;<button class='btn btn-danger btn-sm btnDeleteTimeCell'><i class='bx bx-trash-alt font-size-16'></i></button></td>"));
        //  alert(val1) ;
          i++;
      });

        $modalFix.modal('show');

      });

      //capture edit button inside modal
      $(document).on("click","#tempTable tbody tr td button.btnEditTimeCell", function() { // any button

        $( "#tempTable" ).sortable( "disable" );
        $('button.btnEditTimeCell').prop('disabled', true);
        $('button.btnDeleteTimeCell').prop('disabled', true);

        $row = $(this).closest('tr');
        rowEdited = $row;
        $tds = $row.find("td");
        // console.log($row, $tds[0].innerHTML);
        $("#timeEntry").val($tds[0].innerHTML);
        cmdActTimeEntryEdit = 2;
        $timeEntryAddSave.hide();
        $timeEntryEditSave.show();
        $timeEntryEditCancel.show();


      });

            //capture edit button inside modal
            $(document).on("click","#tempTable tbody tr td button.btnDeleteTimeCell", function() { // any button
              if (confirm('Are you sure to delete this time entry?') === true) {
                $row = $(this).closest('tr').remove();
              }


            });

      //adding new time to table
      $timeEntryAddSave.on('click', function() {
        // console.log($("#timeEntry").val());
        $addedTime = $("#timeEntry").val();
        $td = "<td>"+$addedTime+"</td>";
        $('#tempTable').append( "<tr>"+$td+"<td><button class='btn btn-primary btn-sm btnEditTimeCell'><i class='bx bx-edit-alt font-size-16'></i></button>&nbsp;<button class='btn btn-danger btn-sm btnDeleteTimeCell'><i class='bx bx-trash-alt font-size-16'></i></button></td></tr>" );
      });

      //save edited time
      $timeEntryEditSave.on('click', function() {

        //see rowEdit initialization in when btnEditTimeCell was pressed
        $tds = rowEdited.find('td');
        $tds[0].innerHTML = $("#timeEntry").val();

        $("#timeEntry").val('');
        $('button.btnEditTimeCell').prop('disabled', false);
        $('button.btnDeleteTimeCell').prop('disabled', false);

        $timeEntryAddSave.show();
        $timeEntryEditSave.hide();
        $timeEntryEditCancel.hide();
        $("#tempTable").sortable('enable')
      });

      $("#timeEntryEditCancel").on('click', function() {
        $("#timeEntry").val('');
        cmdActTimeEntryEdit = 3;
        $timeEntryAddSave.show();
        $timeEntryEditSave.hide();
        $timeEntryEditCancel.hide();

        $('button.btnEditTimeCell').prop('disabled', false);
        $('button.btnDeleteTimeCell').prop('disabled', false);

        $("#tempTable").sortable('enable')
      

      });

      $("#btnUpdateModalTable").on('click', function() {

        //get the table name in the datatable
        $id = $(dayTable).attr('id');

        //remove all rows
        $("#" + $id + " tr").each(function() {
          $(this).remove();
        });

        console.log($(dayTable));
        
        // get the modal tempTable
        let tr = document.getElementById("tempTable");
        
        i = 0;
        $("#tempTable tr").each(function() {
          var val1 = $(tr.rows[i].cells[0]).text();
          $(dayTable).append($("<tr><td>"+val1+"</td></tr>"));
          console.log(val1);
          i++;
        });
        alert('time entry updated');
        $modalFix.modal('hide');
      })

      

      $('#tblTimesheetLog tbody').on('click', '.btnApprove', function () {

            var am1 =  $(this).parents("tr td").find("td:eq(0)").text();
            var am2 =  $(this).parents("tr td").find("td:eq(1)").text();
            var pm1 =  $(this).parents("tr td").find("td:eq(2)").text();
            var pm2 =  $(this).parents("tr td").find("td:eq(3)").text();

            $flextime = $(this).parents("tr td").find("#flex-time").find(":selected").val();
            var $flex = $flextime.split('/');

            var $ftimeH = $flex[0];
            var $ftimeM = $flex[1];

           
            
            //  am Time
            var amin = am1.split(':');
            var amout = am2.split(':');

            let amInHour = amin[0];
            let amInMin = amin[1];

            let amOutHour = amout[0];
            let amOutMin = amout[1];

            if(amOutHour >= 12 && amOutMin > 00){
              amOutHour = 12;
              amOutMin = 00;
              if(amInHour == 00 && amInMin == 00 && amOutHour == 00 && amOutMin == 00){
                amOutHour = 00;
                amOutMin = 00;
              }
            }
            
            
            // let amTotalHour =  amInHour - amOutHour;
            // let amTotalMin =  amInMin - amOutMin;

            var aminN = amInHour+':'+amInMin;
            let amIN = moment.duration(aminN, "HH:mm");
            let amOUT = moment.duration( amOutHour +':'+amOutMin, "HH:mm");
            let amTotal = amOUT.subtract(amIN);
           
            let amTotalHour = amTotal.hours();
            let amTotalMin  = amTotal.minutes();
            
            //pm Time 

            var pmin = pm1.split(':');
            var pmout = pm2.split(':');

            let pmInHour = pmin[0];
            let pmInMin = pmin[1];

            let pmOutHour = pmout[0];
            let pmOutMin = pmout[1];

            if(pmInHour < 13 ){
              pmInHour = 13;
              pmInMin = 00;
              if(pmInMin == 00 && pmOutHour == 00 && pmOutMin == 00){
                pmInHour = 00;
                pmInMin = 00;
              }
            }

            if(pmOutHour >= $ftimeM && pmOutMin >= 0 ){
              pmOutHour = $ftimeM;
              pmOutMin = 00;
            }
            // alert (pmOutHour +'-'+ pmOutMin);
            
            // let pmTotalHour = pmInHour - pmOutHour ;
            // let pmTotalMin = pmInMin - pmOutMin;

            var pminN = pmInHour+':'+pmInMin;
            let pmIN = moment.duration(pminN, "HH:mm");
            let pmOUT = moment.duration( pmOutHour +':'+pmOutMin, "HH:mm");
            let pmTotal = pmOUT.subtract(pmIN);
           
            let pmTotalHour = pmTotal.hours();
            let pmTotalMin  = pmTotal.minutes();
            

            //day total hour and minutes
          
            var dayTotalHours = parseInt(Math.abs(amTotalHour)) + parseInt(Math.abs(pmTotalHour));
            var dayTotalMinutes = parseInt(Math.abs(pmTotalMin)) + parseInt(Math.abs(amTotalMin));


            if(dayTotalMinutes > 59 ){
              var min = dayTotalMinutes;
              var hr = Math.floor(min / 60);
              var hrTemp = Math.floor(dayTotalHours);
              var remMin = min % 60;
                  
              dayTotalHours = hr + hrTemp;
              dayTotalMinutes = remMin;
                  
            }
         
           
            $reason = $(this).parents("tr td").find("#reason").find(":selected").val();

           //late
            if( amInHour >= $ftimeH && amInMin >= 00 ){
                // var AmLateHour = amInHour - 09 ;
                // var AmLateMin = amInMin - 00;

                var amINtime = $ftimeH+':'+00;
                let aminTime = moment.duration(amINtime, "HH:mm");
                let amLateTime = moment.duration( amInHour +':'+amInMin, "HH:mm");
                let amlateTotal = amLateTime.subtract(aminTime);
               
                var AmLateHour = amlateTotal.hours();
                var AmLateMin  = amlateTotal.minutes();
                
             }
             
        
            if( pmInHour >= 13 && pmInMin >= 00 ){
              // var PmLateHour = pmInHour - 13 ;
              // var PmLateMin = pmInMin - 00;
              
              var pmINtime = 13+':'+00;
              let pminTime = moment.duration(pmINtime, "HH:mm");
              let pmLateTime = moment.duration( pmInHour +':'+pmInMin, "HH:mm");
              let pmlateTotal = pmLateTime.subtract(pminTime);
             
              var PmLateHour = pmlateTotal.hours();
              var PmLateMin  = pmlateTotal.minutes();
             }


            var HLate = parseInt(AmLateHour) + parseInt(PmLateHour);
            var MLate = parseInt(AmLateMin) + parseInt(PmLateMin);

            if(MLate > 59){
                var minL = MLate;
                var hrL = Math.floor(minL / 60);
                var hrTempL = Math.floor(Math.abs(HLate));
                var remMinL = minL % 60;
                HLate = hrL + hrTempL;
                MLate = remMinL;
             }

            
            
             if(Math.abs(dayTotalHours) <8){
              var prtime = 08+':'+00;
              let valuestart = moment.duration(prtime, "HH:mm");
              let valuestop = moment.duration(Math.abs(dayTotalHours) +':'+Math.abs(dayTotalMinutes), "HH:mm");
              let difference = valuestop.subtract(valuestart);
             
              var UtimeHour = difference.hours();
              var UtimeMin  = difference.minutes();

             
             }
                       
           if($reason == "OFF" || $reason == "NTR" || $reason =="HOL" || $reason =="AWOL"){
            dayTotalHours = 0;
            dayTotalMinutes = 0;
            HLate = 0;
            MLate = 0;
            UtimeHour = 0;
            UtimeMin = 0;
            $flextime = "07/16";
           }
   
           if($reason == "1002" || $reason == "CTO" || $reason =="FHV" || $reason =="FL" ||
              $reason == "MC2" || $reason == "MC25" || $reason == "MC6" || $reason == "MLA"||
              $reason == "PARL" || $reason == "PL" || $reason == "RA9710" || $reason == "RL" ||
              $reason == "SBTL" || $reason == "SL" || $reason == "Study" || $reason == "UPS" ||
              $reason == "VL" || $reason == "WPP"){
            dayTotalHours = 8;
            dayTotalMinutes = 0;
            HLate = 0;
            MLate = 0;
            UtimeHour = 0;
            UtimeMin = 0;
            $flextime = "07/16";
           }


             if( isNaN(HLate)  || isNaN(MLate) ){
              HLate = 0;
              MLate = 0;
             
             }
             if( isNaN(UtimeHour)  || isNaN(UtimeMin ) ){
              UtimeHour = 0;
              UtimeMin = 0;
             }
            
            var calc  = Math.abs(dayTotalHours) +':'+Math.abs(dayTotalMinutes) +' '+ Math.abs(HLate) +':'+ Math.abs(MLate) +' '+  Math.abs(UtimeHour) +':'+Math.abs(UtimeMin);

            // alert(Math.abs(dayTotalHours)+'Hours'+':'+Math.abs(dayTotalMinutes)+'Minutes'+'   '+ 'Total Working Hours'+'   '
            // + Math.abs(HLate)+'Hours' +':'+ Math.abs(MLate)+'Minutes'+'   '+'Total Late '+'   '+
            // +  Math.abs(UtimeHour)+'Hours' +':'+Math.abs(UtimeMin)+'Minutes'+'   '+'Under Time'+'   ');
           
            // alert (calc);
            
            //  return false;

   
      if($flextime == "00/00"){
       alert("Set Schedule");
       return false;
      }
    
        
      
        $res = $(this).parent().parent().find('table');
        let tempId = $res.attr('id');
        x = tempId.split('_');
        var dayId = x[2];


        console.log($res, tempId);

        let tr = document.getElementById(tempId);
        
        i = 0;
        let value =  '';
        $("#"+tempId+" tr").each(function() {
          value += $(tr.rows[i].cells[0]).text() + " ";
          i++;
        });

        $aFind = tempId.split('_');
        console.log($aFind);

        $url = "/page/attendance/updateDayTimeEntries/*";
        $.ajax($url, {
          type: 'POST',
          dataType: 'JSON',
          data: { temp_biorecord : $aFind[1],
                  day : $aFind[2],
                  timeEntries: value.trim(),
                  rea: dayId,
                  reason:$reason,
                  calc:calc
                },
        }).then(function ($data) {

          console.log($data);
          dayTable = $(this).parent().parent().children('table');
          dayTableId = dayTable.attr('id');
          alert(dayTableId);
        });
        $(this).parent().remove();
        // alert('btnApprove');
      });
});