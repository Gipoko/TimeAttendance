// $(function () {
var $tblEmployeeCert;
var $frmEmployeeCert = $("#frmEmployeeCert");
var $btnEmployeeCertAdd = $("#btnEmployeeCertAdd");
var $lastCmd = 0;

var $modaEmployeeCert = $("#modaEmployeeCert");
var $modaEmployeeCertTitle = $("#modaEmployeeCertTitle");
var $btnEmployeeCertSave = $("#btnEmployeeCertSave");

var $temp_cert_id = $("#temp_cert_id");
var $temp_cert_name  = $("#temp_cert_name");
var $temp_cert_place_issued = $("#temp_cert_place_issued");
var $temp_cert_date_issued = $("#temp_cert_date_issued");
var $temp_cert_date_expire = $("#temp_cert_date_expire");


$tblEmployeeCert = $('#tblEmployeeCert').DataTable({
  "bInfo" : false,
  "responsive": true,
  "processing": true, 
  "autoWidth": true,
  "searching": false,
  "paging": false,
  "sDom": 'rt',
  columns: [
    { data: "temp_cert_id", title: "Id" },
    { data: "temp_certlic_details", title: "License/Certificate Name" },
    { data: "temp_cert_date_issued", title: "Issued" },
    { data: "temp_cert_date_expire", title: "Expire" },
    { data: "action", title: "Action" }
  ]
});


//load the certificate and license
$url = "/page/ref/cEmpCert/list/*";
$.ajax($url, {
  type: 'POST',
  dataType: 'JSON'
}).then(function ($data) {
  // reload family members
   console.log($data);
// alert('xxxx');
  $tblEmployeeCert.clear().rows.add($data.CertLics).draw();

});

//employee philsys_id date of issue
$('#temp_cert_date_issued').datepicker({
  format: 'yyyy-mm-dd',
  autoclose: true
});

//employee date of birth
$('#temp_cert_date_expire').datepicker({
  format: 'yyyy-mm-dd',
  autoclose: true
});

//validate Employee entry
$('#frmEmployeeCert').validate({
  focusInvalid: false,
  ignore: [],
  rules: {
    'temp_empedu_schoolname': {
      required: true
    },
    'temp_empedu_schooladdress': {
      required: true
    },
    'temp_empedu_from': {
      required: true
    },
    'temp_empedu_from': {
      required: true
    }
  },
  messages: {
    philsys_id: "18 digits required",
    temp_email: {
      required: "We need your email address to contact you",
      email: "Your email address must be in the format of name@domain.com"
    }
  },

  submitHandler: function (form) {
    // ajax call code here
    var $url = "/page/ref/cEmpCert/" + ['add', 'edit', 'delete'][$lastCmd - 1] + '/*';

    $.ajax({
      url: $url,
      type: 'POST',
      data: $("#frmEmployeeCert").serialize(),
      success: function (data) {

        $newData =JSON.parse(data);
        console.log($newData);
        alert('xxxxxxx');

        Swal.fire({
          icon: $newData.icon,
          title: $newData.msgTitle,
          text: $newData.msgContent
        });

        if ($newData.status) {
          $tblEmployeeCert.clear().rows.add($newData.CertLics).draw();

          $modaEmployeeCert.modal('hide');
        }
        return false;
      }
    });
    return false;
  }
});

//add new family member
$btnEmployeeCertAdd.on('click', function (e) {
  clearCertLicForm();
  $lastCmd = 1;
  //setValues($dummy);
  $modaEmployeeCertTitle.html("New Professional License/Certificate");
  $btnEmployeeCertSave.show();
  $btnEmployeeCertSave.html("Save");
  $modaEmployeeCert.modal('show');
});

//family member edit
$('#tblEmployeeCert tbody').on('click', '.btnCertLicEdit', function () {
  $lastCmd = 2;
  $data = $(this).data();
  console.log($data);

  $id = $data.id;

  //find it in db
  $url = "/page/ref/cEmpCert/display/" + $id;
  $.ajax($url, {
    type: 'POST',
    dataType: 'JSON'
  }).then(function ($data) {
    // reload family members

    setCertLicDetails($data.CertLics);
    $modaEmployeeCertTitle.html("Update Professional License/Certificate");
    $btnEmployeeCertSave.show();
    $btnEmployeeCertSave.html('Save Changes'); 
    $modaEmployeeCert.modal('show');

  });

  return false;
});

//Employee experience deleting
$('#tblEmployeeCert tbody').on('click', '.btnCertLicDelete', function () {

  $lastCmd = 3;
  $data = $(this).data();
  console.log($data);

  $id = $data.id;

  //find it in db
  $url = "/page/ref/cEmpCert/display/" + $id;
  $.ajax($url, {
    type: 'POST',
    dataType: 'JSON'
  }).then(function ($data) {
    // reload family members

    setCertLicDetails($data.CertLics);
    $modaEmployeeCertTitle.html("Delete Professional License/Certificate");
    $btnEmployeeCertSave.show();
    $btnEmployeeCertSave.html('Delete'); 
    $modaEmployeeCert.modal('show');

  });

  return false;
});

//Employee experience view
$('#tblEmployeeCert tbody').on('click', '.btnCertLicView', function () {
  $lastCmd = 4;
  $data = $(this).data();
  console.log($data);

  $id = $data.id;

  //find it in db
  $url = "/page/ref/cEmpCert/display/" + $id;
  $.ajax($url, {
    type: 'POST',
    dataType: 'JSON'
  }).then(function ($data) {
    // reload family members
    console.log($data.CertLics);

    setCertLicDetails($data.CertLics);
    $modaEmployeeCertTitle.html("View Professional License/Certificate");
    $btnEmployeeCertSave.hide(); 
    $modaEmployeeCert.modal('show');
  });
  return false;
});



function setCertLicDetails($certLicDetails) {
  $temp_cert_id.val($certLicDetails.temp_cert_id);
  $temp_cert_name.val($certLicDetails.temp_cert_name);
  $temp_cert_place_issued.val($certLicDetails.temp_cert_place_issued); 
  $temp_cert_date_issued.datepicker().datepicker('setDate', $certLicDetails.temp_cert_date_issued);
  $temp_cert_date_expire.datepicker().datepicker('setDate', $certLicDetails.temp_cert_date_expire);

}

function clearCertLicForm() {
  $temp_cert_id.val('');
  $temp_cert_name.val('');
  $temp_cert_place_issued.val(''); 
  $temp_cert_date_issued.datepicker().datepicker('setDate', '');
  $temp_cert_date_expire.datepicker().datepicker('setDate', '');

}