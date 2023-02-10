var $modalPosition = $("#modalPosition");
var $cmdOption = 0;
var $frmTitle = $("#frmTitle");
var $selectedID = 0;
var $tblPosition = $("#tblPosition").DataTable(
    {
        "oLanguage": {
            "sInfo": "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
        },
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/page/setup/payroll/position/index/*",
            "type": "POST",
        },
        columns: [
            { data: "rposition_id", title: "ID", "visible": true },
            { data: "rposition_code", title: "Code", "visible": true },
            { data: "rposition_desc", title: "Description", "visible": true },
            { data: "rposition_name", title: "Name", "visible": true },
            { data: "rgradestep_gradeno", title: "Grade no.", "visible": true },
            { data: "rgradestep_stepno", title: "Step no.", "visible": true },
            { data: "rposition_is_active", title: "Status", "visible": true },
            { data: "action", title: "Action" }
        ]
    }
);



//validate laon entry
$('#frmPosition').validate({
    focusInvalid: false,
    ignore: [],
    rules: {
        'rposition_code': {
            required: true
        },
        'rposition_desc': {

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
        $url = '/page/setup/payroll/position/' + ['add', 'edit', 'delete'][$cmdOption - 1] + '/*'
        $.ajax({
            url: $url,
            type: 'POST',
            data: $("#frmPosition").serialize(),
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
                    $modalPosition.modal('hide');
                    $tblPosition.ajax.reload(null, false);
                } else {
                    return false;
                }

            }
        });
        return false;
    }
});

$(function () {
    var options = "";
    var grade = 33;
    for (var i = 1; i <= grade; i++) {
        options += "<option value='" + i + "'>" + i + "</option>";
    }
    $("#rgradestep_gradeno").html(options);
});

$(function () {
    var options = "";
    var step = 8;
    for (var i = 1; i <= step; i++) {
        options += "<option value='" + i + "'>" + i + "</option>";
    }
    $("#rgradestep_stepno").html(options);
});

//add new Position
$("#btnPositionAdd").on('click', function (e) {

    clearForm();
    $cmdOption = 1;
    $("#modalTitle").html("New Position");
    $("#btnPosition").html("Save");
    $modalPosition.modal('show');
});

//Position editing
$('#tblPosition tbody').on('click', '.btnEdit', function () {
    $cmdOption = 2;
    console.log($tblPosition);
    var $dataRow = $tblPosition.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblPosition.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Update Position");
    $("#btnPosition").html("Update");
    $modalPosition.modal('show');

    return false;
});

//Position deleting
$('#tblPosition tbody').on('click', '.btnDelete', function () {
    $cmdOption = 3;
    console.log($tblPosition);
    var $dataRow = $tblPosition.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblPosition.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Delete Position");
    $("#btnPosition").html("Delete");
    $modalPosition.modal('show');

    return false;
});

function setValues($PositionDetails) {

    $("#rposition_id").val($PositionDetails.rposition_id);
    $("#rposition_code").val($PositionDetails.rposition_code);
    $("#rposition_desc").val($PositionDetails.rposition_desc);
    $("#rposition_name").val($PositionDetails.rposition_name);
    $("#rgradestep_gradeno").val($PositionDetails.rgradestep_gradeno);
    $("#rgradestep_stepno").val($PositionDetails.rgradestep_stepno);
}
function clearForm() {
    $("#rposition_id").val('');
    $("#rposition_code").val('');
    $("#rposition_desc").val('');
    $("#rposition_name").val('');
    $("#rgradestep_gradeno").val('');
    $("#rgradestep_stepno").val('');
};