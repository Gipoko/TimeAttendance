// $(function () {
  var $tblEmployeeExperience;
  var $frmEmployeeExperience = $("#frmEmployeeExperience");
  var $btnEmployeeWorkExperienceAdd = $("#btnEmployeeWorkExperienceAdd");
  var $lastCmd = 0;
  
  var $modalEmployeeExperience = $("#modalEmployeeExperience");
  var $modalEmployeeExperienceTitle = $("#modalEmployeeExperienceTitle");
  var $btnEmployeeExperienceSave = $("#btnEmployeeExperienceSave");
  
  var $temp_exp_id = $("#temp_exp_id");
  var $temp_id = $("#temp_id");
  var $temp_exp_position = $("#temp_exp_position");
  var $temp_exp_companyname = $("#temp_exp_companyname");
  var $temp_exp_companyaddress = $("#temp_exp_companyaddress");
  var $temp_exp_from = $("#temp_exp_from");
  var $temp_exp_to = $("#temp_exp_to");
  var $temp_exp_jobdesc = $("#temp_exp_jobdesc");
  var $temp_exp_created = $("#temp_exp_created");
  var $temp_exp_updated = $("#temp_exp_updated");


  $tblEmployeeExperience = $('#tblEmployeeExperience').DataTable({
    "bInfo" : false,
    "responsive": true,
    "processing": true,
    "autoWidth": true,
    "searching": false,
    "paging": false,
    "ordering": false,
    columns: [
      { data: "temp_exp_id", title: "Id" },
      { data: "temp_exp_position", title: "Job" },
      { data: "temp_exp_jobdesc", title: "Job Description" },
      { data: "action", title: "Action" }
    ],
    "columnDefs": [
      { "width": "10px", "targets": 0 },
      { "width": "250px", "targets": 1 },
      { "width": "400px", "targets": 2 }
    ]
  });
  
  //load the family members
  $url = "/page/employee/details/workexp/list/*";
  $.ajax($url, {
    type: 'POST',
    dataType: 'JSON'
  }).then(function ($data) {
    // reload family members
  //   console.log($data.educations);
  // alert('xxxx');
    $tblEmployeeExperience.clear().rows.add($data.exps).draw();
  
  });
  
  //employee philsys_id date of issue
  $('#temp_exp_from').datepicker({
    format: 'yyyy-mm-dd',
    autoclose: true
  });
  
  //employee date of birth
  $('#temp_exp_to').datepicker({
    format: 'yyyy-mm-dd',
    autoclose: true
  });
  
  //validate Employee entry
  $('#frmEmployeeExperience').validate({
    focusInvalid: false,
    ignore: [],
    rules: {
      'temp_exp_position': {
        required: true
      },
      'temp_exp_companyname': {
        required: true
      },
      'temp_exp_companyaddress': {
        required: true
      },
      'temp_exp_from': {
        required: true
      },
      'temp_exp_to': {
        required: true
      },
      'temp_exp_jobdesc': {
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
      var $url = "/page/employee/details/workexp/" + ['add', 'edit', 'delete'][$lastCmd - 1] + '/*';
  
      $.ajax({
        url: $url,
        type: 'POST',
        data: $("#frmEmployeeExperience").serialize(),
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
            $tblEmployeeExperience.clear().rows.add($newData.exps).draw();
            $modalEmployeeExperience.modal('hide');
          }
          return false;
        }
      });

    }
  });
  
  //add new family member
  $btnEmployeeWorkExperienceAdd.on('click', function (e) {
    clearExpForm();
    $lastCmd = 1;
    //setValues($dummy);
    $modalEmployeeExperienceTitle.html("New Work Level");
    $btnEmployeeExperienceSave.show();
    $btnEmployeeExperienceSave.html("Save");
    $modalEmployeeExperience.modal('show');
  });
  
  //family member edit
  $('#tblEmployeeExperience tbody').on('click', '.btnExperienceEdit', function () {
    $data = $(this).data();
  
    $lastCmd = 2;
    $id = $data.id;
  
    //find it in db
    $url = "/page/employee/details/workexp/display/" + $id;
    $.ajax($url, {
      type: 'POST',
      dataType: 'JSON'
    }).then(function ($data) {
      // reload family members
      clearExpForm();
      setExpDetails($data.exps);
  
    });
    $modalEmployeeExperienceTitle.html("Update Education Level");
    $btnEmployeeExperienceSave.show();
    $btnEmployeeExperienceSave.html("Save Changes");
    $modalEmployeeExperience.modal('show');
  
    return false;
  });
  
  //Employee member deleting
  $('#tblEmployeeExperience tbody').on('click', '.btnExperienceDelete', function () {
    $lastCmd = 3;
  
    $data = $(this).data();
  
    $id = $data.id;
  
    //find it in db
    $url = "/page/employee/details/workexp/display/" + $id;
    $.ajax($url, {
      type: 'POST',
      dataType: 'JSON'
    }).then(function ($data) {
      // reload family members
  
      setExpDetails($data.exps);
  
    });
  
    $modalEmployeeExperienceTitle.html("Delete Education Level");
    $btnEmployeeExperienceSave.show();
    $btnEmployeeExperienceSave.html("Delete");
    $modalEmployeeExperience.modal('show');
    return false;
  });
  
  //Employee member view
  $('#tblEmployeeExperience tbody').on('click', '.btnExperienceView', function () {
    $lastCmd = 4;
    $data = $(this).data();
  
    $id = $data.id;

    //find it in db
    $url = "/page/employee/details/workexp/display/" + $id;
    $.ajax($url, {
      type: 'POST',
      dataType: 'JSON'
    }).then(function ($data) {
      // reload family members
  
      setExpDetails($data.exps);
    
    });
    $modalEmployeeExperienceTitle.html("View Education Level");
    $btnEmployeeExperienceSave.hide();
    $modalEmployeeExperience.modal('show');
    return false;

  });
  
  function setExpDetails($expDetails) {
    $temp_exp_id.val($expDetails.temp_exp_id);
    $temp_id.val($expDetails.temp_id);
    $temp_exp_position.val($expDetails.temp_exp_position);
    $temp_exp_companyname.val($expDetails.temp_exp_companyname);
    $temp_exp_companyaddress.val($expDetails.temp_exp_companyaddress);

    $temp_exp_jobdesc.val($expDetails.temp_exp_jobdesc);
    $temp_exp_from.datepicker().datepicker('setDate', $expDetails.temp_exp_from);
    $temp_exp_to.datepicker().datepicker('setDate', $expDetails.temp_exp_to);
  
  }
  
  function clearExpForm() {
    $temp_exp_id.val('');
    $temp_id.val('');
    $temp_exp_position.val('');
    $temp_exp_companyname.val('');
    $temp_exp_companyaddress.val('');
    $temp_exp_from.val('');
    $temp_exp_to.val('');
    $temp_exp_jobdesc.val('');
  }