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



  $tblTimesheet = $('#tblTimesheet').DataTable( {
     "responsive": false,
     "processing": true,
     "autoWidth": true,
    // "scrollX": true,
     "ordering": false,


    // // "dom": "lrtip",

    // paging:         true,
    // "bLengthChange": true,


    scrollX:        true,
    // scrollCollapse: true,
    paging:         false,
    fixedColumns:   {
        leftColumns: 1
    },

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



  $("#btnUpload").click(function() {

    var fileUpload = document.getElementById("file");

    //Validate whether File is valid Excel file.
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
    let $newRows;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();

            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
                reader.onload = function (e) {
                  $newRows = ProcessExcel(e.target.result);

                  //send to server
                  sendToServer($newRows);

                };
                reader.readAsBinaryString(fileUpload.files[0]);
            }
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid Excel file.");
    }

      // Check file selected or not

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
  });

  function sendToServer($rows) {
    let data = new FormData();

    $.ajax({
      url: '/system/human-resource/attendance/upload',
      type: 'POST',
      data: {a: JSON.stringify($rows)},

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
  }

  function ProcessExcel(data) {
    //Read the Excel File data.
    var workbook = XLSX.read(data, {
        type: 'binary'
    });

    //Fetch the name of First Sheet.
    var firstSheet = workbook.SheetNames[0];

    //Read all rows from First Sheet into an JSON array.
    var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);

    $aData = createRows(excelRows);
    return $aData;
    //send to server
};

function createRows($data) {
    $adata = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd10',
              'd11','d12', 'd13', 'd14', 'd15', 'd16','d17', 'd18','d19','d20',
              'd21','d22','d23','d24','d25','d26', 'd27','d28','d29', 'd30', 'd31'];

    $date = $data[0]['__EMPTY_1'];
    $yr = $date.substring(0,4);
    $mn = $date.substr(5,2);
    var $id = 0;
    var $name = '';
    $data.shift();

    $js = JSON.stringify($data);
    console.log($js);
    
    $js = $js.replace(/Attend. Logs/g, "d1");
    $js = $js.replace(/__EMPTY_29/g, "d31");
    $js = $js.replace(/__EMPTY_28/g, "d30");
    $js = $js.replace(/__EMPTY_27/g, "d29");
    $js = $js.replace(/__EMPTY_26/g, "d28");
    $js = $js.replace(/__EMPTY_25/g, "d27");
    $js = $js.replace(/__EMPTY_24/g, "d26");
    $js = $js.replace(/__EMPTY_23/g, "d25");
    $js = $js.replace(/__EMPTY_22/g, "d24");
    $js = $js.replace(/__EMPTY_21/g, "d23");
    $js = $js.replace(/__EMPTY_20/g, "d22");
    $js = $js.replace(/__EMPTY_19/g, "d21");
    $js = $js.replace(/__EMPTY_18/g, "d20");
    $js = $js.replace(/__EMPTY_17/g, "d19");
    $js = $js.replace(/__EMPTY_16/g, "d18");
    $js = $js.replace(/__EMPTY_15/g, "d17");
    $js = $js.replace(/__EMPTY_14/g, "d16");
    $js = $js.replace(/__EMPTY_13/g, "d15");
    $js = $js.replace(/__EMPTY_12/g, "d14");
    $js = $js.replace(/__EMPTY_11/g, "d13");
    $js = $js.replace(/__EMPTY_10/g, "d12");
    $js = $js.replace(/__EMPTY_9/g, "d11");
    $js = $js.replace(/__EMPTY_8/g, "d10");
    $js = $js.replace(/__EMPTY_7/g, "d9");
    $js = $js.replace(/__EMPTY_6/g, "d8");
    $js = $js.replace(/__EMPTY_5/g, "d7");
    $js = $js.replace(/__EMPTY_4/g, "d6");
    $js = $js.replace(/__EMPTY_3/g, "d5");
    $js = $js.replace(/__EMPTY_2/g, "d4");
    $js = $js.replace(/__EMPTY_1/g, "d3");
    $js = $js.replace(/__EMPTY/g, "d2");
    
    // /\r?\n|\r/g
    $newdata = JSON.parse($js);

    $aNewData = [];
    for($i=0;$i < $newdata.length;$i++) {
        $i++;

        $id = $newdata[$i]['d3'];
        $name = $newdata[$i]['d10'];
        $i++;

        var x = $newdata[$i];

        $aObj = {tperson_biometric_id:$id, tbiorecord_yr:$yr, tbiorecord_mnth:$mn};
        for($j=0;$j<$adata.length;$j++) {
            $p = 'x' + '.' + [$adata[$j]]; //convert as string
            $np = eval($p);
            console.log($np);
            
            if ($np == undefined || $np==" ") {
                $np = "00:00 00:00 00:00 00:00";
            } else {
              $np = $np.replace(/\r?\n|\r/g, " ");
            }

            console.log($id, $np);
            $aObj[$adata[$j]] =$np.trim();
        }

        $aNewData.push($aObj);

    }
    return $aNewData;
}


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

 $('#tblTimesheet tbody').on('click', '.btnFixAbnormalTime', function () {

  $selectedCellValues = $tblTimesheet.cell( $(this).parents('td') );
 // $selectedCellValues.data( 'juuuuuuun' ).draw();


  $parentCell = $(this).parent();

  console.log('parentCell', $parentCell);
    $cellID = $(this).data();
    $parentCell = $(this).parent();

    $idToUpdate = $cellID.id;


    $url = "/system/human-resource/attendance/get-selected-cell";
    alert('jun');
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
    $a = '';
    $d = '';
    $aRows = [];
    $tblTimeSheetDetail.rows().eq(0).each( function ( index ) {
      var row = $tblTimeSheetDetail.row( index );
      var data = row.data();
      $a += data.timeRecord +' ';
      $d += data.timeRecord +'<br>';
      $aRows.push(data.timeRecord);
  } );

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
    data : {id: $idToUpdate, timesheet: $a, yrmonth : $("#selyearMonth").val()},
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

  function findNotConfirmed($result) {
    $cnt = $result.length;
    for($i=0;$i<$cnt;$i++) {
      console.log($result[$i]['fullName']);

    }
  }

});