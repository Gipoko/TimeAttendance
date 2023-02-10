var $modalDivision = $("#modalDivision");
var $cmdOption = 0;
var $frmTitle = $("#frmTitle");
var $selectedID = 0;
var $tblDivision = $("#tblDivision").DataTable(
    {
        "oLanguage": {
            "sInfo": "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
        },
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/page/setup/office/division/index/*",
            "type": "POST",
        },
        columns: [
            { data: "rdivision_id", title: "ID", "visible": true },
            { data: "rdivision_code", title: "Code", "visible": true },
            { data: "rdivision_name", title: "Name", "visible": true },

            { data: "action", title: "Action" }
        ]
    }
);



//validate laon entry
$('#frmDivision').validate({
    focusInvalid: false,
    ignore: [],
    rules: {
        'rdivision_code': {
            required: true
        },
        'rdivision_name': {

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
        $url = '/page/setup/office/division/' + ['add', 'edit', 'delete'][$cmdOption - 1] + '/*'
        $.ajax({
            url: $url,
            type: 'POST',
            data: $("#frmDivision").serialize(),
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
                    $modalDivision.modal('hide');
                    $tblDivision.ajax.reload(null, false);
                } else {
                    return false;
                }

            }
        });
        return false;
    }
});
//add new Division
$("#btnDivisionAdd").on('click', function (e) {

    clearForm();
    $cmdOption = 1;
    $("#modalTitle").html("New Division");
    $("#btnDivision").html("Save");
    $modalDivision.modal('show');
});

//Division editing
$('#tblDivision tbody').on('click', '.btnEdit', function () {
    $cmdOption = 2;
    console.log($tblDivision);
    var $dataRow = $tblDivision.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblDivision.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Update Division");
    $("#btnDivision").html("Update");
    $modalDivision.modal('show');

    return false;
});

//Division deleting
$('#tblDivision tbody').on('click', '.btnDelete', function () {
    $cmdOption = 3;
    console.log($tblDivision);
    var $dataRow = $tblDivision.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblDivision.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Delete Division");
    $("#btnDivision").html("Delete");
    $modalDivision.modal('show');

    return false;
});

function setValues($DivisionDetails) {

    $("#rdivision_id").val($DivisionDetails.rdivision_id);
    $("#rdivision_code").val($DivisionDetails.rdivision_code);
    $("#rdivision_name").val($DivisionDetails.rdivision_name);

}
function clearForm() {
    $("#rdivision_id").val('');
    $("#rdivision_code").val('');
    $("#rdivision_name").val('');



};