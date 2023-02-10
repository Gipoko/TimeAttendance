var $modalSignatory = $("#modalSignatory");
var $cmdOption = 0;
var $frmTitle = $("#frmTitle");
var $selectedID = 0;
var $tblSignatory = $("#tblSignatory").DataTable(
    {
        "oLanguage": {
            "sInfo": "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
        },
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/page/setup/payroll/signatory/index/*",
            "type": "POST",
        },
        columns: [
            { data: "rsignatory_id", title: "ID" },
            { data: "rsignatory", title: "Signatory" },
            { data: "rsignatory_employee_id", title: "Employee ID" },
            { data: "action", title: "Action" }
        ]
    }
);



//validate laon entry
$('#frmSignatory').validate({
    focusInvalid: false,
    ignore: [],
    rules: {
        'rsignatory': {
            required: true
        },
        'rsignatory_employee_id': {

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
        $url = '/page/setup/payroll/signatory/' + ['add', 'edit', 'delete'][$cmdOption - 1] + '/*'
        $.ajax({
            url: $url,
            type: 'POST',
            data: $("#frmSignatory").serialize(),
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
                    $modalSignatory.modal('hide');
                    $tblSignatory.ajax.reload(null, false);
                } else {
                    return false;
                }

            }
        });
        return false;
    }
});
//add new Signatory
$("#btnSignatoryAdd").on('click', function (e) {

    clearForm();
    $cmdOption = 1;
    $("#modalTitle").html("New Signatory");
    $("#btnSignatory").html("Save");
    $modalSignatory.modal('show');
});

//Signatory editing
$('#tblSignatory tbody').on('click', '.btnEdit', function () {
    $cmdOption = 2;
    console.log($tblSignatory);
    var $dataRow = $tblSignatory.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblSignatory.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Update Signatory");
    $("#btnSignatory").html("Update");
    $modalSignatory.modal('show');

    return false;
});

//Signatory deleting
$('#tblSignatory tbody').on('click', '.btnDelete', function () {
    $cmdOption = 3;
    console.log($tblSignatory);
    var $dataRow = $tblSignatory.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblSignatory.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Delete Signatory");
    $("#btnSignatory").html("Delete");
    $modalSignatory.modal('show');

    return false;
});

function setValues($signatoryDetails) {

    $("#rsignatory_id").val($signatoryDetails.rsignatory_id);
    $("#rsignatory").val($signatoryDetails.rsignatory);
    $("#rsignatory_employee_id").val($signatoryDetails.rsignatory_employee_id);
    $("#rsignatory_modifiedby").val($signatoryDetails.rsignatory_modifiedby);

}
function clearForm() {
    $("#rsignatory_id").val('');
    $("#rsignatory").val('');
    $("#rsignatory_employee_id").val('');
    $("#rsignatory_modifiedby").val('');



};