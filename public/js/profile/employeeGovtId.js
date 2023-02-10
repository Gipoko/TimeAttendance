// $(function () {
  var $tblEmployeeGovtId;
  var $frmEmployeeGovtID = $("#frmEmployeeGovtID");
  var $rbranch_id = $("#rbranch_id");
  var $rbranch_name = $("#rbranch_name");
  var $rbranch_address = $("#rbranch_address");
  var $btnEmployeeGovtIdAdd = $("#btnEmployeeGovtIdAdd");
  var $modalEmployeeGovtID = $("#modalEmployeeGovtID");
  var $modalEmployeeGovtIDTitle = $("#modalEmployeeGovtIDTitle");
  var $btnHumanResourcesEmployeeGovtIDSave = $("#btnHumanResourcesEmployeeGovtIDSave");
  var $dummy = { rbranch_id:0, rbranch_name:'', rbranch_address :'' };
  var $lastCmd = 0;
  var $temp_govtid_id = $("#temp_govtid_id");
	var $temp_id = $("#temp_id");
	var $rgovernment_id = $("#rgovernment_id");
	var $temp_govtid_id_no = $("#temp_govtid_id_no");
	var $temp_govtid_place_issued = $("#temp_govtid_place_issued");
	var $temp_govtid_date_issued = $("#temp_govtid_date_issued");
	var $temp_govtid_date_expire = $("#temp_govtid_date_expire");

  var $aGovtIDs;

  $sel2RGovtID = $("#rgovernment_id").select2({});

  $processing = true;
  $.when(fetchMe('/page/ref/cGovtId/list/*'))
  .then(function(resGovtID ) { // Resolve

    $aGovtIDs = JSON.parse(resGovtID);

    $sel2RGovtID.select2();

    select2SetInit($sel2RGovtID,'#modalEmployeeGovtID .modal-body', $aGovtIDs);

    select2SetValidation($sel2RGovtID);

    }, function(){ // Reject!
    console.log('Something broke!');
  });

  $tblEmployeeGovtId = $('#tblEmployeeGovtId').DataTable( {
    "bInfo" : false,
    "responsive": true,
    "processing": true,
    "autoWidth": true,
    "searching": false,
    "paging": false,
    "sDom": 'rt',

    columns: [
      { data:"temp_govtid_id", title: "Id" },
      { data:"temp_govtid_details", title: "Government ID" },
      { data:"temp_govtid_date_issued", title: "Issued" },
      { data:"temp_govtid_date_expire", title: "Expire" },
      { data:"action", title: "Action" }
    ]
  } );
// });

//load the government Ids
$url = "/page/employee/details/govtid/list/*";
$.ajax($url, {
  type: 'POST',
  dataType: 'JSON'
}).then(function ($data) {
  // reload family members

  $tblEmployeeGovtId.clear().rows.add($data.GovtID).draw();

});

//employee philsys_id date of issue
$('#temp_govtid_date_issued').datepicker({
  format: 'yyyy-mm-dd',
  autoclose: true
});

//employee date of birth
$('#temp_govtid_date_expire').datepicker({
  format: 'yyyy-mm-dd',
  autoclose: true
});

//validate branch entry
$('#frmEmployeeGovtID').validate({
  focusInvalid: false,
  ignore: [],
  rules: {
    'rbranch_name': {
      required: true
    },
    'rbranch_address': {

      required: true
    }
  },

  submitHandler: function (form) {
    let $cmdPosting = ['save', 'edit', 'delete'];
    // ajax call code here
    var $url = "/page/employee/details/govtid/" + ['add', 'edit', 'delete'][$lastCmd-1] + '/*';

    //var $result = JSON.parse(postData($url, $("#frmOfficeSetupBranch").serialize()));
    $.ajax({
      url: $url,
      type: 'POST',
      data: $("#frmEmployeeGovtID").serialize(),
      success: function (data) {

        $newData =JSON.parse(data);
        console.log($newData);

        Swal.fire({
          icon: $newData.icon,
          title: $newData.msgTitle,
          text: $newData.msgContent
        });

        if ($newData.status) {
          $tblEmployeeGovtId.clear().rows.add($newData.GovtID).draw();
          $modalEmployeeGovtID.modal('hide');
        }
        return false;
      }
    });

    return false;
  }
});

//add new government id
$btnEmployeeGovtIdAdd.on('click', function(e) {

  $lastCmd = 1;
  clearGovtIDForm($dummy);
  $modalEmployeeGovtIDTitle.html("New Government ID");
  $btnHumanResourcesEmployeeGovtIDSave.show();
  $btnHumanResourcesEmployeeGovtIDSave.html("Save");
  $modalEmployeeGovtID.modal('show');
});

//branch editing
$('#tblEmployeeGovtId tbody').on('click', '.btnGovtIDEdit', function () {
  $lastCmd = 2;
  $data = $(this).data();
  console.log($data);

  $id = $data.id;

  //find it in db
  $url = "/page/employee/details/govtid/display/" + $id;
  $.ajax($url, {
    type: 'POST',
    dataType: 'JSON'
  }).then(function ($data) {
    // reload family members

    setGovtIDValues($data.GovtID);
    $modalEmployeeGovtIDTitle.html("Update Government ID");
    $btnHumanResourcesEmployeeGovtIDSave.show();
    $btnHumanResourcesEmployeeGovtIDSave.html("Update Changes");
    $modalEmployeeGovtID.modal('show');

  });
});

//branch editing
$('#tblEmployeeGovtId tbody').on('click', '.btnGovtIDDelete', function () {
  $lastCmd = 3;
  $data = $(this).data();
  console.log($data);

  $id = $data.id;

  //find it in db
  $url = "/page/employee/details/govtid/display/" + $id;
  $.ajax($url, {
    type: 'POST',
    dataType: 'JSON'
  }).then(function ($data) {
    // reload family members

    setGovtIDValues($data.GovtID);
    $modalEmployeeGovtIDTitle.html("Delete Government ID");
    $btnHumanResourcesEmployeeGovtIDSave.show();
    $btnHumanResourcesEmployeeGovtIDSave.html("Delete");
    $modalEmployeeGovtID.modal('show');

  });
});

$('#tblEmployeeGovtId tbody').on('click', '.btnGovtIDView', function () {
  $lastCmd = 2;
  $data = $(this).data();
  console.log($data);

  $id = $data.id;

  //find it in db
  $url = "/page/employee/details/govtid/display/" + $id;
  $.ajax($url, {
    type: 'POST',
    dataType: 'JSON'
  }).then(function ($data) {
    // reload family members
    console.log($data);
    alert('xxxxx');
    setGovtIDValues($data.GovtID);
    $modalEmployeeGovtIDTitle.html("Update Government ID");
    $btnHumanResourcesEmployeeGovtIDSave.hide();
    $modalEmployeeGovtID.modal('show');

  });
});

function setGovtIDValues($govtIds) {
  $temp_govtid_id.val($govtIds.temp_govtid_id);
	$temp_id.val($govtIds.temp_id);
	$rgovernment_id.val($govtIds.rgovernment_id).trigger("change");
	$temp_govtid_id_no.val($govtIds.temp_govtid_id_no);
	$temp_govtid_place_issued.val($govtIds.temp_govtid_place_issued);
	$temp_govtid_date_issued.val($govtIds.temp_govtid_date_issued);
	$temp_govtid_date_expire.val($govtIds.temp_govtid_date_expire);
}
function clearGovtIDForm() {
  $temp_govtid_id.val('').trigger("change");
	$temp_id.val('');
	$rgovernment_id.val('');
	$temp_govtid_id_no.val('');
	$temp_govtid_place_issued.val('');
	$temp_govtid_date_issued.val('');
	$temp_govtid_date_expire.val('');
}