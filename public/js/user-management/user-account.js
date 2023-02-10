// $(function () {
var $tblHumanResourcesEmployee;
var $frmHumanResourcesEmployee = $("#frmHumanResourcesEmployee");
var $philsys_id = $("#philsys_id");
var $philsys_doi = $("#philsys_doi");

var $philsys_poi = $("#philsys_poi");
var $rtitle_id = $("#rtitle_id");
var $temp_first = $("#temp_first");
var $temp_mid = $("#temp_mid");
var $temp_last = $("#temp_last");
var $rsuffix_id = $("#rsuffix_id");

var $rblood_type_id = $("#rblood_type_id");
var $rgender_id = $("#rgender_id");
var $temp_dob = $("#temp_dob");
var $rcountry_id = $("#rcountry_id");

var $temp_pob = $("#temp_pob");
var $temp_isindigent = $("#temp_isindigent");
var $temp_marital_id = $("#temp_marital_id");
var $rreligion_id = $("#rreligion_id");

var $regcode = $("#regcode");
var $provcode = $("#provcode");
var $citymuncode = $("#citymuncode");
var $brgycode = $("#brgycode");

var $temp_zone = $("#temp_zone");
var $temp_street = $("#temp_street");
var $temp_building_nameno = $("#temp_building_nameno");
var $temp_pobox = $("#temp_pobox");
var $temp_zipcode = $("#temp_zipcode");

var $temp_landline = $("#temp_landline");
var $temp_mobile = $("#temp_mobile");
var $temp_email = $("#temp_email");
var $temp_fb = $("#temp_fb");
var $temp_whatsapp = $("#temp_whatsapp");
var $temp_viber = $("#temp_viber");

var $rbank_id = $("#rbank_id");
var $temp_bank_address = $("#temp_bank_address");
var $temp_bank_accountno = $("#temp_bank_accountno");
var $temp_bank_atmexpire = $("#temp_bank_atmexpire");

var $temp_datejoined = $("#temp_datejoined");
var $remployment_type_id = $("#remployment_type_id");
var $temp_biometric_id = $("#temp_biometric_id");
var $temp_efn = $("#temp_efn");

var $btnNewEmployee = $("#btnNewEmployee");
var $modalHumanResourcesEmployee = $("#modalHumanResourcesEmployee");
var $modalHumanResourcesEmployeeTitle = $("#modalHumanResourcesEmployeeTitle");
var $btnEmployee = $("#btnEmployee");
var $dummy = { rbranch_id: 0, rbranch_name: '', rbranch_address: '' };
var $lastCmd = 0;
var $activeBrgyCode = '';

var $modalEmployeeWork = $("#modalEmployeeWork");
var $modalEmployeeWorkTitle = $("#modalEmployeeWorkTitle");

var $aDivision;
var $aSectionUnit;
var $rdivision_id = $("#rdivision_id");
var $rdivision_sectionunit_id = $("#rdivision_sectionunit_id");
var $rposition_id = $("#rposition_id");
var $aPositionList;
var $rgradestep_gradeno = $("#rgradestep_gradeno");
var $rgradestep_stepno = $("#rgradestep_stepno");
var $rgradestep_salary = $("#rgradestep_salary");

var $selectedGradeNo;
var $selectedStepNo;

var $tblOtherEarningsSelection;
var $aTaxTable;
var $tax_percent = $("#tax_percent");
var $tax_additional = $("#tax_additional");

var $modalEarningsUpdateValue = $("#modalEarningsUpdateValue");
var $txtDefaultValue = $("#txtDefaultvalue");
var $btnModalEarningUpdateValue = $(".btnModalEarningUpdateValue");
var $txtDefaultNewValue;

var $deductionColumns;

var $modalDeductionUpdateValue = $("#modalDeductionUpdateValue");
var $btnTableDeductions = $(".btnTableDeductions");
var $txtDeductionDefaultvalue = $("#txtDeductionDefaultvalue");
var $btnModalDeductionUpdateValue = $(".btnModalDeductionUpdateValue");

var $parentRow;
var $currentSelectedRow;

var $parentEarningRow
var $currentEarningSelectedRow

var $modalUserAccountCreateUsername = $("#modalUserAccountCreateUsername");
var $modalUserAccountChangeUsername = $("#modalUserAccountChangeUsername");
var $modalUserAccountChangePassword = $("#modalUserAccountChangePassword");
var $modalUserAccountUserGroup = $("#modalUserAccountUserGroup");
var $modalUserAccountUserGroup = $("#modalUserAccountUserGroup");
//make it scrollable after opening modal in a modal
/* .modal {
  background: rgba(0, 0, 0, 0.5) !important;
}
.modal-backdrop {
  display: none !important;
} */
var bootstrapModalCounter = 0;

$('.modal').on("hidden.bs.modal", function (e) {
  --bootstrapModalCounter;
  if (bootstrapModalCounter > 0) {
    //don't need to recalculate backdrop z-index; already handled by css
    //$('.modal-backdrop').first().css('z-index', parseInt($('.modal:visible').last().css('z-index')) - 10);
    $('body').addClass('modal-open');
  }
}).on("show.bs.modal", function (e) {
  ++bootstrapModalCounter;
  //don't need to recalculate backdrop z-index; already handled by css
});

var formToJson = function ($id) {
  let form = new FormData($("form#" + $id)[0]);
  //console.log(form);
  let jsonData = Object.fromEntries(form.entries());
  //console.log(jsonData);
  return JSON.stringify(jsonData);
}


$tblUserAccount = $('#tblUserAccount').DataTable({
  "bInfo": true,
  "responsive": true,
  "processing": true,
  "serverSide": true,
  "autoWidth": true,
  "iDisplayLength": 10,
  "searching": true,
  "paging": true,
  "bLengthChange": true,
  "ajax": {
    "url": "/page/user-management/account/index/*",
    "type": "POST",
  },

  columns: [
    { data: "tuser_ids", title: "Id", "visible": false },
    { data: "temp_hashcode", title: "Id" },
    { data: "temp_efn", title: "File No", "visible": true },
    { data: "fullName", title: "Name" },
    { data: "temp_mobile", title: "Mobile", "visible": false },
    { data: "temp_datejoined", title: "date Joined" },

    { data: "temp_hashcode", title: "username", "visible": false },
    { data: "rposition_name", title: "Job Description" },
    { data: "tuser_username", title: "username", "visible": true },
    { data: "user_group_name", title: "User Group", "visible": false },
    { data: "user_group_id", title: "User Group", "visible": false },
    { data: "action", title: "Action" }
  ],
  "columnDefs": [
    { "width": "20px", "targets": 3 },
    {
      "targets": 1,
      "data": 'temp_hashcode',
      "render": function (data, type, row, meta) {
        return '<img class="rounded-circle" src="/public/employee/picture/' + data + '.png?' + (new Date()).getTime() + '" alt="' + data + '"height="48" width="48"/>';
        // return 'style="background: url('+'/public/employee/picture/' + data + '.jpg) no-repeat center center /cover">';
      }
    }

  ]
});

//validate changing of username
$('#frmUserAccountChangeUsername').validate({
  focusInvalid: false,
  ignore: [],
  rules: {
    'username': {
      minlength: 8,
      maxlength: 50,
      required: true,
      noSpace: true,
      onlyLetters: true
    }
  },

  invalidHandler: function (event, validator) {
    // 'this' refers to the form
    var errors = validator.numberOfInvalids();
    if (errors) {
      Swal.fire(
        'Error',
        'Field with error needs to be filled or corrected.',
        'error'
      )

    }
  },

  submitHandler: function (form) {
    // ajax call code here
    var $url = "/page/user-management/account/changeusername/*";

    $.ajax({
      url: $url,
      type: 'POST',
      data: $("#frmUserAccountChangeUsername").serialize(),
      success: function (data) {
        $newData = JSON.parse(data);

        $type = 'green';
        $btnClass = 'btn-success';

        if (!$newData.status) {
          $type = 'red';
          $btnClass = 'btn-danger';
        }

        $.confirm({
          title: $newData.msgTitle,
          content: $newData.msgContent,
          type: $type,
          typeAnimated: true,

          buttons: {
            ok: {
              text: 'Ok',
              btnClass: $btnClass
            }
          }
        });
        if ($newData.status) {
          $tblUserAccount.ajax.reload(null, false);
          $modalUserAccountChangeUsername.modal('hide');
        }
        return false;
      }
    });
  }
});


//validate changing of password
$('#frmUserAccountChangePassword').validate({
  focusInvalid: false,
  ignore: [],
  rules: {
    'new_password': {
      minlength: 8,
      maxlength: 75,
      required: true
    },
    'password': {
      minlength: 8,
      maxlength: 75,
      required: true,
      equalTo: "#new_password"
    }
  },

  invalidHandler: function (event, validator) {
    // 'this' refers to the form
    var errors = validator.numberOfInvalids();
    if (errors) {
      Swal.fire(
        'Error',
        'Field with error needs to be filled or corrected.',
        'error'
      )

    }
  },

  submitHandler: function (form) {
    // ajax call code here
    var $url = "/page/user-management/account/changepassword/*";
    $.ajax({
      url: $url,
      type: 'POST',
      data: $("#frmUserAccountChangePassword").serialize(),
      success: function (data) {
        $newData = JSON.parse(data);

        $type = 'green';
        $btnClass = 'btn-success';

        if (!$newData.status) {
          $type = 'red';
          $btnClass = 'btn-danger';
        }

        $.confirm({
          title: $newData.msgTitle,
          content: $newData.msgContent,
          type: $type,
          typeAnimated: true,

          buttons: {
            ok: {
              text: 'Ok',
              btnClass: $btnClass
            }
          }
        });

        if ($result.status) {
          $tblUserAccount.ajax.reload(null, false);
          $modalUserAccountChangePassword.modal('hide');
        }
        return false;
      }
    });
  }
});


//creating new username and password
$('#frmUserAccountCreateUsername').validate({
  focusInvalid: false,
  ignore: [],
  rules: {
    'brandnew_username': {
      minlength: 8,
      maxlength: 75,
      required: true
      // noSpace: true,
      // onlyLetters: true
    },
    'brand_new_password': {
      minlength: 8,
      maxlength: 75,
      required: true
    },
    'retype_brand_new_password': {
      minlength: 8,
      maxlength: 75,
      required: true,
      equalTo: "#brand_new_password"
    }
  },

  invalidHandler: function (event, validator) {
    // 'this' refers to the form
    var errors = validator.numberOfInvalids();
    if (errors) {
      Swal.fire(
        'Error',
        'Field with error needs to be filled or corrected.',
        'error'
      )

    }
  },

  submitHandler: function (form) {
    // ajax call code here
    var $url = "/page/user-management/account/createusername/*";

    $.ajax({
      url: $url,
      type: 'POST',
      data: $("#frmUserAccountCreateUsername").serialize(),
      success: function (data) {
        $newData = JSON.parse(data);
        $type = 'green';
        $btnClass = 'btn-success';

        if (!$newData.status) {
          $type = 'red';
          $btnClass = 'btn-danger';
        }

        $.confirm({
          title: $newData.msgTitle,
          content: $newData.msgContent,
          type: $type,
          typeAnimated: true,

          buttons: {
            ok: {
              text: 'Ok',
              btnClass: $btnClass
            }
          }
        });


        if ($newData.status) {
          $tblUserAccount.ajax.reload(null, false);
          $modalUserAccountCreateUsername.modal('hide');
        }
        return false;
      }
    });
  }
});

//set user gorup
$('#frmUserAccountUserGroup').validate({
  focusInvalid: false,
  ignore: [],

  submitHandler: function (form) {
    // ajax call code here
    var $url = "/page/user-management/account/setusergroup/*";

    $.ajax({
      url: $url,
      type: 'POST',
      data: $("#frmUserAccountUserGroup").serialize(),
      success: function (data) {
        $newData = JSON.parse(data);

        $type = 'green';
        $btnClass = 'btn-success';

        if (!$newData.status) {
          $type = 'red';
          $btnClass = 'btn-danger';
        }

        $.confirm({
          title: $newData.msgTitle,
          content: $newData.msgContent,
          type: $type,
          typeAnimated: true,

          buttons: {
            ok: {
              text: 'Ok',
              btnClass: $btnClass
            }
          }
        });

        if ($newData.status) {
          $tblUserAccount.ajax.reload(null, false);
          $modalUserAccountUserGroup.modal('hide');
        }
        return false;
      }
    });
  }
});

//create username
$('#tblUserAccount tbody').on('click', '.btnUserCreateUsername', function () {
  var $dataRow = $tblUserAccount.row(this).data();

  if ($dataRow === undefined) {
    var $dataRow = $tblUserAccount.row($(this).parents('tr')).data();
  }

  $("#cuid").val($dataRow.id);
  $("#empcreateusernameid").val($dataRow.temp_id);
  $("#brandnew_username").val('');
  $("#brand_new_password").val('');
  $("#retype_brand_new_password").val('');

  $modalUserAccountCreateUsername.modal('show');

  return false;
});

//useraccount enable
$('#tblUserAccount tbody').on('click', '.btnUserAccountEnable', function () {
  var $dataRow = $tblUserAccount.row(this).data();

  if ($dataRow === undefined) {
    var $dataRow = $tblUserAccount.row($(this).parents('tr')).data();
  }

  Swal.fire({
    title: 'Are you sure?',
    text: "You are about to Enable this account",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      $url = "/page/user-management/account/accountenable/*";
      $formData = {
        id: $dataRow.id,
        enabled: 'Y'
      }
      var $result = JSON.parse(postData($url, $formData));


      Swal.fire({
        title: $result.title,
        text: $result.msg,
        icon: $result.icon,
        confirmButtonColor: "#7a6fbe"
      });

      if ($result.status) {
        $tblUserAccount.ajax.reload(null, false);
      }
      return false;
    }
  })

  return false;
});


//user account disable
$('#tblUserAccount tbody').on('click', '.btnUserAccountDisable', function () {
  var $dataRow = $tblUserAccount.row(this).data();

  if ($dataRow === undefined) {
    var $dataRow = $tblUserAccount.row($(this).parents('tr')).data();
  }

  Swal.fire({
    title: 'Are you sure?',
    text: "You are about to Disable this account",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      $url = "/page/user-management/account/accountdisable/*";
      $formData = {
        id: $dataRow.tuser_ids,
        tuser_enabled: 'N'
      }
      var $result = JSON.parse(postData($url, $formData));


      Swal.fire({
        title: $result.title,
        text: $result.msg,
        icon: $result.icon,
        confirmButtonColor: "#7a6fbe"
      });

      if ($result.status) {
        $tblUserAccount.ajax.reload(null, false);
      }
      return false;
    }
  })

  return false;
});


$('#tblUserAccount tbody').on('click', '.btnUserAccountChangeUsername', function () {
  var $dataRow = $tblUserAccount.row(this).data();

  if ($dataRow === undefined) {
    var $dataRow = $tblUserAccount.row($(this).parents('tr')).data();
  }

  console.log('jun', $dataRow);

  $s = extractContent($dataRow.tuser_username);
  $username = $s.substr($s, $s.indexOf('-'));

  $("#id").val($dataRow.tuser_ids);
  $("#old_username").val($username);
  $("#username").val('');

  $modalUserAccountChangeUsername.modal('show');

  return false;
});


$('#tblUserAccount tbody').on('click', '.btnUserAccountChangePassword', function () {
  var $dataRow = $tblUserAccount.row(this).data();

  if ($dataRow === undefined) {
    var $dataRow = $tblUserAccount.row($(this).parents('tr')).data();
  }

  $("#pid").val($dataRow.tuser_ids);
  $("#new_password").val('');
  $("#password").val('');
  $modalUserAccountChangePassword.modal('show');

  return false;
});


$('#tblUserAccount tbody').on('click', '.btnUserAccountUserGroup', function () {
  var $dataRow = $tblUserAccount.row(this).data();

  if ($dataRow === undefined) {
    var $dataRow = $tblUserAccount.row($(this).parents('tr')).data();
  }
  $("#uid").val($dataRow.tuser_ids);
  $("#user_groupname").val($dataRow.user_group_name);
  $("#user_group_id").val($dataRow.user_group_id);

  console.log($dataRow);
  //$("#user_groupname").val();
  $modalUserAccountUserGroup.modal('show');

  return false;
});

function extractContent(html) {

  return new DOMParser().parseFromString(html, "text/html").
    documentElement.textContent;

}

