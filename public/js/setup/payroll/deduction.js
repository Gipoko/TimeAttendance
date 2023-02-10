var $modalDeduction = $("#modalDeduction");
var $cmdOption = 0;
var $frmTitle = $("#frmTitle");
var $selectedID = 0;
var $tblDeduction = $("#tblDeduction").DataTable(
    {
        "oLanguage": {
            "sInfo": "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
        },
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/page/setup/payroll/deduction/index/*",
            "type": "POST",
        },
        columns: [
            { data: "rpr_deduction_id", title: "ID", "visible": true },
            { data: "rpr_deduction_code", title: "Code", "visible": true },
            { data: "rpr_deduction_desc", title: "Description", "visible": true },
            { data: "rpr_deduction_default_amt", title: "Default Amount", "visible": true },
            { data: "rpr_deduction_new_amt", title: "New Amount", "visible": true },
            { data: "rpr_deduction_lessthan_threshold", title: "Deduction Threshold<", "visible": true },
            { data: "rpr_deduction_greaterthan_threshold", title: "Deduction Threshold>", "visible": true },
            { data: "rpr_deduction_is_mandatory", title: "Mandatory", "visible": true },
            { data: "rpr_deduction_is_taxable", title: "Taxable", "visible": true },
            { data: "rpr_deduction_is_active", title: "Active", "visible": true },
            { data: "rpr_deduction_is_printable", title: "Printable", "visible": true },
            { data: "rpr_deduction_frequency", title: "Frequency", "visible": true },
            { data: "rpr_deduction_formula", title: "Formula", "visible": true },
            { data: "action", title: "Action" }
        ]
    }
);



//validate laon entry
$('#frmDeduction').validate({
    focusInvalid: false,
    ignore: [],
    rules: {
        'rpr_deduction_code': {
            required: true
        },
        'rpr_deduction_desc': {

            required: true
        },
        'rpr_deduction_default_amt': {

            required: true
        },
        'rpr_deduction_new_amt': {

            required: true
        }
        ,
        'rpr_deduction_lessthan_threshold': {

            required: true
        }
        ,
        'rpr_deduction_greaterthan_threshold': {

            required: true
        }
        ,
        'rpr_deduction_is_mandatory': {

            required: true
        }
        ,
        'rpr_deduction_is_taxable': {

            required: true
        }
        ,
        'rpr_deduction_is_active': {

            required: true
        }
        ,
        'rpr_deduction_is_printable': {

            required: true
        }
        ,
        'rpr_deduction_frequency': {

            required: true
        }
        ,
        'rpr_deduction_formula': {

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
        $url = '/page/setup/payroll/deduction/' + ['add', 'edit', 'delete'][$cmdOption - 1] + '/*'
        $.ajax({
            url: $url,
            type: 'POST',
            data: $("#frmDeduction").serialize(),
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
                    $modalDeduction.modal('hide');
                    $tblDeduction.ajax.reload(null, false);
                } else {
                    return false;
                }

            }
        });
        return false;
    }
});
//add new deduction
$("#btnDeductionAdd").on('click', function (e) {

    clearForm();
    $cmdOption = 1;
    $("#modalTitle").html("New Deduction");
    $("#btnDeduction").html("Save");
    $modalDeduction.modal('show');
});

//deduction editing
$('#tblDeduction tbody').on('click', '.btnEdit', function () {
    $cmdOption = 2;
    console.log($tblDeduction);
    var $dataRow = $tblDeduction.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblDeduction.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Update Deduction");
    $("#btnDeduction").html("Update");
    $modalDeduction.modal('show');

    return false;
});

//deduction deleting
$('#tblDeduction tbody').on('click', '.btnDelete', function () {
    $cmdOption = 3;
    console.log($tblDeduction);
    var $dataRow = $tblDeduction.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblDeduction.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Delete Deduction");
    $("#btnDeduction").html("Delete");
    $modalDeduction.modal('show');

    return false;
});

function setValues($deductionDetails) {

    $("#rpr_deduction_id").val($deductionDetails.rpr_deduction_id);
    $("#rpr_deduction_code").val($deductionDetails.rpr_deduction_code);
    $("#rpr_deduction_desc").val($deductionDetails.rpr_deduction_desc);
    $("#rpr_deduction_default_amt").val($deductionDetails.rpr_deduction_default_amt);
    $("#rpr_deduction_new_amt").val($deductionDetails.rpr_deduction_new_amt);
    $("#rpr_deduction_lessthan_threshold").val($deductionDetails.rpr_deduction_lessthan_threshold);
    $("#rpr_deduction_greaterthan_threshold").val($deductionDetails.rpr_deduction_greaterthan_threshold);
    $("#rpr_deduction_is_mandatory").val($deductionDetails.rpr_deduction_is_mandatory);
    $("#rpr_deduction_is_taxable").val($deductionDetails.rpr_deduction_is_taxable);
    $("#rpr_deduction_is_active").val($deductionDetails.rpr_deduction_is_active);
    $("#rpr_deduction_is_printable").val($deductionDetails.rpr_deduction_is_printable);
    $("#rpr_deduction_frequency").val($deductionDetails.rpr_deduction_frequency);
    $("#rpr_deduction_formula").val($deductionDetails.rpr_deduction_formula);
}
function clearForm() {
    $("#rpr_deduction_id").val('');
    $("#rpr_deduction_code").val('');
    $("#rpr_deduction_desc").val('');
    $("#rpr_deduction_default_amt").val('');
    $("#rpr_deduction_new_amt").val('');
    $("#rpr_deduction_lessthan_threshold").val('');
    $("#rpr_deduction_greaterthan_threshold").val('');
    $("#rpr_deduction_formula").val('');
};