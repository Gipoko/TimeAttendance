// $(function () {

var $tblUserGroup;
var $frmHumanResourcesEmployee = $("#frmHumanResourcesEmployee");

var $btnNewEmployee = $("#btnNewEmployee");
var $modalUserGroup = $("#modalUserGroup");
var $modalUserGroupTitle = $("#modalUserGroupTitle");
var $btnFormUpdate = $("#btnFormUpdate");
var $modalGroupModule = $("#modalGroupModule");
var $lastCmd = 0;
var $tblUserGroupModules = $("#tblUserGroupModules");
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
  "iDisplayLength": 200,
  "searching": true,
  "paging": true,
  "bLengthChange": true,
  "ajax": {
    "url": "/page/user-management/group/index/*",
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
    var $url = '/page/user-management/group/' + ['add', 'edit', 'delete'][$lastCmd - 1] + '/*';
    $.ajax({
      url: $url,
      type: 'POST',
      data: $("#frmUserGroup").serialize(),
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
          $tblUserGroup.ajax.reload(null, false);
          $modalUserGroup.modal('hide');
        } else {
          return false;
        }

      }
    });
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
  loadGroupModules($dataRow.user_group_id);

  $btnFormUpdate.html("Delete");
  $modalGroupModule.modal('show');
  return false;
});


//group modules 
$tblUserGroupModules = $('#tblUserGroupModules').DataTable({
  "bInfo": true,
  "responsive": true,
  // "processing": true, 
  "autoWidth": true,
  "iDisplayLength": 100,
  "searching": true,
  "paging": true,
  // "bLengthChange": true,
  columns: [
    { data: "menu_id", title: "Id" },
    { data: "tuser_accessgroup_id", title: "Group ID", "visible": false },
    { data: "menu_name", title: "Menu Option", "visible": true },
    { data: "menu_route", title: "Menu Option", "visible": false },
    {
      data: "menu_create",
      render: function (data, type, row) {
        var d = (data == "Y");
        if (d == true) {
          return '<input name="menu_create" type="checkbox" checked>';
        } else {
          return '<input name="menu_create" type="checkbox">';
        }
        return data;
      }
    },
    {
      data: "menu_read",
      render: function (data, type, row) {
        var d = (data == "Y");
        if (d == true) {
          return '<input name="menu_read" type="checkbox" checked>';
        } else {
          return '<input name="menu_read" type="checkbox">';
        }
        return data;
      }
    },
    {
      data: "menu_update",
      render: function (data, type, row) {
        var d = (data == "Y");
        if (d == true) {
          return '<input name="menu_update" type="checkbox" checked>';
        } else {
          return '<input name="menu_update" type="checkbox">';
        }
        return data;
      }
    },
    {
      data: "menu_delete",
      render: function (data, type, row) {
        var d = data;
        if (d == "Y") {
          return '<input name="menu_delete" type="checkbox" checked>';
        } else {
          return '<input name="menu_delete" type="checkbox">';
        }
        return data;
      }
    }
  ]
});

$tblUserGroupModules.on('click', 'input[type="checkbox"]', function () {
  //console.log($(this)[0].name);
  //console.log($(this)[0].checked);
  var $dataRow = $tblUserGroupModules.row(this).data();
  //console.log($dataRow);
  if ($dataRow === undefined) {
    var $dataRow = $tblUserGroupModules.row($(this).parents('tr')).data();
  }
  //console.log($dataRow);
  $key = $(this)[0].name;
  $obj = {
    menu_id: $dataRow.menu_id,
    key: $key,
    value: $(this)[0].checked
  }
  console.log($obj);

  $url = "/page/user-management/group/updatekey/*";
  $.ajax($url, {
    type: 'POST',
    dataType: 'JSON',
    data: $obj
  }).then(function ($data) {
    //$tblUserGroupModules.clear().rows.add($data.usergroupmodules).draw();
  });
});

function loadGroupModules($groupId) {
  $url = "/page/user-management/group/groupModules/*";
  $.ajax($url, {
    type: 'POST',
    dataType: 'JSON',
    data: { user_group_id: $groupId }
  }).then(function ($data) {

    $tblUserGroupModules.clear().rows.add($data.usergroupmodules).draw();

  });
}
