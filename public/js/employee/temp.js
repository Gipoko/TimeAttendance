/*
* to be able to use this in other project be sure to copy the select2 folder
* copy the css rule in head.html
*
*
*/




var $memp;
var $cmdOption = 0;
var $aTitle = [];
var $aSuffix = [];
var $aBlood = [];
var $aGender = [];
var $aNationality = [];
var $aMarital = [];
var $aReligion = [];
var $aRegCode = [];
var $aProvCode = [];
var $aCityMunCode = [];
var $aBrgyCode = [];
var $aBank = [];
var $aDivision = [];
var $aDivUnit = [];
var $aReportTo = [];
var $aPosition = [];
var $aSched = [];
var $aEmpType = [];
var $selectedTempID = 0;

var $condGrade = 0;
var $condStep = 0;

$(function () {


  //initialize all dropdown
  $sel2RTitle = $("#rtitle_id").select2({});
  $sel2RSuffix = $("#temp_suffice").select2({});
  $sel2RBlood = $("#temp_blood").select2({});
  $sel2RGender = $("#temp_gender").select2({});
  $sel2RNationality = $("#rcountry_id").select2({});
  $sel2RMarital = $("#temp_marital").select2({});
  $sel2RReligion = $("#rreligion_id").select2({});
  $sel2RRegCode = $("#regcode").select2({});
  $sel2RProvCode = $("#provcode").select2({});
  $sel2RCityMunCode = $("#citymuncode").select2({});
  $sel2RBrgyCode = $("#brgycode").select2({});
  $sel2RBank = $("#rbank_id").select2({});
  $sel2REmpType = $("#remployment_type_id").select2({});
  $sel2RDivision = $("#rdivision_id").select2({});
  $sel2RDivUnit = $("#rdivunit_id").select2({});
  $sel2RReportTo = $("#temp_work_reporting_to_id").select2({});
  $sel2RPosition = $("#rposition_id").select2({});

  $sel2RSched = $("#rsched_name").select2({});

  $sel2RNewDivision = $("#ddNewDivision").select2({});
  $sel2RNewDivUnit = $("#ddNewDivUnit").select2({});
  $sel2RNewReportingTo = $("#ddNewReportingTo").select2({});

  $sel2RNewEmpType = $("#ddNewEmploymentType").select2({});

  $sel2currentJobPosition = $("#currentJobPosition").select2({});
  $sel2RNewPosition = $("#ddNewJobPosition").select2({});

  $sel2CurrentEmploymentType = $("#currentEmploymentType").select2({});


  function fetchMe(url) {
    return $.ajax({
      url: url,
      method: 'post'
    });
  }

  $processing = true;
  $.when(fetchMe('/page/ref/ctitle/list/*'),
    fetchMe('/page/ref/csuffix/list/*'),
    fetchMe('/page/ref/cbloodtype/list/*'),
    fetchMe('/page/ref/cgender/list/*'),
    fetchMe('/page/ref/cnationality/list/*'),
    fetchMe('/page/ref/cmarital/list/*'),
    fetchMe('/page/ref/creligion/list/*'),
    fetchMe('/page/ref/cregion/list/*'),
    fetchMe('/page/ref/cprovince/getAllProvinces/*'),
    fetchMe('/page/ref/ccitymun/getAllCityMun/*'),
    fetchMe('/page/ref/cbarangay/getAllBarangays/*'),
    fetchMe('/page/ref/cbank/list/*'),
    fetchMe('/page/ref/cemploymenttype/list/*'),
    fetchMe('/page/ref/cdivision/list/*'),
    fetchMe('/page/ref/cdivisionunit/getDivisionUnit/*'),
    fetchMe('/page/human-resources/employee/getReportingTo/*'),
    fetchMe('/page/setup/payroll/position/getPositions/*'),
    fetchMe('/page/ref/cSched/list/*')
  )
    .then(function (resTitle, resSuffix, resBlood,
      resGender, resCountry, resMarital,
      resReligion, resRegCode, resProvCode,
      resCityMunCode, resBrgyCode, resBank,
      resEmpType, resDiv, resDivUnit, resReportTo, resPosition, resSched) { // Resolve

      $aTitle = JSON.parse(resTitle[0]);

      $aSuffix = JSON.parse(resSuffix[0]);
      $aBlood = JSON.parse(resBlood[0]);
      $aGender = JSON.parse(resGender[0]);
      $aNationality = JSON.parse(resCountry[0]);
      $aMarital = JSON.parse(resMarital[0]);
      $aReligion = JSON.parse(resReligion[0]);

      $aRegCode = JSON.parse(resRegCode[0]);
      $aProvCode = JSON.parse(resProvCode[0]);
      $aCityMunCode = JSON.parse(resCityMunCode[0]);
      $aBrgyCode = JSON.parse(resBrgyCode[0]);

      $aBank = JSON.parse(resBank[0]);
      $aEmpType = JSON.parse(resEmpType[0]);

      $aDivision = JSON.parse(resDiv[0]);
      $aDivUnit = JSON.parse(resDivUnit[0]);

      $aReportTo = JSON.parse(resReportTo[0]);
      $aPosition = JSON.parse(resPosition[0]);

      $aSched = JSON.parse(resSched[0]);

      $processing = false;

    }, function () { // Reject!
      console.log('Something broke!');
    });

  var id = setInterval(frame, 10);
  function frame() {
    if (!$processing) {
      clearInterval(id);

      $sel2RTitle.select2();
      $sel2RSuffix.select2();
      $sel2RBlood.select2();
      $sel2RGender.select2();
      $sel2RNationality.select2();
      $sel2RMarital.select2();
      $sel2RReligion.select2();
      $sel2RRegCode.select2();
      $sel2RProvCode.select2();
      $sel2RCityMunCode.select2();
      $sel2RBrgyCode.select2();
      $sel2RBank.select2();
      $sel2REmpType.select2();
      $sel2RDivision.select2();
      $sel2RDivUnit.select2();
      $sel2RReportTo.select2();
      $sel2RPosition.select2();

      // $sel2RSched.select2();

      $sel2RNewDivision.select2();
      $sel2RNewDivUnit.select2();
      $sel2RNewReportingTo.select2();

      $sel2RNewEmpType.select2();

      $sel2currentJobPosition.select2();
      $sel2RNewPosition.select2();

      $sel2CurrentEmploymentType.select2();

      select2SetInit($sel2RTitle, '#modalEmployeeUpdate .modal-body', $aTitle);
      select2SetInit($sel2RSuffix, '#modalEmployeeUpdate .modal-body', $aSuffix);
      select2SetInit($sel2RBlood, '#modalEmployeeUpdate .modal-body', $aBlood);
      select2SetInit($sel2RGender, '#modalEmployeeUpdate .modal-body', $aGender);
      select2SetInit($sel2RNationality, '#modalEmployeeUpdate .modal-body', $aNationality);
      select2SetInit($sel2RMarital, '#modalEmployeeUpdate .modal-body', $aMarital);
      select2SetInit($sel2RReligion, '#modalEmployeeUpdate .modal-body', $aReligion);
      select2SetInit($sel2RRegCode, '#modalEmployeeUpdate .modal-body', $aRegCode);
      select2SetInit($sel2RProvCode, '#modalEmployeeUpdate .modal-body', '');
      select2SetInit($sel2RCityMunCode, '#modalEmployeeUpdate .modal-body', '');
      select2SetInit($sel2RBrgyCode, '#modalEmployeeUpdate .modal-body', '');
      select2SetInit($sel2RBank, '#modalEmployeeUpdate .modal-content .modal-body', $aBank);
      select2SetInit($sel2REmpType, '#modalEmployeeUpdate .modal-body', $aEmpType);
      select2SetInit($sel2RDivision, '#modalEmployeeUpdate .modal-body', $aDivision);
      select2SetInit($sel2RDivUnit, '#modalEmployeeUpdate .modal-body', '');
      select2SetInit($sel2RReportTo, '#modalEmployeeUpdate .modal-body', $aReportTo);
      select2SetInit($sel2RPosition, '#modalEmployeeUpdate .modal-body', $aPosition);
      select2SetInit($sel2RSched, '#modalEmployeeUpdate .modal-body', $aSched);
      select2SetInit($sel2RNewDivision, '#modalTransferEmployee .modal-content .modal-body', $aDivision);
      select2SetInit($sel2RNewDivUnit, '#modalTransferEmployee .modal-content .modal-body', $aDivision);
      select2SetInit($sel2RNewReportingTo, '#modalTransferEmployee', $aReportTo);
      select2SetInit($sel2RNewEmpType, '#modalChangeEmploymentType', $aEmpType);
      select2SetInit($sel2currentJobPosition, '#modalChangeEmploymentPosition .modal-content .modal-body', $aPosition);
      select2SetInit($sel2RNewPosition, '#modalChangeEmploymentPosition .modal-content .modal-body', $aPosition);
      select2SetInit($sel2CurrentEmploymentType, '#modalChangeEmploymentType .modal-content .modal-body', $aEmpType);


      select2SetValidation($sel2RTitle);
      select2SetValidation($sel2RSuffix);
      select2SetValidation($sel2RBlood);

      select2SetValidation($sel2RGender);
      select2SetValidation($sel2RNationality);
      select2SetValidation($sel2RMarital);

      select2SetValidation($sel2RReligion);
      select2SetValidation($sel2RRegCode);
      select2SetValidation($sel2RProvCode);
      select2SetValidation($sel2RCityMunCode);
      select2SetValidation($sel2RBrgyCode);

      select2SetValidation($sel2RBank);
      select2SetValidation($sel2REmpType);
      select2SetValidation($sel2RDivision);

      select2SetValidation($sel2RDivUnit);
      select2SetValidation($sel2RReportTo);
      select2SetValidation($sel2RPosition);
      // select2SetValidation($sel2RSched);
      select2SetValidation($sel2RNewDivision);
      select2SetValidation($sel2RNewDivUnit);
      select2SetValidation($sel2RNewReportingTo);

    }
  }

  //this part is important to disable virtual keyboard of mobile to display
  // when using the select2 plugin
  window.select2typing = false;
  $(document).on("focus", ".select2-search__field", function () {
    if (window.select2typing == false) {
      $(this).blur();
    }
  });


  //this part is important to disable virtual keyboard of mobile to display
  // when using the select2 plugin
  window.select2typing = false;
  $(document).on("focus", ".select2-search__field", function () {
    if (window.select2typing == false) {
      $(this).blur();
    }
  });

  $(document).on("click", ".select2-search__field", function () {
    window.select2typing = true;
    $(this).focus();
  });

  $("select").on("select2:close", function () {
    window.select2typing = false;
  });

  var date = new Date();

  var $modalEmployeeUpdate = $("#modalEmployeeUpdate");
  var $modalTransferEmployee = $("#modalTransferEmployee");
  var $modalChangeEmploymentType = $("#modalChangeEmploymentType");
  var $modalChangeEmploymentPosition = $("#modalChangeEmploymentPosition");
  var $modalEmployeePayroll = $("#modalEmployeePayroll");

  var $tblEmployee = $("#tblEmployee");

  window.$memp = $modalEmployeeUpdate;
  window.$cmdOption = $cmdOption;
  window.$modalEmployeePayroll = $modalEmployeePayroll;
  //var to hold what command selected by user
  //1 - add new employee
  //2 - edit
  //3 - delete

  date.setDate(date.getDate());

  $tblEmployee = $('#tblEmployee').DataTable({
    "oLanguage": {
      "sInfo": "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
    },
    "responsive": true,
    "processing": true,
    "serverSide": true,
    "ajax": {
      "url": "/page/human-resources/employee/list/" + (new Date()).getTime(),

      "type": "POST",
    },
    columns: [

      { data: "temp_hashcode", title: "Id", "visible": false },
      { data: "picture", title: "Id", "visible": true },
      { data: "fullName", title: "Fullname", "visible": true },
      { data: "dob_gender", title: "Other Info" },
      { data: "fullAddress", title: "Address", "visible": true },
      { data: "fileDetails", title: "Employment Type", "visible": true },
      { data: "divDetails", title: "Division Details", "visible": true },

      { data: "action", title: "Action" }
    ]
  });



  jQuery.validator.addMethod("valid_philsysid", function (value, element) {

    if (value.length == 0) {
      return true;
    } else {
      $nPos = (value.indexOf('_'));
      if ($nPos > -1) {
        return false;
      } else {
        return true;
      }
    }

  }, "Philsys ID is Invalid");

  jQuery.validator.addMethod(
    "validDOB",
    function (value, element) {
      var from = value.split("-"); // DD MM YYYY
      // var from = value.split("/"); // DD/MM/YYYY

      var year = from[0];
      var month = from[1];
      var day = from[2];
      var age = 20;

      var mydate = new Date();
      mydate.setFullYear(year, month - 1, day);

      var currdate = new Date();
      var setDate = new Date();

      setDate.setFullYear(mydate.getFullYear() + age, month - 1, day);

      if ((currdate - setDate) > 0) {
        return true;
      } else {
        return false;
      }
    },
    "Sorry, too young to work"
  );

  $validator = $('#frmHumanResourcesEmployee').validate({
    focusInvalid: false,
    ignore: [],
    rules: {
      'philsys_id': {
        valid_philsysid: true,
        remote: {
          url: "/page/human-resources/employee/validate/philsys_id",
          type: "POST",
          data: {
            "temp_id": function () {
              return $("#temp_id").val();
            }
          }
        }
      },
      'philsys_doi': {
        required: function (element) {

          val = $("#philsys_id").val();
          if (val.indexOf('_') >= 0 && val.length <= 18) {
            return true;
          } else if (val.indexOf('_') == -1 && val.length == 0) {
            return false;
          }

          if (val.indexOf('_') == -1 && val.length == 18) {
            return true;
          }
          return false;
        }
      },
      'philsys_poi': {
        required: function (element) {

          val = $("#philsys_id").val();

          if (val.indexOf('_') >= 0 && val.length <= 18) {
            return true;
          } else if (val.indexOf('_') == -1 && val.length == 0) {
            return false;
          }

          if (val.indexOf('_') == -1 && val.length == 18) {
            return true;
          }
          return false;
        }
      },
      'temp_first': {
        required: true
      },
      'temp_mid': {
        required: true
      },
      'temp_last': {
        required: true
      },
      'temp_suffix': {
        required: true
      },
      'temp_blood': {
        required: true
      },
      'temp_gender': {
        required: true
      },
      'temp_dob': {
        validDOB: true,
        required: true
      },
      'regcode': {
        required: true
      },
      'provcode': {
        required: true
      },
      'citymuncode': {
        required: true
      },
      'brgycode': {
        required: true
      },
      'temp_mobile': {
        required: true,
        minlength: 11,
        maxlength: 11,
        remote: {
          url: "/page/human-resources/employee/validate/temp_mobile",
          type: "POST",
          data: {
            "temp_id": function () {
              return $("#temp_id").val();
            }
          }
        }
      },
      'temp_email': {
        required: true,
        email: true,
        remote: {
          url: "/page/human-resources/employee/validate/temp_email",
          type: "POST",
          data: {
            "temp_id": function () {
              return $("#temp_id").val();
            }
          }
        }
      },
      'rtitle_id': {
        required: true
      },
      'temp_biometric_id': {
        required: true,
        remote: {
          url: "/page/human-resources/employee/validate/temp_biometric_id",
          type: "POST",
          data: {
            "temp_id": function () {
              return $("#temp_id").val();
            }
          }
        }
      }
      // ,
      // 'temp_efn': {
      //   required: true,
      //   remote: {
      //     url: "/page/human-resources/employee/validate/temp_efn",
      //     type: "POST",
      //     data: {
      //       "temp_id": function () {
      //         return $("#temp_id").val();
      //       }
      //     }
      //   }
      // }
    },
    messages: {
      philsys_id: {
        remote: jQuery.validator.format("Already taken")
      },
      temp_mobile: {
        remote: jQuery.validator.format("Mobile no already entered")
      },
      temp_email: {
        remote: jQuery.validator.format("Email address already entered")
      },
      temp_biometric_id: {
        remote: jQuery.validator.format("Biometric ID already entered")
      }
      // ,
      // temp_efn: {
      //   remote: jQuery.validator.format("File No already entered")
      // }
    },
    errorElement: "em",
    errorPlacement: function (error, element) {
      // Add the `help-block` class to the error element
      error.insertAfter(element.parent("div.input-group"));
      error.addClass("help-block");
      error.insertAfter(element.parent("div.selectize-input"));
      error.addClass("help-block");
    },
    highlight: function (element, errorClass, validClass) {
      $(element).addClass("error").removeClass("valid");

    },
    unhighlight: function (element, errorClass, validClass) {
      $(element).addClass("valid").removeClass("error");
    },

    submitHandler: function (form) {
      // alert('inform');
      $url = '/page/human-resources/employee/' + ['add', 'edit', 'delete'][$cmdOption - 1] + '/*'
      $.ajax({
        url: $url,
        type: 'POST',
        data: $("#frmHumanResourcesEmployee").serialize(),
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
            $modalEmployeeUpdate.modal('hide');
            $tblEmployee.ajax.reload(null, false);
          } else {
            return false;
          }

        }
      });
      return false;
    }
  });

  initDates();

  $("#philsys_id").inputmask();

  //add new employee
  $("#btnNewEmployee").on('click', function (e) {
    //alert('xxx');
    clearSchedForm();
    clearForm();
    window.$cmdOption = 1;
    $("#temp_id").val('0');         //new employee no temp_id assigned yet

    $("#modalHumanResourcesEmployeeTitle").html("New Employee");
    $("#btnEmployee").html("Save");
    $modalEmployeeUpdate.modal('show');
  });



  //edit employee
  var $selectedTemp_id = 0;
  $('#tblEmployee tbody').on('click', '.btnEmployeeEdit', function () {
    $data = $(this).data();
    $selectedSched_id = $data.id;
    clearForm();
    $.ajax({
      url: '/page/human-resources/employee/findhash/*',
      type: 'POST',
      data: { temp_hashcode: $data.hash, temp_id: $selectedTemp_id },

      success: function (data) {
        $newData = JSON.parse(data);
        console.log($newData.details[0]);
        setFormContentDetails($newData.details[0], $newData.works[0]);

        $("#modalHumanResourcesEmployeeTitle").html("Edit Employee");
        $("#btnEmployee").html("Save Changes");

        window.$memp.modal('show');
        window.$cmdOption = 2;
        

      }

    });

    return false;
  });

 //edit employee
 
 $('#tblEmployee tbody').on('click', '.btnEmployeeDelete', function () {
   $data = $(this).data();
   $selectedSched_id = $data.id;
   clearForm();
   $.ajax({
     url: '/page/human-resources/employee/findhash/*',
     type: 'POST',
     data: { temp_hashcode: $data.hash, temp_id: $selectedSched_id },

     success: function (data) {
       $newData = JSON.parse(data);
       console.log($newData.details[0]);
       setFormContentDetails($newData.details[0], $newData.works[0]);

       $("#modalHumanResourcesEmployeeTitle").html("Delete Employee");
       $("#btnEmployee").html("Delete");

       window.$memp.modal('show');
       window.$cmdOption = 3;
     }

   });

   return false;
 });

  //employee transfer
  $('#tblEmployee tbody').on('click', '.btnEmployeeTransfer', function () {

    $data = $(this).data();
    $selectedTempID = $data.id;
    $.ajax({
      url: '/page/human-resources/employee/work/getWorkByTempID/*',
      type: 'POST',
      data: { temp_id: $data.id },
      success: function (data) {
        $newData = JSON.parse(data);
        console.log($newData);
        $('#transferTempID').attr('value', $selectedTempID);
        $("#temp_work_id").val($newData[0]['temp_work_id']);

        $("#currentDivision").empty();
        $("#currentDivision").append('<option value="' + $newData[0]['rdivision_id'] + '">' + $newData[0]['rdivision_name'] + '</option>');

        $("#currentDivUnit").empty();
        // $("#currentDivUnit").append('<option value="' + $newData[0]['rdivunit_id'] + '">' + $newData[0]['rdivision_sectionunit_name'] + '</option>');

        $("#currentReportingTo").empty();
        $("#currentReportingTo").append('<option value="' + $newData[0]['temp_work_reporting_to_id'] + '">' + $newData[0]['reportingTo'] + '</option>');

        $("#ddNewDivision").val('').trigger("change");
        $("#ddNewDivUnit").val('').trigger("change");
        $("#ddNewReportingTo").val('').trigger("change");

        $modalTransferEmployee.modal('show');
      }
    });

  });


  //employment Type
  $('#tblEmployee tbody').on('click', '.btnEmployeePosition', function () {
    $data = $(this).data();
    $selectedTempID = $data.id;
    $("#newGrade").val('');
    $("#newStep").val('');
    $("#newSalary").val('');
    $.ajax({
      url: '/page/human-resources/employee/work/getWorkByTempID/*',
      type: 'POST',
      data: { temp_id: $data.id },
      success: function (data) {
        $newData = JSON.parse(data);
        console.log($newData);
        $('#EmployeePositionTempID').attr('value', $selectedTempID);
        $("#EmployeePositionTempWorkID").val($newData[0]['temp_work_id']);
        $("#currentGrade").val($newData[0]['rgradestep_gradeno']);
        $("#currentStep").val($newData[0]['rgradestep_stepno']);
        $("#currentSalary").val($newData[0]['rgradestep_salary']);

        $("#currentJobPosition").empty();
        $("#currentJobPosition").append('<option value="' + $newData[0]['rposition_id'] + '">' + $newData[0]['rposition_name'] + '</option>');

        $("#ddNewJobPosition").val('').trigger("change");
        $modalChangeEmploymentPosition.modal('show');
      }
    });
  });
  //employment Type
  $('#tblEmployee tbody').on('click', '.btnEmployeeEmploymentType', function () {
    $data = $(this).data();
    $selectedTempID = $data.id;
    $.ajax({
      url: '/page/human-resources/employee/work/getWorkByTempID/*',
      type: 'POST',
      data: { temp_id: $data.id },
      success: function (data) {
        $newData = JSON.parse(data);
        console.log($newData);
        $('#EmploymentTypeTempID').attr('value', $selectedTempID);
        $("#EmploymentTypeTempWorkID").val($newData[0]['temp_work_id']);

        $("#currentEmploymentType").empty();
        $("#currentEmploymentType").append('<option value="' + $newData[0]['remployment_type_id'] + '">' + $newData[0]['remployment_type_desc'] + '</option>');

        $("#ddNewEmploymentType").val('').trigger("change");
        $modalChangeEmploymentType.modal('show');
      }
    });
  });


  //onchange in regcode
  $sel2RRegCode.on('select2:select', function (e) {
    var $data = e.params.data;
    console.log('xxxx', $data.id);

    $sel2RProvCode.empty();
    $sel2RCityMunCode.empty();
    $sel2RBrgyCode.empty();
    $sel2RProvCode.append('<option value="">Select province...</option>');

    let $aNewProvCode = $aProvCode.filter(provcode => provcode.regcode === $data.id);

    for (i = 0; i < $aNewProvCode.length; i++) {
      $sel2RProvCode.append('<option value="' + $aNewProvCode[i].id + '">' + $aNewProvCode[i].text + '</option>');
    }
  });


  //onchange in provcode
  $sel2RProvCode.on('select2:select', function (e) {
    var $data = e.params.data;

    $sel2RCityMunCode.empty();
    $sel2RBrgyCode.empty();
    $sel2RCityMunCode.append('<option value="">Select city/town...</option>');

    let $aNewCityMunCode = $aCityMunCode.filter(citymun => citymun.provcode === $data.id);

    for (i = 0; i < $aNewCityMunCode.length; i++) {
      $sel2RCityMunCode.append('<option value="' + $aNewCityMunCode[i].id + '">' + $aNewCityMunCode[i].text + '</option>');
    }
  });

  //onchange in citymuncode
  $sel2RCityMunCode.on('select2:select', function (e) {
    var $data = e.params.data;

    $("#brgycode").empty();
    $("#brgycode").append('<option value="">Select barangay...</option>');
    let $aNewBrgyCode = $aBrgyCode.filter(brgycode => brgycode.citymuncode === $data.id);

    for (i = 0; i < $aNewBrgyCode.length; i++) {
      $sel2RBrgyCode.append('<option value="' + $aNewBrgyCode[i].id + '">' + $aNewBrgyCode[i].text + '</option>');
    }
  });

  $sel2RDivision.on('select2:select', function (e) {
    var $data = e.params.data;
    $sel2RDivUnit.empty();
    $sel2RDivUnit.append('<option value="">Select division unit...</option>');
    let $aNewDivUnit = $aDivUnit.filter(divUnit => divUnit.rdivision_id === $data.id);
    for (i = 0; i < $aNewDivUnit.length; i++) {
      $sel2RDivUnit.append('<option value="' + $aNewDivUnit[i].id + '">' + $aNewDivUnit[i].text + '</option>');
    }
  });

  $sel2RPosition.on('select2:select', function (e) {
    var $data = e.params.data;

    $pos = 0;
    for (i = 0; i < $aPosition.length; i++) {
      console.log($aPosition[i]['id'], i);
      if ($data.id === $aPosition[i]['id']) {

        $pos = i;
        break;
      }
    }
    $condGrade = $aPosition[$pos]['rgradestep_gradeno'];
    $condStep = $aPosition[$pos]['rgradestep_stepno'];

    $idxEmpType = $sel2REmpType.val();
    if ($idxEmpType === '1') {
      $("#rgradestep_gradeno").val($aPosition[$pos]['rgradestep_gradeno']);
      $("#rgradestep_stepno").val($aPosition[$pos]['rgradestep_stepno']);
    } else {
      $("#rgradestep_gradeno").val('0');
      $("#rgradestep_stepno").val('0');
    }


    //find salary by year, grade, and step
    $.ajax({
      url: '/page/ref/cGradeStep/findGradeStep/*',
      type: 'POST',
      data: {
        gradeno: $aPosition[$pos]['rgradestep_gradeno'],
        stepno: $aPosition[$pos]['rgradestep_stepno']
      },
      success: function (result) {
        $data = JSON.parse(result);
        $("#rgradestep_salary").val($data.rgradestep_salary);
        
      }
    });

  });

  $("#rgradestep_stepno").on("change",function(){
   
    $.ajax({
      url: '/page/ref/cGradeStep/findStep/*',
      type: 'POST',
      data: {
        gradeno: $("#rgradestep_gradeno").val(),
        stepno: $("#rgradestep_stepno").val()
      },
      success: function (result) {
        $data = JSON.parse(result);
        $("#rgradestep_salary").val($data.rgradestep_salary);
        
      }
    });
  });

  $sel2RNewDivision.on('select2:select', function (e) {
    var $data = e.params.data;
    $sel2RNewDivUnit.empty();
    console.log($data, $aDivUnit);

    let $aNewUnit = $aDivUnit.filter(divunit => divunit.rdivision_id === $data.id);
    for (i = 0; i < $aNewUnit.length; i++) {
      $sel2RNewDivUnit.append('<option value="' + $aNewUnit[i].id + '">' + $aNewUnit[i].text + '</option>');
    }
    //$sel2RDivUnit.val($divisionUnit).trigger('change');
  });

  $sel2REmpType.on('select2:select', function (e) {
    $idxEmpType = $(this).val();
    if ($idxEmpType === '1') {
      $("#rgradestep_gradeno").val($condGrade);
      $("#rgradestep_stepno").val($condStep);
    } else {
      $("#rgradestep_gradeno").val('0');
      $("#rgradestep_stepno").val('0');
    }
  });


  initDates("#philsys_doi", { autoclose: true, todayHighlight: true, endDate: date, disableTouchKeyboard: true, format: 'yyyy-mm-dd' });
  initDates("#temp_dob", { autoclose: true, todayHighlight: true, endDate: date, disableTouchKeyboard: true, format: 'yyyy-mm-dd' });
  initDates("#temp_bank_expire", { autoclose: true, todayHighlight: true, startDate: date, disableTouchKeyboard: true, format: 'yyyy-mm-dd' });
  initDates("#temp_datejoined", { autoclose: true, todayHighlight: true, endDate: date, disableTouchKeyboard: true, format: 'yyyy-mm-dd' });


  //initialize dates
  function initDates($domField, $objProperty) {
    $($domField).datepicker($objProperty).on('change', function () {
      $(this).valid(); // triggers a validation of philsys_doi
    });
  }

  function clearForm() {
    $("#temp_id").val('0');
    $("#philsys_id").val('');

    $("#philsys_doi").datepicker().datepicker('setDate', '');
    $("#philsys_poi").val('');

    $sel2RTitle.val('').trigger('change');
    $("#temp_first").val('');
    $("#temp_mid").val('');
    $("#temp_last").val('');
    $sel2RSuffix.val('').trigger('change');
    $sel2RBlood.val('').trigger('change');
    $sel2RGender.val('').trigger('change');
    $("#temp_dob").datepicker().datepicker('setDate', '');
    $sel2RNationality.val('').trigger('change');
    $("#temp_pob").val('');
    $sel2RMarital.val('').trigger('change');
    $sel2RReligion.val('').trigger('change');

    $sel2RRegCode.val('').trigger('change');
    $sel2RProvCode.empty();
    $sel2RCityMunCode.empty();
    $sel2RBrgyCode.empty();

    $("#temp_zone").val('');
    $("#temp_street").val('');
    $("#temp_bldgno").val('');
    $("#temp_pobox").val('');
    $("#temp_zipcode").val('');

    $("#temp_landline").val('');
    $("#temp_mobile").val('');
    $("#temp_email").val('');
    $("#temp_fb").val('');
    $("#temp_whatsapp").val('');
    $("#temp_viber").val('');

    $sel2RBank.val('').trigger('change');
    $("#temp_bank_address").val('');
    $("#temp_bank_account").val('');
    $("#temp_bank_expire").datepicker().datepicker('setDate', '');

    $("#temp_gsis").val('');
    $("#temp_sss").val('');
    $("#temp_birtin").val('');
    $("#temp_philhealth").val('');
    $("#temp_pagibig").val('');

    $sel2REmpType.val('').trigger('change');
    $sel2RDivision.val('').trigger('change');
    $sel2RDivUnit.empty();
    $sel2RDivUnit.val('').trigger('change');
    $sel2RReportTo.val('').trigger('change');

    $("#temp_datejoined").datepicker().datepicker('setDate', '');

    $("#temp_biometric_id").val('');
    // $("#temp_efn").val('');
    $sel2RPosition.val('').trigger('change');
    $("#rgradestep_gradeno").val('');
    $("#rgradestep_stepno").val('');
    $("#rgradestep_salary").val('');
  }

  function setFormContentDetails($contentDetails, $WorkDetails) {

    $(".temp_id").val($contentDetails.temp_id);
    $("#philsys_id").val($contentDetails.philsys_id);
    $("#philsys_doi").datepicker().datepicker('setDate', $contentDetails.philsys_doi);
    $("#philsys_poi").val($contentDetails.philsys_poi);
    $("#rtitle_id").val($contentDetails.rtitle_id).trigger('change');
    $("#temp_first").val($contentDetails.temp_first);
    $("#temp_mid").val($contentDetails.temp_mid);
    $("#temp_last").val($contentDetails.temp_last);

    $("#rtitle_id").val($contentDetails.rtitle_id).trigger('change');
    $("#temp_suffice").val($contentDetails.temp_suffice).trigger('change');
    $("#temp_blood").val($contentDetails.temp_blood).trigger('change');
    $("#temp_gender").val($contentDetails.temp_gender).trigger('change');
    $("#temp_dob").datepicker().datepicker('setDate', $contentDetails.temp_dob);
    $("#rcountry_id").val($contentDetails.rcountry_id).trigger('change');
    $("#temp_pob").val($contentDetails.temp_pob);

    $("#temp_marital").val($contentDetails.temp_marital).trigger('change');
    $("#rreligion_id").val($contentDetails.rreligion_id).trigger('change');

    $("#temp_gsis").val($contentDetails.temp_gsis);
    $("#temp_sss").val($contentDetails.temp_sss);
    $("#temp_birtin").val($contentDetails.temp_birtin);
    $("#temp_philhealth").val($contentDetails.temp_philhealth);
    $("#temp_pagibig").val($contentDetails.temp_pagibig);

    $sel2RRegCode.val($contentDetails.regcode).trigger('change');
    // changeRegionCode($contentDetails.regcode);
    changeProvinceCode($contentDetails.regcode, $contentDetails.provcode);
    changeCityMunCode($contentDetails.provcode, $contentDetails.citymuncode);
    changeBrgyCode($contentDetails.citymuncode, $contentDetails.brgycode);

    $("#temp_zone").val($contentDetails.temp_zone);
    $("#temp_street").val($contentDetails.temp_street);
    $("#temp_bldgno").val($contentDetails.temp_bldgno);

    $("#temp_pobox").val($contentDetails.temp_pobox);
    $("#temp_zipcode").val($contentDetails.temp_zipcode);
    $("#temp_landline").val($contentDetails.temp_landline);
    $("#temp_mobile").val($contentDetails.temp_mobile);
    $("#temp_email").val($contentDetails.temp_email);
    $("#temp_fb").val($contentDetails.temp_fb);
    $("#temp_whatsapp").val($contentDetails.temp_whatsapp);
    $("#temp_viber").val($contentDetails.temp_viber);

    changeBank($contentDetails.rbank_id);

    $("#temp_bank_address").val($contentDetails.temp_bank_address);
    $("#temp_bank_account").val($contentDetails.temp_bank_account);

    $("#temp_bank_expire").datepicker().datepicker('setDate', $contentDetails.temp_bank_expire);

    changeEmploymentType($WorkDetails.remployment_type_id);
    changeDivision($WorkDetails.rdivision_id);
    // changeDivisionUnit($WorkDetails.rdivision_id, $WorkDetails.rdivunit_id);
    changeReportingTo($WorkDetails.temp_work_reporting_to_id);
    changePosition($WorkDetails.rposition_id);

    $("#temp_datejoined").datepicker().datepicker('setDate', $contentDetails.temp_datejoined);
    $("#temp_biometric_id").val($contentDetails.temp_biometric_id);
    // $("#temp_efn").val($contentDetails.temp_efn);

    $("#rgradestep_gradeno").val($WorkDetails.rgradestep_gradeno);
    $("#rgradestep_stepno").val($WorkDetails.rgradestep_stepno);
    $("#rgradestep_salary").val($WorkDetails.rgradestep_salary);

  }

  function changeRegionCode($regCode) {
    $sel2RRegCode.val($regCode);
    $sel2RRegCode.select2().trigger('change');
  }

  function changeProvinceCode($regCode, $provCode) {

    $sel2RProvCode.empty();
    $sel2RCityMunCode.empty();
    $sel2RBrgyCode.empty();
    $sel2RProvCode.append('<option value="">Select province...</option>');

    let $aNewProvCode = $aProvCode.filter(provcode => provcode.regcode === $regCode);

    for (i = 0; i < $aNewProvCode.length; i++) {
      $sel2RProvCode.append('<option value="' + $aNewProvCode[i].id + '">' + $aNewProvCode[i].text + '</option>');
    }
    $sel2RProvCode.val($provCode).trigger('change');
  }

  function changeCityMunCode($provCode, $cityMunCode) {
    $sel2RCityMunCode.empty();
    $sel2RBrgyCode.empty();
    $sel2RCityMunCode.append('<option value="">Select city/town...</option>');

    let $aNewCityMunCode = $aCityMunCode.filter(citymun => citymun.provcode === $provCode);

    for (i = 0; i < $aNewCityMunCode.length; i++) {
      $sel2RCityMunCode.append('<option value="' + $aNewCityMunCode[i].id + '">' + $aNewCityMunCode[i].text + '</option>');
    }
    $sel2RCityMunCode.val($cityMunCode);
    $sel2RCityMunCode.trigger('change');
  }

  function changeBrgyCode($cityMunCode, $brgyCode) {
    $("#brgycode").empty();
    $("#brgycode").append('<option value="">Select barangay...</option>');
    let $aNewBrgyCode = $aBrgyCode.filter(brgycode => brgycode.citymuncode === $cityMunCode);

    for (i = 0; i < $aNewBrgyCode.length; i++) {
      $sel2RBrgyCode.append('<option value="' + $aNewBrgyCode[i].id + '">' + $aNewBrgyCode[i].text + '</option>');
    }
    $sel2RBrgyCode.val($brgyCode);
    $sel2RBrgyCode.trigger('change');
  }

  function changeBank($bankID) {
    $("#rbank_id").val($bankID).trigger('change');
    //$("#rbank_id").select2()
  }

  function changeEmploymentType($employmentType) {
    $sel2REmpType.val($employmentType).trigger('change');
    // $sel2REmpType.select2()
  }

  function changeDivision($division) {
    $sel2RDivision.val($division).trigger('change');
    // $sel2RDivision.select2()
  }

  function changeDivisionUnit($divisionID, $divisionUnit) {
    $sel2RDivUnit.empty();
    console.log($aDivUnit);
    // alert('xx');
    let $aNewUnit = $aDivUnit.filter(divunit => divunit.rdivision_id === $divisionID);
    for (i = 0; i < $aNewUnit.length; i++) {
      $sel2RDivUnit.append('<option value="' + $aNewUnit[i].id + '">' + $aNewUnit[i].text + '</option>');
    }
    $sel2RDivUnit.val($divisionUnit).trigger('change');
  }

  function changeReportingTo($reportTo) {
    $sel2RReportTo.val($reportTo).trigger('change');
    // $sel2RReportTo.select2()
  }

  function changePosition($positionId) {
    $sel2RPosition.val($positionId).trigger('change');
    // $sel2RPosition.select2()
  }

  $("#newGrade").keyup(function (e) {
    $val = $(this).val();
    $("#newSalary").val('0');
    if (isNaN($val)) {
      return false;
    } else if ($val > 33) {
      return false;
    }
    $.ajax({
      url: '/page/ref/cGradeStep/findGradeStep/*',
      type: 'POST',
      data: {
        gradeno: $("#newGrade").val(),
        stepno: $("#newStep").val()
      },
      success: function (data) {
        data = JSON.parse(data);
        console.log(data.rgradestep_salary);
        $("#newSalary").val(data.rgradestep_salary);
        $validatorEmpPosition.valid();
      }
    });
  });

  $("#newGrade").change(function (e) {
    $val = $(this).val();
    $("#newSalary").val('0');
    if (isNaN($val)) {
      return false;
    } else if ($val > 33) {
      return false;
    }
    $.ajax({
      url: '/page/ref/cGradeStep/findGradeStep/*',
      type: 'POST',
      data: {
        gradeno: $("#newGrade").val(),
        stepno: $("#newStep").val()
      },
      success: function (data) {
        data = JSON.parse(data);
        console.log(data.rgradestep_salary);
        $("#newSalary").val(data.rgradestep_salary);
        $validatorEmpPosition.valid();
      }
    });
  });

  $("#newStep").keyup(function (e) {
    $val = $(this).val();
    $("#newSalary").val('0');
    if (isNaN($val)) {
      return false;
    } else if ($val > 8) {
      return false;
    }
    $.ajax({
      url: '/page/ref/cGradeStep/findGradeStep/*',
      type: 'POST',
      data: {
        gradeno: $("#newGrade").val(),
        stepno: $("#newStep").val()
      },
      success: function (data) {
        data = JSON.parse(data);
        console.log(data);
        $("#newSalary").val(data.rgradestep_salary);
        $validatorEmpPosition.valid();
      }
    });
  });

  $("#newStep").change(function (e) {
    $val = $(this).val();
    if (isNaN($val)) {
      return false;
    } else if ($val > 8) {
      return false;
    }
    $.ajax({
      url: '/page/ref/cGradeStep/findGradeStep/*',
      type: 'POST',
      data: {
        gradeno: $("#newGrade").val(),
        stepno: $("#newStep").val()
      },
      success: function (data) {
        data = JSON.parse(data);
        console.log(data.rgradestep_salary);
        $("#newSalary").val(data.rgradestep_salary)
      }
    });
  });

  $("#newSalary").change(function (e) {
    $validatorEmpPosition.valid();
  });

  $("#newSalary").keyup(function (e) {
    $validatorEmpPosition.valid();
  });

  $validatorEmpTransfer = $('#frmModalEmployeeTransfer').validate({
    focusInvalid: false,
    ignore: [],
    rules: {

      'ddNewDivision': {
        required: true
      },
      'ddNewSection': {
        required: true
      },
      'ddNewReportingTo': {
        required: true
      }
    },
    errorElement: "em",
    errorPlacement: function (error, element) {
      // Add the `help-block` class to the error element
      error.insertAfter(element.parent("div.input-group"));
      error.addClass("help-block");
      error.insertAfter(element.parent("div.selectize-input"));
      error.addClass("help-block");
    },
    highlight: function (element, errorClass, validClass) {
      $(element).addClass("error").removeClass("valid");

    },
    unhighlight: function (element, errorClass, validClass) {
      $(element).addClass("valid").removeClass("error");
    },

    submitHandler: function (form) {
      alert('to be saved');
      $url = '/page/human-resources/employee/work/updatedup/*';
      $.ajax({
        url: $url,
        type: 'POST',
        data: $("#frmModalEmployeeTransfer").serialize(),
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
            $modalTransferEmployee.modal('hide');
            $tblEmployee.ajax.reload(null, false);
          } else {
            return false;
          }
        }
      });
      return false;
    }
  });

  $validatorEmpPosition = $('#frmChangeEmploymentPosition').validate({
    focusInvalid: false,
    ignore: [],
    rules: {
      'ddNewJobPosition': {
        required: true
      },
      'newGrade': {
        required: true,
        min: 1,
        max: 33/* ,
            remote: {
              url: "/page/ref/cGradeStep/findGradeStep/*",
              type: "POST",
              data: {
                "gradeno": function() {
                  return $("#newGrade").val();
                },
                "stepno": function() {
                  return $("#newStep").val();
                }
              },success: function(data) {
                $("#newSalary").val(data.rgradestep_salary)
            }
            } */
      },
      'newStep': {
        required: true,
        min: 1,
        max: function (e) {
          if ($("#newGrade").val() == 33) {
            return 2;
          } else return 8;
        }/* ,
            remote: {
              url: "/page/ref/cGradeStep/findGradeStep/*",
              type: "POST",
              data: {
                "gradeno": function() {
                  return $("#newGrade").val();
                },
                "stepno": function() {
                  return $("#newStep").val();
                }
              },success: function(data) {
                $("#newSalary").val(data.rgradestep_salary)
            }
            } */
      },
      'newSalary': {
        required: true,
        min: 10000
      }
    },
    errorElement: "em",
    errorPlacement: function (error, element) {
      // Add the `help-block` class to the error element
      error.insertAfter(element.parent("div.input-group"));
      error.addClass("help-block");
      error.insertAfter(element.parent("div.selectize-input"));
      error.addClass("help-block");
    },
    highlight: function (element, errorClass, validClass) {
      $(element).addClass("error").removeClass("valid");

    },
    unhighlight: function (element, errorClass, validClass) {
      $(element).addClass("valid").removeClass("error");
    },

    submitHandler: function (form) {
      alert('to be saved');
      $url = '/page/human-resources/employee/work/updateEmployeePosition/*';
      $.ajax({
        url: $url,
        type: 'POST',
        data: $("#frmChangeEmploymentPosition").serialize(),
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
            $modalChangeEmploymentPosition.modal('hide');
            $tblEmployee.ajax.reload(null, false);
          } else {
            return false;
          }

        }
      });
      return false;
    }
  });


  //validate employment type
  $validatorEmpType = $('#frmChangeEmploymentType').validate({
    focusInvalid: false,
    ignore: [],
    rules: {
      'ddNewEmploymentType': {
        required: true
      }
    },
    errorElement: "em",
    errorPlacement: function (error, element) {
      // Add the `help-block` class to the error element
      error.insertAfter(element.parent("div.input-group"));
      error.addClass("help-block");
      error.insertAfter(element.parent("div.selectize-input"));
      error.addClass("help-block");
    },
    highlight: function (element, errorClass, validClass) {
      $(element).addClass("error").removeClass("valid");

    },
    unhighlight: function (element, errorClass, validClass) {
      $(element).addClass("valid").removeClass("error");
    },

    submitHandler: function (form) {
      alert('to be saved');
      $url = '/page/human-resources/employee/work/updateEmploymentType/*';
      $.ajax({
        url: $url,
        type: 'POST',
        data: $("#frmChangeEmploymentType").serialize(),
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
            $modalChangeEmploymentType.modal('hide');
            $tblEmployee.ajax.reload(null, false);
          } else {
            return false;
          }

        }
      });
      return false;
    }
  });


  function getBsMq() {
    var currMq;
    var mqDetector = $('#mq-detector [data-mq]');
    mqDetector.each(function (i) {
      if ($(this).is(':visible')) {
        currMq = $(this).attr('data-mq');
      }
    });
    return currMq;
  }

  window.addEventListener('resize', currentSize);

  function currentSize() {

    if (getBsMq() == "xs") {
      select2SetInit($sel2RNewReportingTo, '#modalTransferEmployee .modal-content .modal-body', $aReportTo);
      // $sel2RNewReportingTo.select2({
      //   dropdownParent: $('#modalTransferEmployee .modal-content .modal-body'),
      //   minimumResultsForSearch: -1

      // });
    } else {
      select2SetInit($sel2RNewReportingTo, '#modalTransferEmployee', $aReportTo);

      // $sel2RNewReportingTo.select2({
      //   dropdownParent: $('#modalTransferEmployee'),
      //   minimumResultsForSearch: -1

      // });
    }
  }

  function select2SetValidation($sel2Obj) {
    $sel2Obj.on('select2:select', function (e) {
      $(this).valid();
    });
  }

  function select2SetInit($selObj, $objParent, $aData) {
    $selObj.select2({
      dropdownParent: $($objParent),
      minimumResultsForSearch: -1,
      width: '100%',
      data: $aData
    });
  }


});