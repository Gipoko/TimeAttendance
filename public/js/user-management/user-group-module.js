// $(function () {
var $tblUserGroup;
var $frmHumanResourcesEmployee = $("#frmHumanResourcesEmployee");

var $btnNewEmployee = $("#btnNewEmployee");
var $modalUserGroup = $("#modalUserGroup");
var $modalUserGroupTitle = $("#modalUserGroupTitle");
var $btnFormUpdate = $("#btnFormUpdate");
var $modalGroupModule = $("#modalGroupModule");
var $lastCmd = 0;

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


$tblUserGroup = $('#tblUserGroup').DataTable({
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
    "url": "/page/user/group/list",
    "type": "POST",
  },

  columns: [
    { data: "user_group_id", title: "Id" },
    { data: "user_group_name", title: "Group Name" },
    { data: "action", title: "Action" }
  ]
});

//add New Group Name
$("#btnNewGroup").on('click', function (e) {
  $lastCmd = 1;
  $("#user_group_name").val('');
  $modalUserGroupTitle.html("New Group Name");
  $("#modalUserGroup").modal('show');
});


//validate Employee entry
$('#frmUserGroup').validate({
  focusInvalid: false,
  ignore: [],
  rules: {
    'user_group_name': {
      required: true
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
    var $url = "/page/user/group/" + ['add', 'edit', 'delete'][$lastCmd - 1];

    // var $result = (postData($url, $("#frmHumanResourcesEmployee").serialize()));
    var $result = JSON.parse(postData($url, $("#frmUserGroup").serialize()));

    Swal.fire({
      title: $result.title,
      text: $result.msg,
      icon: $result.icon,
      confirmButtonColor: "#7a6fbe"
    });

    if ($result.status) {
      $tblUserGroup.ajax.reload(null, false);
      $modalUserGroup.modal('hide');
    }
    return false;
  }
});



//Employee editing
$('#tblUserGroup tbody').on('click', '.btnUserGroupEdit', function () {

  var $dataRow = $tblUserGroup.row(this).data();

  if ($dataRow === undefined) {
    var $dataRow = $tblUserGroup.row($(this).parents('tr')).data();
  }

  $lastCmd = 2;
  $("#user_group_id").val($dataRow.user_group_id);
  $("#user_group_name").val($dataRow.user_group_name);

  $modalUserGroupTitle.html("Update User Group");
  $btnFormUpdate.html("Save Changes");
  $modalUserGroup.modal('show');

  return false;
});

//Employee deleting
$('#tblUserGroup tbody').on('click', '.btnUserGroupDelete', function () {

  var $dataRow = $tblUserGroup.row(this).data();

  if ($dataRow === undefined) {
    var $dataRow = $tblUserGroup.row($(this).parents('tr')).data();
  }

  $lastCmd = 3;
  $("#user_group_id").val($dataRow.user_group_id);
  $("#user_group_name").val($dataRow.user_group_name);

  $modalUserGroupTitle.html("Delete User Group");
  $btnFormUpdate.html("Delete");
  $modalUserGroup.modal('show');
  return false;
});

//Employee deleting
$('#tblUserGroup tbody').on('click', '.btnUserGroupModules', function () {

  var $dataRow = $tblUserGroup.row(this).data();

  if ($dataRow === undefined) {
    var $dataRow = $tblUserGroup.row($(this).parents('tr')).data();
  }

  $lastCmd = 4;


  $btnFormUpdate.html("Delete");
  $modalGroupModule.modal('show');
  return false;
});


//group modules 
$tblUserGroupModules = $('#tblUserGroupModules').DataTable({
  "bInfo": true,
  "responsive": true,
  "processing": true,
  "autoWidth": true,
  "iDisplayLength": 10,
  "searching": true,
  "paging": true,
  "bLengthChange": true,


  columns: [
    { data: "menu_id", title: "Id" },
    { data: "tuser_accessgroup_id", title: "Group ID", "visible": false },
    { data: "menu_name", title: "Menu Option", "visible": true },
    { data: "menu_route", title: "Menu Option", "visible": false },
    // { data: "user_route_template_disable", title: "Active", "visible":true },
    // { data: "user_route_template_full_access", title: "Full Access", "visible":true },
    { data: "menu_create", title: "Add", "visible": true },
    { data: "menu_read", title: "Read", "visible": true },
    { data: "menu_update", title: "Update", "visible": true },
    { data: "menu_delete", title: "Delete", "visible": true },
    { data: "action", title: "Action" }
  ]
});

function loadGroupModules($groupId) {
  $url = "/page/user-management/account/list/*";
  $.ajax($url, {
    type: 'POST',
    dataType: 'JSON'
  }).then(function ($data) {

    alert('x')

  });
}
