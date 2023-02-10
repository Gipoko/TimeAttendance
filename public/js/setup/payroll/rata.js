var $modalRata = $("#modalRata");
var $cmdOption = 0;
var $frmTitle = $("#frmTitle");
var $selectedID = 0;
var $tblRata = $("#tblRata").DataTable(
    {
        "oLanguage": {
            "sInfo": "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
        },
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/page/setup/payroll/rata/index/*",
            "type": "POST",
        },
        columns: [
            { data: "rrata_id", title: "ID", "visible": true },
            { data: "rposition_desc", title: "Position", "visible": true },
            { data: "rrata_repallowance", title: "Rep. Allowance", "visible": true },
            { data: "rrata_transpoallowance", title: "Transpo. Allowance", "visible": true },
            { data: "rrata_status", title: "Status", "visible": true },
            { data: "action", title: "Action" }
        ]
    }
);



//validate laon entry
$('#frmRata').validate({
    focusInvalid: false,
    ignore: [],
    rules: {
        'rposition_desc': {
            required: true
        },
        'rrata_repallowance': {
            required: true
        },
        'rrata_transallowance': {

            required: true
        }, 'rrata_status': {

            required: true
        }
        , 'rrata_modifiedby': {

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
        $url = '/page/setup/payroll/rata/' + ['add', 'edit', 'delete'][$cmdOption - 1] + '/*'
        $.ajax({
            url: $url,
            type: 'POST',
            data: $("#frmRata").serialize(),
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
                    $modalRata.modal('hide');
                    $tblRata.ajax.reload(null, false);
                } else {
                    return false;
                }

            }
        });
        return false;
    }
});
//add new Rata
$("#btnRataAdd").on('click', function (e) {

    clearForm();
    $cmdOption = 1;
    $("#modalTitle").html("New Rata");
    $("#btnRata").html("Save");
    $modalRata.modal('show');
});

//Rata editing
$('#tblRata tbody').on('click', '.btnEdit', function () {
    $cmdOption = 2;
    console.log($tblRata);
    var $dataRow = $tblRata.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblRata.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Update Rata");
    $("#btnRata").html("Update");
    $modalRata.modal('show');

    return false;
});

//Rata deleting
$('#tblRata tbody').on('click', '.btnDelete', function () {
    $cmdOption = 3;
    console.log($tblRata);
    var $dataRow = $tblRata.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblRata.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Delete Rata");
    $("#btnRata").html("Delete");
    $modalRata.modal('show');

    return false;
});

function setValues($RataDetails) {

    $("#rrata_id").val($RataDetails.rrata_id);
    $("#rposition_desc").val($RataDetails.rposition_desc);
    $("#rrata_repallowance").val($RataDetails.rrata_repallowance);
    $("#rrata_transpoallowance").val($RataDetails.rrata_transpoallowance);
    $("#rrata_status").val($RataDetails.rrata_status);
}
function clearForm() {
    $("#rrata_id").val('');
    $("#rposition_desc").val('');
    $("#rrata_repallowance").val('');
    $("#rrata_transpoallowance").val('');
};