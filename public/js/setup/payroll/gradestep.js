var $modalGradestep = $("#modalGradestep");
var $cmdOption = 0;
var $frmTitle = $("#frmTitle");
var $selectedID = 0;
var $tblGradestep = $("#tblGradestep").DataTable(
    {
        "oLanguage": {
            "sInfo": "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
        },
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/page/setup/payroll/gradestep/index/*",
            "type": "POST",
        },
        columns: [
            { data: "rgradestep_id", title: "ID" },
            { data: "rgradestep_gradeno", title: "Grade" },
            { data: "rgradestep_stepno", title: "Step" },
            { data: "rgradestep_salary", title: "Salary" },
            { data: "rgradestep_effectivity", title: "Effectivity" },
            { data: "rgradestep_is_active", title: "Active" },
            { data: "action", title: "Action" }
        ]
    }
);



//validate laon entry
$('#frmGradestep').validate({
    focusInvalid: false,
    ignore: [],
    rules: {
        'rgradestep_gradeno': {
            required: true
        },
        'rgradestep_stepno': {
            required: true
        },
        'rgradestep_salary': {

            required: true
        },
        'rgradestep_effectivity': {

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
        $url = '/page/setup/payroll/gradestep/' + ['add', 'edit', 'delete'][$cmdOption - 1] + '/*'
        $.ajax({
            url: $url,
            type: 'POST',
            data: $("#frmGradestep").serialize(),
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
                    $modalGradestep.modal('hide');
                    $tblGradestep.ajax.reload(null, false);
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
//add new Gradestep
$("#btnGradestepAdd").on('click', function (e) {

    clearForm();
    $cmdOption = 1;
    $("#modalTitle").html("New Gradestep");
    $("#btnGradestep").html("Save");
    $modalGradestep.modal('show');
});

//Gradestep editing
$('#tblGradestep tbody').on('click', '.btnEdit', function () {
    $cmdOption = 2;
    console.log($tblGradestep);
    var $dataRow = $tblGradestep.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblGradestep.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Update Gradestep");
    $("#btnGradestep").html("Update");
    $modalGradestep.modal('show');

    return false;
});

//Gradestep deleting
$('#tblGradestep tbody').on('click', '.btnDelete', function () {
    $cmdOption = 3;
    console.log($tblGradestep);
    var $dataRow = $tblGradestep.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblGradestep.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Delete Gradestep");
    $("#btnGradestep").html("Delete");
    $modalGradestep.modal('show');

    return false;
});

function setValues($salarygradeDetails) {



    $("#rgradestep_id").val($salarygradeDetails.rgradestep_id);
    $("#rgradestep_gradeno").val($salarygradeDetails.rgradestep_gradeno);
    $("#rgradestep_stepno").val($salarygradeDetails.rgradestep_stepno);
    $("#rgradestep_salary").val($salarygradeDetails.rgradestep_salary);
    $("#rgradestep_effectivity").val($salarygradeDetails.rgradestep_effectivity);
    $("#rgradestep_is_active").val($salarygradeDetails.rgradestep_is_active);

}
function clearForm() {
    $("#rgradestep_id").val('');
    $("#rgradestep_gradeno").val('');
    $("#rgradestep_stepno").val('');
    $("#rgradestep_salary").val('');
    $("#rgradestep_effectivity").val('');
};