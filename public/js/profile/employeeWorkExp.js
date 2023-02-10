// $(function () {
var $tblHumanResourcesEmployeeEducation;
var $frmHumanResourcesEmployeeProfileFamily = $("#frmHumanResourcesEmployeeProfileFamily");
var $btnHumanResourcesEmployeeExperienceAdd = $("#btnHumanResourcesEmployeeExperienceAdd");
var $lastCmd = 0;

var $modalHumanResourcesEmployeeExperience = $("#modalHumanResourcesEmployeeExperience");
var $modalHumanResourcesEmployeeExperienceTitle = $("#modalHumanResourcesEmployeeExperienceTitle");
var $btnHumanResourcesEmployeeExperienceSave = $("#btnHumanResourcesEmployeeExperienceSave");

var $temp_exp_id = $("#temp_exp_id");
var $temp_exp_position  = $("#temp_exp_position");
var $temp_exp_companyname = $("#temp_exp_companyname");
var $temp_exp_companyaddress = $("#temp_exp_companyaddress");
var $temp_exp_jobdesc = $("#temp_exp_jobdesc");
var $temp_exp_from = $("#temp_exp_from");
var $temp_exp_to = $("#temp_exp_to");


//load the family members
$url = "/page/employee/details/workexp/@method/*";
$.ajax($url, {
  type: 'POST',
  dataType: 'JSON'
}).then(function ($data) {
  // reload family members
//   console.log($data.educations);
// alert('xxxx');
  $(".clsExperiences").html($data.experiences);

});

//employee date of birth
$('#temp_exp_from').datepicker({
  format: 'yyyy-mm-dd',
  autoclose: true
});


//employee family member birthday
$('#temp_exp_to').datepicker({
  format: 'yyyy-mm-dd',
  autoclose: true
});

//validate Employee entry
$('#frmHumanResourcesEmployeeExperience').validate({
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
    var $url = "/page/human-resources/employee/experience/" + ['add', 'edit', 'delete'][$lastCmd - 1] +'/*';

    // var $result = (postData($url, $("#frmHumanResourcesEmployee").serialize()));
    // var $result = (postData($url, $("#frmHumanResourcesEmployeeEducation").serialize()));
    var $result = JSON.parse(postData($url, $("#frmHumanResourcesEmployeeExperience").serialize()));
// console.log($result);
// alert('xxxx');
    Swal.fire({
      title: $result.title,
      text: $result.msg,
      icon: $result.icon,
      confirmButtonColor: "#7a6fbe"
    });

    if ($result.status) {
      // $tblHumanResourcesEmployeeEducation.clear().rows.add($result.educations).draw();
      $(".clsExperiences").html($result.experiences);
      $modalHumanResourcesEmployeeExperience.modal('hide');
    }
    return false;
  }
});

//add new family member
$btnHumanResourcesEmployeeExperienceAdd.on('click', function (e) { 
  clearForm();
  $lastCmd = 1;
  //setValues($dummy);
  $modalHumanResourcesEmployeeExperienceTitle.html("New Work Experience");
  $btnHumanResourcesEmployeeExperienceSave.show();
  $btnHumanResourcesEmployeeExperienceSave.html("Save");
  $modalHumanResourcesEmployeeExperience.modal('show');
});

//family member edit
$('body').on('click', '.btnExperienceEdit', function () {
  $lastCmd = 2;
  $data = $(this).data();
  console.log($data);

  $id = $data.id;

  //find it in db
  $url = "/page/human-resources/employee/experience/seek/" + $id;
  $.ajax($url, {
    type: 'POST',
    dataType: 'JSON'
  }).then(function ($data) {
    // reload family members

    setExperienceDetails($data.experiences);
    $modalHumanResourcesEmployeeExperienceTitle.html("Edit Work Experience");
    $btnHumanResourcesEmployeeExperienceSave.show();
    $btnHumanResourcesEmployeeExperienceSave.html('Save'); 
    $modalHumanResourcesEmployeeExperience.modal('show');

  });

  return false;
});

//Employee experience deleting
$('body').on('click', '.btnExperienceDelete', function () {
  $lastCmd = 3;
  $data = $(this).data();
  console.log($data);

  $id = $data.id;

  //find it in db
  $url = "/page/human-resources/employee/experience/seek/" + $id;
  $.ajax($url, {
    type: 'POST',
    dataType: 'JSON'
  }).then(function ($data) {
    // reload family members

    setExperienceDetails($data.experiences);
    $modalHumanResourcesEmployeeExperienceTitle.html("Delete Work Experience");
    $btnHumanResourcesEmployeeExperienceSave.show();
    $btnHumanResourcesEmployeeExperienceSave.html('Delete'); 
    $modalHumanResourcesEmployeeExperience.modal('show');

  });

  return false;
});

//Employee experience view
$('body').on('click', '.btnExperienceView', function () {
  $lastCmd = 4;
  $data = $(this).data();
  console.log($data);

  $id = $data.id;

  //find it in db
  $url = "/page/human-resources/employee/experience/seek/" + $id;
  $.ajax($url, {
    type: 'POST',
    dataType: 'JSON'
  }).then(function ($data) {
    // reload family members

    console.log($data.experiences);
    setExperienceDetails($data.experiences);
    $modalHumanResourcesEmployeeExperienceTitle.html("View Work Experience");
    $btnHumanResourcesEmployeeExperienceSave.hide(); 
    $modalHumanResourcesEmployeeExperience.modal('show');

  });
  return false;
});



function setExperienceDetails($experienceDetails) {
  $temp_exp_id.val($experienceDetails.temp_exp_id);
  $temp_exp_position.val($experienceDetails.temp_exp_position);
  $temp_exp_companyname.val($experienceDetails.temp_exp_companyname);
  $temp_exp_companyaddress.val($experienceDetails.temp_exp_companyaddress);
  $temp_exp_jobdesc.val($experienceDetails.temp_exp_jobdesc);
  $temp_exp_from.datepicker().datepicker('setDate', $experienceDetails.temp_exp_from);
  $temp_exp_to.datepicker().datepicker('setDate', $experienceDetails.temp_exp_to);

}

function clearForm() {
  $temp_exp_id.val('');
  $temp_exp_position.val('');
  $temp_exp_companyname.val('');
  $temp_exp_companyaddress.val('');
  $temp_exp_jobdesc.val('');
  $temp_exp_from.datepicker().datepicker('setDate', '');
  $temp_exp_to.datepicker().datepicker('setDate', '');

}