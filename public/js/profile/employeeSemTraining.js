// $(function () {
var $tblEmployeeSemTraining;
var $frmEmployeeSemTraining = $("#frmEmployeeSemTraining");
var $btnEmployeeSemTrainAdd = $("#btnEmployeeSemTrainAdd");
var $lastCmd = 0;

var $modalEmployeeSemTraining = $("#modalEmployeeSemTraining");
var $modalEmployeeSemTrainingTitle = $("#modalEmployeeSemTrainingTitle");
var $btnEmployeeSemTrainingSave = $("#btnEmployeeSemTrainingSave");

var $temp_semtrain_id = $("#temp_semtrain_id");
var $temp_semtrain_eventname  = $("#temp_semtrain_eventname");
var $temp_semtrain_topic = $("#temp_semtrain_topic");
var $temp_semtrain_where = $("#temp_semtrain_where");
var $temp_semtrain_when = $("#temp_semtrain_when");

$tblEmployeeSemTraining = $('#tblEmployeeSemTraining').DataTable({
  "bInfo" : false,
  "responsive": true,
  "processing": true, 
  "autoWidth": true,
  "searching": false,
  "paging": false,
  "sDom": 'rt',

  columns: [
    { data: "temp_semtrain_id", title: "Id" },
    { data: "temp_semtrain_eventname", title: "Event" },
    { data: "temp_semtrain_when", title: "When" },
    { data: "temp_semtrain_where", title: "Where" },
    { data: "action", title: "Action" }
  ]
  
});


//load the certificate and license
$url = "/page/employee/details/semtrain/list/*";
$.ajax($url, {
  type: 'POST',
  dataType: 'JSON'
}).then(function ($data) {
  // reload family members
   console.log($data);
// alert('xxxx');
  $tblEmployeeSemTraining.clear().rows.add($data.SemTrain).draw();

});

//validate Employee entry
$('#frmEmployeeSemTraining').validate({
  focusInvalid: false,
  ignore: [],
  rules: {
    'temp_semtrain_eventname': {
      required: true
    },
    'temp_semtrain_topic': {
      required: true
    },
    'temp_semtrain_where': {
      required: true
    },
    'temp_semtrain_when': {
      required: true
    }
  },

  submitHandler: function (form) {
    // ajax call code here
    var $url = "/page/employee/details/semtrain/" + ['add', 'edit', 'delete'][$lastCmd - 1] + '/*';

    // var $result = (postData($url, $("#frmHumanResourcesEmployee").serialize()));
    // var $result = (postData($url, $("#frmEmployeeSemTraining").serialize()));

    $.ajax({
      url: $url,
      type: 'POST',
      data: $("#frmEmployeeSemTraining").serialize(),
      success: function (data) {

        $newData =JSON.parse(data);
        console.log($newData);

        Swal.fire({
          icon: $newData.icon,
          title: $newData.msgTitle,
          text: $newData.msgContent
        });

        if ($newData.status) {
          $tblEmployeeSemTraining.clear().rows.add($newData.Semtrain).draw();
          $modalEmployeeSemTraining.modal('hide');
        }
        return false;
      }
    });
    return false;
  }
});

//add new family member
$btnEmployeeSemTrainAdd.on('click', function (e) {
  clearSemTrainingForm();
  $lastCmd = 1;
  //setValues($dummy);
  $modalEmployeeSemTrainingTitle.html("New Seminar/Training");
  $btnEmployeeSemTrainingSave.show();
  $btnEmployeeSemTrainingSave.html("Save");
  $modalEmployeeSemTraining.modal('show');
});

//family member edit
$('#tblEmployeeSemTraining tbody').on('click', '.btnSemTrainEdit', function () {
  $lastCmd = 2;
  $data = $(this).data();
  console.log($data);

  $id = $data.id;

  //find it in db
  $url = "/page/employee/details/semtrain/display/" + $id;
  $.ajax($url, {
    type: 'POST',
    dataType: 'JSON'
  }).then(function ($data) {
    // reload family members

    setSemTrainDetails($data.Semtrain);
    $modalEmployeeSemTrainingTitle.html("View Seminar/Training");
    $btnEmployeeSemTrainingSave.show(); 
    $btnEmployeeSemTrainingSave.html('Save Changes'); 
    $modalEmployeeSemTraining.modal('show');

  });

  return false;
});

//Employee experience deleting
$('#tblEmployeeSemTraining tbody').on('click', '.btnSemTrainDelete', function () {
  $lastCmd = 3;
  $data = $(this).data();
  console.log($data);

  $id = $data.id;

  //find it in db
  $url = "/page/employee/details/semtrain/display/" + $id;
  $.ajax($url, {
    type: 'POST',
    dataType: 'JSON'
  }).then(function ($data) {
    // reload family members

    setSemTrainDetails($data.Semtrain);
    $modalEmployeeSemTrainingTitle.html("Delete Seminar/Training");
    $btnEmployeeSemTrainingSave.show(); 
    $btnEmployeeSemTrainingSave.html('Delete'); 
    $modalEmployeeSemTraining.modal('show');

  });

  return false;
});

//Employee experience view
$('#tblEmployeeSemTraining tbody').on('click', '.btnSemTrainView', function () {
  $lastCmd = 4;
  $data = $(this).data();
  console.log($data);

  $id = $data.id;

  //find it in db
  $url = "/page/employee/details/semtrain/display/" + $id;
  $.ajax($url, {
    type: 'POST',
    dataType: 'JSON'
  }).then(function ($data) {
    console.log($data);
    // reload family members 
    setSemTrainDetails($data.Semtrain);
    $modalEmployeeSemTrainingTitle.html("View Seminar/Training");
    $btnEmployeeSemTrainingSave.hide(); 
    $modalEmployeeSemTraining.modal('show');
  });


  return false;
});



function setSemTrainDetails($semTrainDetails) {
  $temp_semtrain_id.val($semTrainDetails.temp_semtrain_id);
  $temp_semtrain_eventname.val($semTrainDetails.temp_semtrain_eventname);
  $temp_semtrain_topic.val($semTrainDetails.temp_semtrain_topic);
  $temp_semtrain_where.val($semTrainDetails.temp_semtrain_where);
  $temp_semtrain_when.val($semTrainDetails.temp_semtrain_when);
}

function clearSemTrainingForm() {

  $temp_semtrain_id.val('');
  $temp_semtrain_eventname.val('');
  $temp_semtrain_topic.val('');
  $temp_semtrain_where.val('');
  $temp_semtrain_when.val('');

}