$(document).ready( function () {

  var $tblTimesheet;
  let $modalFixAbnormalTime = $("#modalFixAbnormalTime");
  var $tblTimeSheetDetail = $("#tblTimeSheetDetail");
  let $schedReference;
  var $colCounter = 0;
  var $idToUpdate = '';
  var $parentCell;
  var $cellID;
  var $selectedCellValues;

  var getDaysInMonth = function(month,year) {
    // Here January is 1 based
    //Day 0 is the last day in the previous month
   return new Date(year, month, 0).getDate();
  // Here January is 0 based
  // return new Date(year, month+1, 0).getDate();
  };

  $("#btnValidateTimesheet").prop('disabled', true);

  $("#selyearMonth").on('change', function(e){
    $val = $(this).val();
    $url = "/system/human-resource/attendance/get-selected-yr-month-timesheet";
    $.ajax($url, {
      type: 'POST',
      dataType: 'JSON',
      data : {year_month: $val},
    }).then(function ($result) {
      if (jQuery.isEmptyObject($result.data)) {
        $("#btnValidateTimesheet").prop('disabled', true);
      } else {
        $("#btnValidateTimesheet").prop('disabled', false);
      }

    const myArr = $val.split("/");

     var d = new Date(myArr[0], myArr[1] - 1, 1);
     var y = d.getFullYear();
     var m = d.getMonth();
     var td = getDaysInMonth(m+1, y);



     var da = d.getDay();
     console.log(y,m+1,d,td,da);
     $ad = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
     for($i=0;$i<td;$i++) {

      var d = new Date(y,m,$i+1);
      var cd = $ad[d.getDay()];
      var $j = $i+1;
      var head_item = $tblTimesheet.columns($j).header();
      if (d.getDay() == 0 || d.getDay() == 6) {
        $header = '<div class="text-center text-danger">'+$j + '<br>' + cd+'</div>';
      } else {
        $header = '<div class="text-center">'+$j + '<br>' + cd+'</div>';
      }

      $(head_item ).html($header);
      console.log('i', $i);
     }
     //this part hide a column
     //$tblTimesheet.column(0).visible(false);

     $tblTimesheet.clear().rows.add($result.data).draw();

    });
    return false;
  });



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
    "columnDefs": [
      { width: 200, targets: 1 }
    ],

    "columns": [
      { "data": "fullName" },
      { "data": "d1" },
      { "data": "d2" },
      { "data": "d3" },
      { "data": "d4" },
      { "data": "d5" },
      { "data": "d6" },
      { "data": "d7" },
      { "data": "d8" },
      { "data": "d9" },
      { "data": "d10" },
      { "data": "d11" },
      { "data": "d12" },
      { "data": "d13" },
      { "data": "d14" },
      { "data": "d15" },
      { "data": "d16" },
      { "data": "d17" },
      { "data": "d18" },
      { "data": "d19" },
      { "data": "d20" },
      { "data": "d21" },
      { "data": "d22" },
      { "data": "d23" },
      { "data": "d24" },
      { "data": "d25" },
      { "data": "d26" },
      { "data": "d27" },
      { "data": "d28" },
      { "data": "d29" },
      { "data": "d30" },
      { "data": "d31" }
      // { "data": "d32" }
    ],
    columnDefs: [
      {
          render: function (data, type, full, meta) {
              return "<div class='text-wrap width-200'>" + data + "</div>";
          },
          targets: 0
      }
   ],
   scrollY:        "350px",
   paging:         false,
   scrollCollapse: true,
        fixedColumns:   {
            leftColumns: 1,
            rightColumns: 1
        }
  } );



  
  




function createRows($data) {
  var $aNewData = [];

    $data.shift();  //remove first row
    $data.shift();  //remove second row
    var $xdata = $data[0][2]; //3rd row became first row, get the date

    $date = $xdata;
    $yr = $date.substring(0,4); //get the year
    $mn = $date.substr(5,2);    //get the month
    var $id = 0;
    
    $data.shift();  //date taken, remove it from the array rows

    for($i=0;$i<$data.length;$i++) {
      $i++;
      $id = $data[$i][2];
      $name = $data[$i][9];

      $i++;
      $aObj = {tperson_biometric_id:$id, tbiorecord_yr:$yr, tbiorecord_mnth:$mn};

      for($day=0;$day<$data[$i].length;$day++) {
        $newDay = $data[$i][$day];
        //console.log('first new day ', $newDay);
        if ($newDay === undefined || $newDay ===' ' || $newDay ==='') {
          $newDay = "00:00 00:00 00:00 00:00";
        } else {
          $newDay =  $newDay.replace(/\r\n|\r|\n/g, ' ').trim().replace(/\r/g, ' ');
          $newDay = $newDay.replace(/  +/g, ' ');
        }
        $d = 'd' + String($day+1);


        //console.log('$newday : ', $newDay);

        $aObj[$d] = $newDay;
        
      }

      $aNewData.push($aObj);

    }

    sendToServer($aNewData);
    return $aNewData;
}




  $("#btnUpload").click(function() {

    let reader = new FileReader();
    reader.readAsText(selected);

    var fd = new FormData();
    var files = $('#file')[0].files;

    // Check file selected or not
    if(files.length > 0 ){
      fd.append('file',files[0]);


      $.LoadingOverlay("show", {
          background  : "rgba(255, 255, 255, .95)",
          image       : "",
          text        : "Uploading and processing timesheets in progress, it will take less than 90 seconds to complete, pls wait...",
          progress    : true,
          size        : 4
      });

      var count     = 0;
      var interval  = setInterval(function(){
          if (count >= 900000000) {
              clearInterval(interval);
              $.LoadingOverlay("hide");
              return;
          }
          count += 10;
          $.LoadingOverlay("progress", count);
      }, 300);


      $.ajax({
          url: '/system/human-resource/attendance/upload2',
          type: 'post',
          data: fd,
          contentType: false,
          processData: false,
          success: function(response){
            count = 10000;
            $data = JSON.parse(response);
            console.log($data);

            if($data.status){
              $yrmn = $data.yearsMonths;
              $("#selyearMonth").empty();
              $("#selyearMonth").append("<option value=''>Select...</option>");
              for( var i = 0; i<$yrmn.length; i++){
                  var $id = $yrmn[i]['tbiorecord_yr'];
                  var $name = $yrmn[i]['tbiorecord_mnth'];
                  var $d = $id + '/' + $name;
                  console.log('ddddd', $id, $name, $d);

                  $("#selyearMonth").append("<option value='"+$d+"'>"+$d+"</option>");
              }

              alert('file uploaded successfully');
              $.LoadingOverlay("hide");
              return false;
            }else {
              $.LoadingOverlay("hide");
                alert('file not uploaded....' + $data.msg);
            }
          },
      });
    } else {
      alert("Please select a file.");
      return false;
    }
});


  $tblTimeSheetDetail = $('#tblTimeSheetDetail').DataTable({
    "responsive": true,
    "processing": true,
    "searching": false,     //hide searching
    "bLengthChange": false,
    "ordering": false,      //no sorting in column name
    "bInfo" : false,        //hide showing entries
    "bPaginate": false,
    // fixedColumns: true,
    "order": [[ 0, "desc" ]],

   "columns": [
    { "data": "timeRecord" },
     { "data": "action" }
   ],
   "columnDefs": [
    {
      "targets": [0], // your case first column
      "className": "text-center timesheet-detail-cell"
       },
       {
      "targets": [1], // your case first column
      "className": "text-center"
       }
  ],
  // ,
  // "rowCallback": function( row, data, index ) {
  //   console.log((data.timeRecord).length,index, row);
  //   if (data.timeRecord === "00:00") {
  //     $('td.timesheet-detail-cell', row).css('background', 'red');
  //   }
  // }
  });

  // $('#selectId').width(175);


  $('#tblTimesheet tbody').on('click', '.btnTimingIsCorrect', function () {
    $cellID = $(this).data();
    $parentCell = $(this).parent();
    $tableValue = $(this).parent().children()[0].outerHTML;
    console.log($tableValue);
    $idToUpdate = $cellID.id;

    $url = "/system/human-resource/attendance/save-timing-is-correct";
    $.ajax($url, {
      type: 'POST',
      dataType: 'JSON',
      data : {id: $idToUpdate, yrmonth : $("#selyearMonth").val()},
    }).then(function ($result) {
      $tblTimesheet.cell($parentCell).data($tableValue);
      //$tblTimesheet.cell($parentCell).data($tableValue).draw();
      return false;
    });
  });


  $('#tblTimesheet tbody').on('change', '.selLeaveOpt', function () {
    $parentCell = $(this).parent();
    $cellID = $(this).data();
    console.log('cell', $cellID.id);
    console.log('parentCell', $parentCell);
    console.log($tblTimesheet.cell( $(this).parents('td') ));

    $url = "/system/human-resource/attendance/update-absent-reason";

    $.ajax($url, {
      type: 'POST',
      dataType: 'JSON',
      data : {id : $cellID.id, absno : $(this).val()},
    }).then(function ($result) {
    });
  });

 $('#tblTimesheet tbody').on('click', '.btnFixAbnormalTime', function () {

  //clear old value
  $("#adjusted_time").val('');
  $selectedCellValues = $tblTimesheet.cell( $(this).parents('td') );
 // $selectedCellValues.data( 'juuuuuuun' ).draw();


  $parentCell = $(this).parent();

  console.log('parentCell', $parentCell);
    $cellID = $(this).data();
    $parentCell = $(this).parent();

    $idToUpdate = $cellID.id;


    $url = "/system/human-resource/attendance/get-selected-cell";
    $.ajax($url, {
      type: 'POST',
      dataType: 'JSON',
       data : {id:$idToUpdate},
    }).then(function ($result) {
      $tblTimeSheetDetail.clear().rows.add($result.data).draw();
      $schedReference = $result.schedReference;
      console.log('$schedReference',$schedReference);
      $("#rsched_datefrom").val($schedReference.rsched_datefrom);
      $("#rsched_dateto").val($schedReference.rsched_dateto);
      $("#rsched_d1").prop("checked", $schedReference.rsched_d1 ==="1" ? true : false);
      $("#rsched_d2").prop("checked", $schedReference.rsched_d2 ==="1" ? true : false);
      $("#rsched_d3").prop("checked", $schedReference.rsched_d3 ==="1" ? true : false);
      $("#rsched_d4").prop("checked", $schedReference.rsched_d4 ==="1" ? true : false);
      $("#rsched_d5").prop("checked", $schedReference.rsched_d5 ==="1" ? true : false);
      $("#rsched_d6").prop("checked", $schedReference.rsched_d6 ==="1" ? true : false);
      $("#rsched_d7").prop("checked", $schedReference.rsched_d7 ==="1" ? true : false);
      //rsched_am_in
      $('#rsched_am_in').val($schedReference.rsched_am_in);
      $('#rsched_pm_in').val($schedReference.rsched_pm_in);
      $('#rsched_am_out').val($schedReference.rsched_am_out);
      $('#rsched_pm_out').val($schedReference.rsched_pm_out);
      $('#rsched_ot_inc').val($schedReference.rsched_ot_inc);
      $('#rsched_ot_out').val($schedReference.rsched_ot_out);
      // $("#").val();
      if ($schedReference.rsched_am_out === null || $schedReference.rsched_pm_in ==='' ) {
        $("#btnFirstEntryTimeOut").hide();
        $("#btnSecondEntryTimeIn").hide();
      } else {
        $("#btnFirstEntryTimeOut").show();
        $("#btnSecondEntryTimeIn").show();
      }

      $("#rsched_isbrokentime").prop("checked", $schedReference.rsched_isbrokentime ==="1" ? true : false);
      $("#rsched_haveot").prop("checked", $schedReference.rsched_haveot ==="1" ? true : false);

      $modalFixAbnormalTime.modal('show');
   });
    return false;
 });

 $('#tblTimeSheetDetail tbody').on('click', '.btnTimeSheetDetailDelete', function () {
  $tblTimeSheetDetail
  .row( $(this).parents('tr') )
  .remove()
  .draw();
    return false;
  });

  $("#btnSaveFixedTimeLog").on('click', function(e) {


   var table = document.getElementById('tblTimeSheetDetail');

    var rowLength = table.rows.length;
    $a = '';
    $d = '';
    $aRows = [];
    for(var i=0; i<rowLength; i++){
        var row = table.rows[i];


        if (i>0) {
          $a += ' ' + row.cells[0].innerHTML;
          $aRows.push(row.cells[0].innerHTML);
        }

    }

    console.log($aRows, $aRows.length);
    console.log($a);
    // alert('jun');
  if ($aRows.length >4) {
    alert('Time registered is more than 4');
    return false;
  }

  if ($aRows.length < 4) {
    alert('Time registered is less than 4');
    return false;
  }

  //update the cell value


  $url = "/system/human-resource/attendance/save-updated-timesheet";
  $.ajax($url, {
    type: 'POST',
    dataType: 'JSON',
    data : {id: $idToUpdate, timesheet: $a.trim(), yrmonth : $("#selyearMonth").val()},
  }).then(function ($result) {
    //recreate value of table cell;
    $table =  '<table class="tbl">';
    for($i=0;$i<$aRows.length;$i++) {
      $table += '<tr><td>' + $aRows[$i] + '</td></tr>';
    }
    $table += '</table>';

    $t =$table;
    $b1 = '<button class="btn btn-success btn-sm waves-effect waves-light btnTImeCorrect" data-id="'+$cellID.id+'"><i class="bx bx-check font-size-14 align-middle"></i></button>&nbsp;';

    $b2 = '<button class="btn btn-primary btn-sm waves-effect waves-light btnFixAbnormalTime" data-id="'+$cellID.id+'">fix</button>';
    //$tblTimesheet.cell($parentCell).data($t).draw();
    $selectedCellValues.data($t);
    $modalFixAbnormalTime.modal('hide');
    return false;
  });
  });

  $("#btnValidateTimesheet").on('click', function(e) {

    $url = "/system/human-resource/attendance/validate-timesheet";

    $.ajax($url, {
      type: 'POST',
      dataType: 'JSON',
      data : {yrmonth : $("#selyearMonth").val()},
    }).then(function ($result) {
      //
      //swal
      if ($result.errorCounts >0) {
        Swal.fire({
          icon:'error',
          title: $result.errorCounts + ' error(s) found',
          text: $result.fullName + ' have unfixed time entries. dated ' + $result.dayWithError
        });
      } else {
        console.log($result.validated);
        Swal.fire({
          icon:'success',
          title: 'No error found',
          text: 'You can now print the timesheet'
        });
      }

      console.log('jun', $result);
      // findNotConfirmed($result);
      return false;
    });
  });

//get year month list
$sel2RYearMonth = $("#selYearMonth").select2({});
$url = "/page/attendance/getYearMonth/*";
$.ajax($url, {
    type: 'POST',
    dataType: 'JSON'
}).then(function ($resYearMonth) {
    console.log('jun', $resYearMonth);

    $sel2RYearMonth.select2({
        dropdownParent: $('.jun'),
        minimumResultsForSearch: -1,
        width: '100%',
        data: $resYearMonth
    });

    $sel2RYearMonth.on('select2:select', function (e) {
        $ym = $(this).val();
        if ($ym == '') {

            $tblAttendanceLog.clear().draw();
            var link = document.getElementById("prntAttendanceLog");
            link.setAttribute('href', "javascript: void(0)");
            return false;
        }
        $selEmployeeList.empty();
        for (i = 0; i < $aEmployList.length; i++) {
            $selEmployeeList.append('<option value="' + $aEmployList[i].id + '">' + $aEmployList[i].text + '</option>');
        }
        $selEmployeeList.val(-1);
    });
});


//get employee list
$selEmployeeList = $("#selEmployeeList").select2({});
$url = "/page/human-resources/employee/getEmployeeList/*";
$.ajax($url, {
    type: 'POST',
    dataType: 'JSON'
}).then(function ($resEmployeeList) {
    console.log($resEmployeeList);
    $aEmployList = $resEmployeeList;

    $selEmployeeList.on('select2:select', function (e) {
        $yymm = $sel2RYearMonth.val();
        $mid = $(this).val();


        $url = "/page/attendance/getEmployeeAttendance/*";
        $data = {
            temp_id: $mid,
            temp_dtrbio_yy: $yymm.substr(0, 4),
            temp_dtrbio_mm: $yymm.substr(-2)
        }

        $columns = [];
        $.ajax($url, {
            type: 'POST',
            dataType: 'JSON',
            data: $data
        }).then(function ($result) {
            console.log($result.attendanceLogs);
            alert('jun here xx');
            $tblAttendanceLog.clear().rows.add($result.attendanceLogs).draw();
            //change the link of the print attendance log
            $url = "javascript:voide(0)";
            if ($result.attendanceLogs.length > 0) {
                $url = "/page/attendance/printAttendanceLog/" + $yymm + "~" + $mid;
            }
            var link = document.getElementById("prntAttendanceLog");
            link.setAttribute('href', $url);
        });
    });
});

  // $("#tblTimeSheetDetail").sortable({
  //     items: "tbody > tr",
  //     cursor: 'move',
  //     opacity: 0.6
  //   })
  // .disableSelection();

  //add dummy data to table
  $("#dummy_time_add").on('click', function(e) {
    $tblTimeSheetDetail.row.add({
      "timeRecord":       "00:00",
      "action":       '<button class="btn btn-danger waves-effect waves-light btnTimeSheetDetailDelete" data-id="2-">Delete</button>'
  }).draw(false);
  });

  $("#adjusted_time_add").on('click', function(e) {
    $tblTimeSheetDetail.row.add({
      "timeRecord":       $("#adjusted_time").val(),
      "action":       '<button class="btn btn-danger waves-effect waves-light btnTimeSheetDetailDelete" data-id="2-">Delete</button>'
  }).draw(false);
  });




  function findNotConfirmed($result) {
    $cnt = $result.length;
    for($i=0;$i<$cnt;$i++) {
      console.log($result[$i]['fullName']);

    }
  }

  function handleFile(e) {
    alert(e.target);
    var exceljsonObj = [];
    var files = e.target.files;
    var i, f;
    for (i = 0, f = files[i]; i != files.length; ++i) {
        var reader = new FileReader();
        var name = f.name;
        reader.onload = function (e) {
            var data = e.target.result;
            var result;
            var workbook = XLSX.read(data, { type: 'binary' });
            var sheet_name_list = workbook.SheetNames;
            sheet_name_list.forEach(function (y) { /* iterate through sheets */
                //var exceljsonObj = [];
                var rowObject  =  XLSX.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                exceljsonObj = rowObject;
                    for(var i=0;i<exceljsonObj.length;i++){
                    //var recordcount = exceljsonObj.length;
                    var data = exceljsonObj[i];
                    $('#myTable tbody:last-child').append("<tr><td>"+data.ID+"</td><td>"+data.Name+"</td><td>"+data.Months+"</td></tr>");
                    }
                //alert(exceljsonObj.length);
                    $('#alermessage').each(function() {
                       //this points to item
                       alert('Record Count is '+exceljsonObj.length);
                    });
            });
        };
        reader.readAsArrayBuffer(f);
    }
}

$tblAttendanceLog = $('#tblAttendanceLog').DataTable({
  "processing": true,
  "serverSide": false,
  "searching": false,
  "paging": true,
  scrollX: true,
  columns: [
      { data: "temp_dtrbio_id", title: "ID", "visible": false },
      { data: "temp_id", title: "ID", "visible": false },
      {
          data: 'temp_dtrbio_yy',
          title: 'year',
          render: function (data, type, row) {
              return renderTextArea(data, type, row, 'year');
          }
      },
      {
          data: 'temp_dtrbio_mm',
          title: 'month',
          render: function (data, type, row) {
              return renderTextArea(data, type, row, 'month');
          }
      },
      {
          data: 'temp_dtrbio_dd',
          title: 'day',
          render: function (data, type, row) {
              return renderTextArea(data, type, row, 'day');
          }
      },
      {
          data: 'temp_dtrtime_01',
          title: 'T01',
          render: function (data, type, row) {
              return renderTextArea(data, type, row, 'T01');
          }
      }

  ]
});

function renderTextArea(data, type, row, fldName) {
  if (data == null) {
      data = "00:00";
  }
  $id = "id" + row.temp_dtrbio_id + '_' + fldName;

  $div = '<div class="row">';
  $div += '    <div class="col-sm-12">';
  $div += '       <textarea id="' + $id + '" style="resize:none;scrollbar-width: thin;overflow-x: hidden;" rows="2" cols="1" name="' + $id + '">' + data + '</textarea>';
  $div += '    </div>';
  $div += '    <div class="col-sm-12 text-center mt-1">';
  $div += '<button class="btn btnInsertFakeTime"><i class="bx bx-customize m-0 text-muted h5"></i></button>';
  $div += '<button class="btn btnClearTime"><i class="bx bx-trash m-0 text-muted h5"></i></button>';
  $div += '    </div>';
  $div += '</div>';
  return $div;
}

});