var $modalEarning = $("#modalEarning");
var $cmdOption = 0;
var $frmTitle = $("#frmTitle");
var $selectedID = 0;
var $tblEarning = $("#tblEarning").DataTable(
    {
        "oLanguage": {
            "sInfo": "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
        },
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/page/setup/payroll/earning/index/*",
            "type": "POST",
        },
        columns: [
            { data: "rpr_earning_id", title: "ID", "visible": true },
            { data: "rpr_earning_code", title: "Code", "visible": true },
            { data: "rpr_earning_desc", title: "Description", "visible": true },
            { data: "rpr_earning_default_amt", title: "Default Amount", "visible": true },
            { data: "rpr_earning_new_amt", title: "New Amount", "visible": true },
            { data: "rpr_earning_lessthan_threshold", title: "Earning Threshold<", "visible": true },
            { data: "rpr_earning_greaterthan_threshold", title: "Earning Threshold>", "visible": true },
            { data: "rpr_earning_is_mandatory", title: "Mandatory", "visible": true },
            { data: "rpr_earning_is_taxable", title: "Taxable", "visible": true },
            { data: "rpr_earning_is_active", title: "Active", "visible": true },
            { data: "rpr_earning_is_printable", title: "Printable", "visible": true },
            { data: "rpr_earning_frequency", title: "Frequency", "visible": true },
            { data: "rpr_earning_formula", title: "Formula", "visible": true },
            { data: "action", title: "Action" }
        ]
    }
);



//validate laon entry
$('#frmEarning').validate({
    focusInvalid: false,
    ignore: [],
    rules: {
        'rpr_earning_code': {
            required: true
        },
        'rpr_earning_desc': {

            required: true
        },
        'rpr_earning_default_amt': {

            required: true
        },
        'rpr_earning_new_amt': {

            required: true
        }
        ,
        'rpr_earning_lessthan_threshold': {

            required: true
        }
        ,
        'rpr_earning_greaterthan_threshold': {

            required: true
        }
        ,
        'rpr_earning_is_mandatory': {

            required: true
        }
        ,
        'rpr_earning_is_taxable': {

            required: true
        }
        ,
        'rpr_earning_is_active': {

            required: true
        }
        ,
        'rpr_earning_is_printable': {

            required: true
        }
        ,
        'rpr_earning_frequency': {

            required: true
        }
        ,
        'rpr_earning_formula': {

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
        $url = '/page/setup/payroll/earning/' + ['add', 'edit', 'delete'][$cmdOption - 1] + '/*'
        $.ajax({
            url: $url,
            type: 'POST',
            data: $("#frmEarning").serialize(),
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
                    $modalEarning.modal('hide');
                    $tblEarning.ajax.reload(null, false);
                } else {
                    return false;
                }

            }
        });
        return false;
    }
});
//add new earning
$("#btnEarningAdd").on('click', function (e) {

    clearForm();
    $cmdOption = 1;
    $("#modalTitle").html("New Earning");
    $("#btnEarning").html("Save");
    $modalEarning.modal('show');
});

//earning editing
$('#tblEarning tbody').on('click', '.btnEdit', function () {
    $cmdOption = 2;
    console.log($tblEarning);
    var $dataRow = $tblEarning.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblEarning.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Update Earning");
    $("#btnEarning").html("Update");
    $modalEarning.modal('show');

    return false;
});

//earning deleting
$('#tblEarning tbody').on('click', '.btnDelete', function () {
    $cmdOption = 3;
    console.log($tblEarning);
    var $dataRow = $tblEarning.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblEarning.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Delete Earning");
    $("#btnEarning").html("Delete");
    $modalEarning.modal('show');

    return false;
});

function setValues($earningDetails) {

    $("#rpr_earning_id").val($earningDetails.rpr_earning_id);
    $("#rpr_earning_code").val($earningDetails.rpr_earning_code);
    $("#rpr_earning_desc").val($earningDetails.rpr_earning_desc);
    $("#rpr_earning_default_amt").val($earningDetails.rpr_earning_default_amt);
    $("#rpr_earning_new_amt").val($earningDetails.rpr_earning_new_amt);
    $("#rpr_earning_lessthan_threshold").val($earningDetails.rpr_earning_lessthan_threshold);
    $("#rpr_earning_greaterthan_threshold").val($earningDetails.rpr_earning_greaterthan_threshold);
    $("#rpr_earning_is_mandatory").val($earningDetails.rpr_earning_is_mandatory);
    $("#rpr_earning_is_taxable").val($earningDetails.rpr_earning_is_taxable);
    $("#rpr_earning_is_active").val($earningDetails.rpr_earning_is_active);
    $("#rpr_earning_is_printable").val($earningDetails.rpr_earning_is_printable);
    $("#rpr_earning_frequency").val($earningDetails.rpr_earning_frequency);
    $("#rpr_earning_formula").val($earningDetails.rpr_earning_formula);
}
function clearForm() {
    $("#rpr_earning_id").val('');
    $("#rpr_earning_code").val('');
    $("#rpr_earning_desc").val('');
    $("#rpr_earning_default_amt").val('');
    $("#rpr_earning_new_amt").val('');
    $("#rpr_earning_lessthan_threshold").val('');
    $("#rpr_earning_greaterthan_threshold").val('');
    $("#rpr_earning_formula").val('');
};