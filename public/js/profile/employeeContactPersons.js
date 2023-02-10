// $(function () {
var $tblEmployeeContactPersons;
var $frmEmployeeContactPerson = $("#frmEmployeeContactPerson");
var $btnEmployeeContactPersonAdd = $("#btnEmployeeContactPersonAdd");
var $lastCmd = 0; 

var $modalEmployeeContactPerson = $("#modalEmployeeContactPerson");
var $modalEmployeeContactPersonTitle = $("#modalEmployeeContactPersonTitle");
var $btnHumanResourcesEmployeeContactPersonSave = $("#btnHumanResourcesEmployeeContactPersonSave");

var $temp_contact_id = $("#temp_contact_id");
var $temp_id = $("#temp_id");
var $temp_contact_rrelation_id = $("#temp_contact_rrelation_id");
var $temp_contact_first = $("#temp_contact_first");
var $temp_contact_mid = $("#temp_contact_mid");
var $temp_contact_last = $("#temp_contact_last");
var $temp_contact_suffix_id = $("#temp_contact_suffix_id");
var $temp_contact_home_address = $("#temp_contact_home_address");
var $temp_contact_home_phone = $("#temp_contact_home_phone");
var $temp_contact_mobile = $("#temp_contact_mobile");
var $temp_contact_email = $("#temp_contact_email");
var $temp_contact_company_name = $("#temp_contact_company_name");
var $temp_contact_company_phone = $("#temp_contact_company_phone");
var $temp_contact_company_address = $("#temp_contact_company_address");
var $temp_contact_company_email_address = $("#temp_contact_company_email_address");
var $temp_contact_created = $("#temp_contact_created");
var $temp_contact_updated = $("#temp_contact_updated");
var $aContactRelation;
var $aContactSuffix;

$sel2RContactRelation = $("#temp_contact_rrelation_id").select2({});
$sel2RContactSuffix = $("#temp_contact_suffix_id").select2({});

$processing = true;
$.when(fetchMe('/page/ref/cRelation/list/20'),
  fetchMe('/page/ref/csuffix/list/*')
)
.then(function(resRelation, resSuffix ) { // Resolve

  $aContactRelation = JSON.parse(resRelation[0]);
  $aContactSuffix = JSON.parse(resSuffix[0]);

  $sel2RContactRelation.select2();
  $sel2RContactSuffix.select2();

  select2SetInit($sel2RContactRelation,'#modalEmployeeContactPerson', $aContactRelation);
  select2SetInit($sel2RContactSuffix,'#modalEmployeeContactPerson .modal-body', $aContactSuffix);

  select2SetValidation($sel2RContactRelation);
  select2SetValidation($sel2RContactSuffix);

  }, function(){ // Reject!
  console.log('Something broke!');
});

$tblEmployeeContactPersons = $('#tblEmployeeContactPersons').DataTable({
  "bInfo" : false,
  "responsive": true,
  "processing": true, 
  "autoWidth": true,
  "searching": false,
  "paging": false,
  columns: [
    { data: "temp_contact_id", title: "Id" },
    { data: "fullName", title: "Name" },
    { data: "rrelation_desc", title: "relationship" },
    { data: "temp_contact_mobile", title: "Mobile" },
    { data: "action", title: "Action" }
  ],
  "columnDefs": [
    { "width": "10px", "targets": 0 },
    { "width": "20px", "targets": 1 }
  ]
});

//load the family members
$url = "/page/employee/details/contact/list/*";
$.ajax($url, {
  type: 'POST',
  dataType: 'JSON'
}).then(function ($data) {
  // reload family members
  $tblEmployeeContactPersons.clear().rows.add($data.contacts).draw();

});

//employee family member birthday
$('#temp_empfamily_dob').datepicker({
  format: 'yyyy-mm-dd',
  autoclose: true
});

//validate Employee entry
$('#frmEmployeeContactPerson').validate({
  focusInvalid: false,
  ignore: [],
  rules: {
    'temp_contact_first': {
      required: true
    },
    'temp_contact_mid': {
      required: true
    },
    'temp_contact_last': {
      required: true
    },
    'temp_contact_dob': {
      required: true
    }
  },

  submitHandler: function (form) {
    // ajax call code here
    var $url = "/page/employee/details/contact/" + ['add', 'edit', 'delete'][$lastCmd - 1] +'/*';
    //alert($url);

    $.ajax({
      url: $url,
      type: 'POST',
      data: $("#frmEmployeeContactPerson").serialize(),
      success: function (data) {

        $newData =JSON.parse(data);
        console.log($newData);
        alert('xxxxxxx');
        $type = 'green';
        $btnClass = 'btn-success';

        if (!$newData.status) {
          $type = 'red';
          $btnClass = 'btn-danger';
        }

        Swal.fire({
          icon: $newData.icon,
          title: $newData.msgTitle,
          text: $newData.msgContent
        });

        if ($newData.status) {
          $tblEmployeeContactPersons.clear().rows.add($newData.contacts).draw();
          $modalEmployeeContactPerson.modal('hide');

        } 
        return false;
      }
    });
    return false;

  }
});

//add new family member
$btnEmployeeContactPersonAdd.on('click', function (e) {
  clearContactForm();
  $lastCmd = 1;
  //setValues($dummy);
  $modalEmployeeContactPersonTitle.html("New Contact Person");
  $btnHumanResourcesEmployeeContactPersonSave.show();
  $btnHumanResourcesEmployeeContactPersonSave.html("Save");
  $modalEmployeeContactPerson.modal('show');
});

// member edit
$('#tblEmployeeContactPersons tbody').on('click', '.btnContactPersonEdit', function () {
  $data = $(this).data();

  $lastCmd = 2;
  $id = $data.id;

  //find it in db
  $url = "/page/employee/details/contact/display/" + $id;
  $.ajax($url, {
    type: 'POST',
    dataType: 'JSON'
  }).then(function ($data) {
    // reload family members

    setContactPersonDetails($data.contacts);
  
  });
  $modalEmployeeContactPersonTitle.html("Update Contact Person");
  $btnHumanResourcesEmployeeContactPersonSave.show();
  $btnHumanResourcesEmployeeContactPersonSave.html("Save Changes");
  $modalEmployeeContactPerson.modal('show');

  return false;
});

//Employee member deleting
$('#tblEmployeeContactPersons tbody').on('click', '.btnContactPersonDelete', function () {
  $lastCmd = 3;

  $data = $(this).data();

  $id = $data.id;

  //find it in db
  $url = "/page/employee/details/contact/display/" + $id;
  $.ajax($url, {
    type: 'POST',
    dataType: 'JSON'
  }).then(function ($data) {
    // reload family members

    setContactPersonDetails($data.contacts);
  
  });
  
  $modalEmployeeContactPersonTitle.html("Delete Contact Person");
  $btnHumanResourcesEmployeeContactPersonSave.show();
  $btnHumanResourcesEmployeeContactPersonSave.html("Delete");
  $modalEmployeeContactPerson.modal('show');
  return false;
});

//Employee member view
$('#tblEmployeeContactPersons tbody').on('click', '.btnContactPersonView', function () {
  $lastCmd = 4;
  $data = $(this).data();

  $id = $data.id;

  //find it in db
  $url = "/page/employee/details/contact/display/" + $id;
  $.ajax($url, {
    type: 'POST',
    dataType: 'JSON'
  }).then(function ($data) {
    // reload family members

    setContactPersonDetails($data.contacts);
  
  });
  $modalEmployeeContactPersonTitle.html("View Contact Person");
  $btnHumanResourcesEmployeeContactPersonSave.hide();
  $modalEmployeeContactPerson.modal('show');
  return false;
});

function setContactPersonDetails($ContactPersonDetails) {
  $temp_contact_id.val($ContactPersonDetails.temp_contact_id);
  $temp_id.val($ContactPersonDetails.temp_id);

  $temp_contact_rrelation_id.val($ContactPersonDetails.temp_contact_rrelation_id).trigger('change');
  $temp_contact_first.val($ContactPersonDetails.temp_contact_first);
  $temp_contact_mid.val($ContactPersonDetails.temp_contact_mid);
  $temp_contact_last.val($ContactPersonDetails.temp_contact_last);

  $temp_contact_suffix_id.val($ContactPersonDetails.temp_contact_suffix_id).trigger('change');
  $temp_contact_home_address.val($ContactPersonDetails.temp_contact_home_address);
  $temp_contact_home_phone.val($ContactPersonDetails.temp_contact_home_phone);
  $temp_contact_mobile.val($ContactPersonDetails.temp_contact_mobile);
  $temp_contact_email.val($ContactPersonDetails.temp_contact_email);
  $temp_contact_company_name.val($ContactPersonDetails.temp_contact_company_name);
  $temp_contact_company_address.val($ContactPersonDetails.temp_contact_company_address);
  $temp_contact_company_phone.val($ContactPersonDetails.temp_contact_company_phone);
  $temp_contact_company_email_address.val($ContactPersonDetails.temp_contact_company_email_address); 

}

function clearContactForm() {
  $temp_contact_id.val('');
  $temp_id.val('');
  // $temp_contact_rrelation_id.val('');
  $temp_contact_first.val('');
  $temp_contact_mid.val('');
  $temp_contact_last.val('');
  $temp_contact_suffix_id.val('');
  $temp_contact_home_address.val('');
  $temp_contact_home_phone.val('');
  $temp_contact_mobile.val('');
  $temp_contact_email.val('');
  $temp_contact_company_name.val('');
  $temp_contact_company_address.val('');
  $temp_contact_company_phone.val('');
  $temp_contact_company_email_address.val('');
}