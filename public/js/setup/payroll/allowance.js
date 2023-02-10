var $modalAllowance = $("#modalAllowance");
var $cmdOption = 0;
var $frmTitle = $("#frmTitle");
var $selectedID = 0;
var $tblAllowance = $("#tblAllowance").DataTable(
    {
        "oLanguage": {
            "sInfo": "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
        },
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/page/setup/payroll/allowance/index/*",
            "type": "POST",
        },
        columns: [
            { data: "rpr_allowance_id", title: "ID", "visible": true },
            { data: "rpr_allowance_code", title: "Code", "visible": true },
            { data: "rpr_allowance_desc", title: "Description", "visible": true },
            { data: "rpr_allowance_default_amt", title: "Default Amount", "visible": true },
            { data: "rpr_allowance_new_amt", title: "New Amount", "visible": true },
            { data: "rpr_allowance_lessthan_threshold", title: "Allowance Threshold<", "visible": true },
            { data: "rpr_allowance_greaterthan_threshold", title: "Allowance Threshold>", "visible": true },
            { data: "rpr_allowance_is_mandatory", title: "Mandatory", "visible": true },
            { data: "rpr_allowance_is_taxable", title: "Taxable", "visible": true },
            { data: "rpr_allowance_is_active", title: "Active", "visible": true },
            { data: "rpr_allowance_is_printable", title: "Printable", "visible": true },
            { data: "rpr_allowance_frequency", title: "Frequency", "visible": true },
            { data: "rpr_allowance_formula", title: "Formula", "visible": true },
            { data: "action", title: "Action" }
        ]
    }
);



//validate laon entry
$('#frmAllowance').validate({
    focusInvalid: false,
    ignore: [],
    rules: {
        'rpr_allowance_code': {
            required: true
        },
        'rpr_allowance_desc': {

            required: true
        },
        'rpr_allowance_default_amt': {

            required: true
        },
        'rpr_allowance_new_amt': {

            required: true
        }
        ,
        'rpr_allowance_lessthan_threshold': {

            required: true
        }
        ,
        'rpr_allowance_greaterthan_threshold': {

            required: true
        }
        ,
        'rpr_allowance_is_mandatory': {

            required: true
        }
        ,
        'rpr_allowance_is_taxable': {

            required: true
        }
        ,
        'rpr_allowance_is_active': {

            required: true
        }
        ,
        'rpr_allowance_is_printable': {

            required: true
        }
        ,
        'rpr_allowance_frequency': {

            required: true
        }
        ,
        'rpr_allowance_formula': {

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
        $url = '/page/setup/payroll/allowance/' + ['add', 'edit', 'delete'][$cmdOption - 1] + '/*'
        $.ajax({
            url: $url,
            type: 'POST',
            data: $("#frmAllowance").serialize(),
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
                    $modalAllowance.modal('hide');
                    $tblAllowance.ajax.reload(null, false);
                } else {
                    return false;
                }

            }
        });
        return false;
    }
});
//add new allowance
$("#btnAllowanceAdd").on('click', function (e) {

    clearForm();
    $cmdOption = 1;
    $("#modalTitle").html("New Allowance");
    $("#btnAllowance").html("Save");
    $modalAllowance.modal('show');
});

//allowance editing
$('#tblAllowance tbody').on('click', '.btnEdit', function () {
    $cmdOption = 2;
    console.log($tblAllowance);
    var $dataRow = $tblAllowance.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblAllowance.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Update Allowance");
    $("#btnAllowance").html("Update");
    $modalAllowance.modal('show');

    return false;
});

//allowance deleting
$('#tblAllowance tbody').on('click', '.btnDelete', function () {
    $cmdOption = 3;
    console.log($tblAllowance);
    var $dataRow = $tblAllowance.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblAllowance.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Delete Allowance");
    $("#btnAllowance").html("Delete");
    $modalAllowance.modal('show');

    return false;
});

function setValues($allowanceDetails) {

    $("#rpr_allowance_id").val($allowanceDetails.rpr_allowance_id);
    $("#rpr_allowance_code").val($allowanceDetails.rpr_allowance_code);
    $("#rpr_allowance_desc").val($allowanceDetails.rpr_allowance_desc);
    $("#rpr_allowance_default_amt").val($allowanceDetails.rpr_allowance_default_amt);
    $("#rpr_allowance_new_amt").val($allowanceDetails.rpr_allowance_new_amt);
    $("#rpr_allowance_lessthan_threshold").val($allowanceDetails.rpr_allowance_lessthan_threshold);
    $("#rpr_allowance_greaterthan_threshold").val($allowanceDetails.rpr_allowance_greaterthan_threshold);
    $("#rpr_allowance_is_mandatory").val($allowanceDetails.rpr_allowance_is_mandatory);
    $("#rpr_allowance_is_taxable").val($allowanceDetails.rpr_allowance_is_taxable);
    $("#rpr_allowance_is_active").val($allowanceDetails.rpr_allowance_is_active);
    $("#rpr_allowance_is_printable").val($allowanceDetails.rpr_allowance_is_printable);
    $("#rpr_allowance_frequency").val($allowanceDetails.rpr_allowance_frequency);
    $("#rpr_allowance_formula").val($allowanceDetails.rpr_allowance_formula);
}
function clearForm() {
    $("#rpr_allowance_id").val('');
    $("#rpr_allowance_code").val('');
    $("#rpr_allowance_desc").val('');
    $("#rpr_allowance_default_amt").val('');
    $("#rpr_allowance_new_amt").val('');
    $("#rpr_allowance_lessthan_threshold").val('');
    $("#rpr_allowance_greaterthan_threshold").val('');
    $("#rpr_allowance_formula").val('');
};