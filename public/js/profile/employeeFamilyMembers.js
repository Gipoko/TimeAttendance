// $(function () {
var $tblHumanResourcesEmployeeProfileFamily;
var $frmEmployeeFamilyMember = $("#frmEmployeeFamilyMember");
var $btnEmployeeProfileFamilyMemberAdd = $("#btnEmployeeProfileFamilyMemberAdd");
var $lastCmd = 0; 

var $modalEmployeeFamilyMembers = $("#modalEmployeeFamilyMembers");
var $modalEmployeeFamilyMembersTitle = $("#modalEmployeeFamilyMembersTitle");
var $btnHumanResourcesEmployeeProfileFamilySave = $("#btnHumanResourcesEmployeeProfileFamilySave");

var $temp_family_id = $("#temp_family_id");
var $temp_family_rrelation_id = $("#temp_family_rrelation_id");
var $temp_family_first = $("#temp_family_first");
var $temp_family_mid = $("#temp_family_mid");
var $temp_family_last = $("#temp_family_last");
var $temp_family_suffix_id = $("#temp_family_suffix_id");
var $temp_family_dob = $("#temp_family_dob");

var $aRelation;
var $aSuffix;

/* function fetchMe(url) {
  return $.ajax({
      url: url,
      method: 'post'
});
} */

$sel2RRelation = $("#temp_family_rrelation_id").select2({});
$sel2RSuffix = $("#temp_family_suffix_id").select2({});

$processing = true;
$.when(fetchMe('/page/ref/cRelation/list/17'),
  fetchMe('/page/ref/csuffix/list/*')
)
.then(function(resRelation, resSuffix, ) { // Resolve

  $aRelation = JSON.parse(resRelation[0]);
  $aSuffix = JSON.parse(resSuffix[0]);

  $processing = false;

  }, function(){ // Reject!
  console.log('Something broke!');
});

var id = setInterval(frame, 10);
function frame() {
  if (!$processing) {
      clearInterval(id);

      $sel2RRelation.select2();
      $sel2RSuffix.select2();

      select2SetInit($sel2RRelation,'#modalEmployeeFamilyMembers', $aRelation);
      select2SetInit($sel2RSuffix,'#modalEmployeeFamilyMembers', $aSuffix);

      select2SetValidation($sel2RRelation);
      select2SetValidation($sel2RSuffix);

    }
}

/* function select2SetValidation($sel2Obj) {
  $sel2Obj.on('select2:select', function (e) {
    $(this).valid();
  });
}

function select2SetInit($selObj, $objParent, $aData){
  $selObj.select2({
    dropdownParent: $($objParent),
    minimumResultsForSearch: -1,
    width: '100%',
    data: $aData
  });
}
 */

$tblEmployeeFamilyMembers = $('#tblEmployeeFamilyMembers').DataTable({
  "bInfo" : false,
  "responsive": true,
  "processing": true, 
  "autoWidth": false,
  "searching": false,
  "paging": false,
  columns: [
    { data: "temp_family_id", title: "Id" },
    { data: "fullName", title: "Name" },
    { data: "rrelation_desc", title: "relationship" },

    { data: "temp_family_dob", title: "Birthday" },
    { data: "action", title: "Action" }
  ],
  "columnDefs": [
    { "width": "10px", "targets": 0 },
    { "width": "320px", "targets": 1 },
    { "width": "20px", "targets": 2 }
  ]
});

//load the family members
$url = "/page/employee/details/family/list/*";
$.ajax($url, {
  type: 'POST',
  dataType: 'JSON'
}).then(function ($data) {
  // reload family members
  $tblEmployeeFamilyMembers.clear().rows.add($data.familymembers).draw();
  return false;

});

//employee family member birthday
$('#temp_family_dob').datepicker({
  format: 'yyyy-mm-dd',
  autoclose: true
});

//validate Employee entry
$('#frmEmployeeFamilyMember').validate({
  focusInvalid: false,
  ignore: [],
  rules: {
    'temp_family_first': {
      required: true
    },
    'temp_family_mid': {
      required: true
    },
    'temp_family_last': {
      required: true
    },
    'temp_family_dob': {
      required: true
    }
  },
  errorElement: "em",
  errorPlacement: function ( error, element ) {
      // Add the `help-block` class to the error element
      error.insertAfter(element.parent("div.input-group"));
      error.addClass("help-block");
      error.insertAfter(element.parent("div.selectize-input"));
      error.addClass("help-block");
  },
  highlight: function ( element, errorClass, validClass ) {
      $( element ).addClass( "error" ).removeClass( "valid" );

  },
  unhighlight: function (element, errorClass, validClass) {
      $( element ).addClass( "valid" ).removeClass( "error" );
  },

  submitHandler: function (form) {
    // ajax call code here
    var $url = "/page/employee/details/family/" + ['add', 'edit', 'delete'][$lastCmd - 1] + '/*';

    $.ajax({
      url: $url,
      type: 'POST',
      data: $("#frmEmployeeFamilyMember").serialize(),
      success: function (data) {
        
        $newData =JSON.parse(data);

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
          $tblEmployeeFamilyMembers.clear().rows.add($newData.familymembers).draw();
          $modalEmployeeFamilyMembers.modal('hide');

        } 
        return false;
      }
    });
    return false;

  }
});

//add new family member
$btnEmployeeProfileFamilyMemberAdd.on('click', function (e) {
  e.preventDefault();
  clearFamilyForm();
  $lastCmd = 1;
  //setValues($dummy);


  $modalEmployeeFamilyMembersTitle.html("New Family Member");
  $btnHumanResourcesEmployeeProfileFamilySave.show();
  $btnHumanResourcesEmployeeProfileFamilySave.html("Save");
  $modalEmployeeFamilyMembers.modal('show');
});

//family member edit
$('#tblEmployeeFamilyMembers tbody').on('click', '.btnFamilyMemberEdit', function (e) {
  e.preventDefault();
  $data = $(this).data();

  $lastCmd = 2;
  $id = $data.id;
    
  //find it in db
  $url = "/page/employee/details/family/display/" + $id;
  $.ajax($url, {
    type: 'POST',
    dataType: 'JSON'
  }).then(function ($data) {
    // reload family members
  
    setFamilyMemberDetails($data.familymembers);
    $modalEmployeeFamilyMembersTitle.html("Update");
    $btnHumanResourcesEmployeeProfileFamilySave.show();
    $btnHumanResourcesEmployeeProfileFamilySave.html("Save Changes");
    $modalEmployeeFamilyMembers.modal('show');
  
  });
  
  return false;
});

//Employee member deleting
$('#tblEmployeeFamilyMembers tbody').on('click', '.btnFamilyMemberDelete', function (e) {
  e.preventDefault();
    $lastCmd = 3;

    $data = $(this).data();

    $id = $data.id;
    
    //find it in db
    $url = "/page/employee/details/family/display/" + $id;
    $.ajax($url, {
      type: 'POST',
      dataType: 'JSON'
    }).then(function ($data) {
      // reload family members
    
      setFamilyMemberDetails($data.familymembers);
      $modalEmployeeFamilyMembersTitle.html("Delete Family Member");
      $btnHumanResourcesEmployeeProfileFamilySave.show();
      $btnHumanResourcesEmployeeProfileFamilySave.html("Delete");
      $modalEmployeeFamilyMembers.modal('show');
    
    });
    
    return false;
});



//Employee member view
$('#tblEmployeeFamilyMembers tbody').on('click', '.btnFamilyMemberView', function () {
  $lastCmd = 4;
  $data = $(this).data();

  $id = $data.id;

  //find it in db
  $url = "/page/employee/details/family/display/" + $id;
  $.ajax($url, {
    type: 'POST',
    dataType: 'JSON'
  }).then(function ($data) {
    // reload family members

    setFamilyMemberDetails($data.familymembers);
    $modalEmployeeFamilyMembersTitle.html("View Family Member");
    $btnHumanResourcesEmployeeProfileFamilySave.hide();
    $modalEmployeeFamilyMembers.modal('show');
  
  });

  return false;
});

function setFamilyMemberDetails($familyMemberDetails) {
  $temp_family_id.val($familyMemberDetails.temp_family_id);
  $temp_family_rrelation_id.val($familyMemberDetails.temp_family_rrelation_id).trigger('change');
  $temp_family_first.val($familyMemberDetails.temp_family_first);
  $temp_family_mid.val($familyMemberDetails.temp_family_mid);
  $temp_family_last.val($familyMemberDetails.temp_family_last);
  $temp_family_suffix_id.val($familyMemberDetails.temp_family_suffix_id).trigger('change');
  $temp_family_dob.datepicker().datepicker('setDate', $familyMemberDetails.temp_family_dob);
}

function clearFamilyForm() {
  $temp_family_id.val('');
  $temp_family_rrelation_id.val('1');
  $temp_family_first.val('');
  $temp_family_mid.val('');
  $temp_family_last.val('');
  $temp_family_dob.datepicker().datepicker('setDate', '');
}