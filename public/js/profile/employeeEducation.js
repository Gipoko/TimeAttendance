// $(function () {
  var $tblEmployeeEducation;
  var $frmHumanResourcesEmployeeProfileFamily = $("#frmHumanResourcesEmployeeProfileFamily");
  var $btnHumanResourcesEmployeeEducationAdd = $("#btnHumanResourcesEmployeeEducationAdd");
  var $lastCmd = 0;
  
  var $modalEmployeeEducation = $("#modalEmployeeEducation");
  var $modalEmployeeEducationTitle = $("#modalEmployeeEducationTitle");
  var $btnEmployeeEducationSave = $("#btnEmployeeEducationSave");
  
  var $temp_edu_id = $("#temp_edu_id");
  var $temp_edu_redu_id  = $("#temp_edu_redu_id");
  var $temp_edu_schoolname = $("#temp_edu_schoolname");
  var $temp_edu_schooladdress = $("#temp_edu_schooladdress");
  var $temp_edu_course = $("#temp_edu_course");
  var $temp_edu_from = $("#temp_edu_from");
  var $temp_edu_to = $("#temp_edu_to");
  
  var $aEduc;

  $sel2REducation = $("#temp_edu_redu_id").select2({});

  $processing = true;
  $.when(fetchMe('/page/ref/cEduc/list/*'))
  .then(function(resEduc ) { // Resolve

    $aEduc = JSON.parse(resEduc);

    $sel2REducation.select2();

    select2SetInit($sel2REducation,'#modalEmployeeEducation .modal-body', $aEduc);

    select2SetValidation($sel2REducation);

    }, function(){ // Reject!
    console.log('Something broke!');
  });

  $tblEmployeeEducation = $('#tblEmployeeEducation').DataTable({
    "bInfo" : false,
    "responsive": true,
    "processing": true,
    "autoWidth": true,
    "searching": false,
    "paging": false,
    "ordering": false,
    columns: [
      { data: "temp_edu_id", title: "Id" },
      { data: "temp_edu_schoolname", title: "School Name" },
      { data: "redu_desc", title: "Level" },
      { data: "temp_edu_course", title: "Course" },
      { data: "temp_edu_from", title: "From-To" },
      { data: "action", title: "Action" }
    ],
    "columnDefs": [
      { "width": "10px", "targets": 0 },
      { "width": "250px", "targets": 1 },
      { "width": "20", "targets": 2 }
    ]
  });
  
  //load the family members
  $url = "/page/employee/details/educ/list/*";
  $.ajax($url, {
    type: 'POST',
    dataType: 'JSON'
  }).then(function ($data) {
    // reload family members
  //   console.log($data.educations);
  // alert('xxxx');
    $tblEmployeeEducation.clear().rows.add($data.edus).draw();
  
  });
  
  //employee philsys_id date of issue
  $('#temp_edu_from').datepicker({
    format: 'yyyy-mm-dd',
    autoclose: true
  });
  
  //employee date of birth
  $('#temp_edu_to').datepicker({
    format: 'yyyy-mm-dd',
    autoclose: true
  });
  
  //validate Employee entry
  $('#frmEmployeeEducation').validate({
    focusInvalid: false,
    ignore: [],
    rules: {
      'temp_edu_schoolname': {
        required: true
      },
      'temp_edu_schooladdress': {
        required: true
      },
      'temp_edu_from': {
        required: true
      },
      'temp_edu_from': {
        required: true
      }
    },
  
    submitHandler: function (form) {
      // ajax call code here
      var $url = "/page/employee/details/educ/" + ['add', 'edit', 'delete'][$lastCmd - 1] + '/*';
  
      $.ajax({
        url: $url,
        type: 'POST',
        data: $("#frmEmployeeEducation").serialize(),
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
            $tblEmployeeEducation.clear().rows.add($newData.edus).draw();
            $modalEmployeeEducation.modal('hide');
          }
          return false;
        }
      });

    }
  });
  
  //add new family member
  $btnHumanResourcesEmployeeEducationAdd.on('click', function (e) {
    clearEducationForm();
    $lastCmd = 1;
    //setValues($dummy);
    $modalEmployeeEducationTitle.html("New Education Level");
    $btnEmployeeEducationSave.show();
    $btnEmployeeEducationSave.html("Save");
    $modalEmployeeEducation.modal('show');
  });
  
  //family member edit
  $('#tblEmployeeEducation tbody').on('click', '.btnEducationEdit', function () {
    $data = $(this).data();
  
    $lastCmd = 2;
    $id = $data.id;
  
    //find it in db
    $url = "/page/employee/details/educ/display/" + $id;
    $.ajax($url, {
      type: 'POST',
      dataType: 'JSON'
    }).then(function ($data) {
      // reload family members
  
      setEducationDetails($data.edus);
  
    });
    $modalEmployeeEducationTitle.html("Update Education Level");
    $btnEmployeeEducationSave.show();
    $btnEmployeeEducationSave.html("Save Changes");
    $modalEmployeeEducation.modal('show');
  
    return false;
  });
  
  //Employee member deleting
  $('#tblEmployeeEducation tbody').on('click', '.btnEducationDelete', function () {
    $lastCmd = 3;
  
    $data = $(this).data();
  
    $id = $data.id;
  
    //find it in db
    $url = "/page/employee/details/educ/display/" + $id;
    $.ajax($url, {
      type: 'POST',
      dataType: 'JSON'
    }).then(function ($data) {
      // reload family members
  
      setEducationDetails($data.edus);
  
    });
  
    $modalEmployeeEducationTitle.html("Delete Education Level");
    $btnEmployeeEducationSave.show();
    $btnEmployeeEducationSave.html("Delete");
    $modalEmployeeEducation.modal('show');
    return false;
  });
  
  //Employee member view
  $('#tblEmployeeEducation tbody').on('click', '.btnEducationView', function () {
    $lastCmd = 4;
    $data = $(this).data();
  
    $id = $data.id;

    //find it in db
    $url = "/page/employee/details/educ/display/" + $id;
    $.ajax($url, {
      type: 'POST',
      dataType: 'JSON'
    }).then(function ($data) {
      // reload family members
  
      setEducationDetails($data.edus);
    
    });
    $modalEmployeeEducationTitle.html("View Education Level");
    $btnEmployeeEducationSave.hide();
    $modalEmployeeEducation.modal('show');
    return false;

  });
  
  function setEducationDetails($educationDetails) {
    $temp_edu_id.val($educationDetails.temp_edu_id);
    $temp_edu_redu_id.val($educationDetails.temp_edu_redu_id).trigger('change');
    $temp_edu_schoolname.val($educationDetails.temp_edu_schoolname);
    $temp_edu_schooladdress.val($educationDetails.temp_edu_schooladdress);
    $temp_edu_course.val($educationDetails.temp_edu_course);
    $temp_edu_from.datepicker().datepicker('setDate', $educationDetails.temp_edu_from);
    $temp_edu_to.datepicker().datepicker('setDate', $educationDetails.temp_edu_to);
  
  }
  
  function clearEducationForm() {
    $temp_edu_id.val('');
    $temp_edu_schoolname.val('');
    $temp_edu_schooladdress.val('');
    $temp_edu_course.val('');
    $temp_edu_from.datepicker().datepicker('setDate', '');
    $temp_edu_to.datepicker().datepicker('setDate', '');
  }