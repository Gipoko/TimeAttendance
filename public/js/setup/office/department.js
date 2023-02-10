var $modalDepartment = $("#modalDepartment");
var $cmdOption = 0;
var $frmTitle = $("#frmTitle");
var $selectedID = 0;
var $tblDepartment = $("#tblDepartment").DataTable(
    {
        "oLanguage": {
            "sInfo": "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
        },
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/page/setup/office/department/index/*",
            "type": "POST",
        },
        columns: [
            { data: "rdepartment_id", title: "ID", "visible": true },
            { data: "rdepartment_code", title: "Code", "visible": true },
            { data: "rdepartment_name", title: "Name", "visible": true },

            { data: "action", title: "Action" }
        ]
    }
);



//validate laon entry
$('#frmDepartment').validate({
    focusInvalid: false,
    ignore: [],
    rules: {
        'rdepartment_code': {
            required: true
        },
        'rdepartment_name': {

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
        $url = '/page/setup/office/department/' + ['add', 'edit', 'delete'][$cmdOption - 1] + '/*'
        $.ajax({
            url: $url,
            type: 'POST',
            data: $("#frmDepartment").serialize(),
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
                    $modalDepartment.modal('hide');
                    $tblDepartment.ajax.reload(null, false);
                } else {
                    return false;
                }

            }
        });
        return false;
    }
});
//add new Department
$("#btnDepartmentAdd").on('click', function (e) {

    clearForm();
    $cmdOption = 1;
    $("#modalTitle").html("New Department");
    $("#btnDepartment").html("Save");
    $modalDepartment.modal('show');
});

//Department editing
$('#tblDepartment tbody').on('click', '.btnEdit', function () {
    $cmdOption = 2;
    console.log($tblDepartment);
    var $dataRow = $tblDepartment.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblDepartment.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Update Department");
    $("#btnDepartment").html("Update");
    $modalDepartment.modal('show');

    return false;
});

//Department deleting
$('#tblDepartment tbody').on('click', '.btnDelete', function () {
    $cmdOption = 3;
    console.log($tblDepartment);
    var $dataRow = $tblDepartment.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblDepartment.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Delete Department");
    $("#btnDepartment").html("Delete");
    $modalDepartment.modal('show');

    return false;
});

function setValues($DepartmentDetails) {

    $("#rdepartment_id").val($DepartmentDetails.rdepartment_id);
    $("#rdepartment_code").val($DepartmentDetails.rdepartment_code);
    $("#rdepartment_name").val($DepartmentDetails.rdepartment_name);

}
function clearForm() {
    $("#rdepartment_id").val('');
    $("#rdepartment_code").val('');
    $("#rdepartment_name").val('');



};