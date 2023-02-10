var $modalPayrollPeriod = $("#modalPayrollPeriod");
var $cmdOption = 0;
var $frmTitle = $("#frmTitle");
var $selectedID = 0;
var $tblPayrollPeriod = $("#tblPayrollPeriod").DataTable(
    {
        "oLanguage": {
            "sInfo": "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
        },
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/page/setup/payroll/payrollperiod/index/*",
            "type": "POST",
        },
        columns: [
            { data: "rpayroll_period_id", title: "ID", "visible": true },
            { data: "rpayroll_period", title: "Period", "visible": true },
            { data: "rpayroll_identification", title: "ID", "visible": true },
            { data: "rpayroll_start_date", title: "Start Date", "visible": true },
            { data: "rpayroll_end_date", title: "End Date", "visible": true },
            { data: "rpayroll_start_date", title: "Start Date", "visible": true },
            { data: "rpayroll_status", title: "Status", "visible": true },
            { data: "action", title: "Action" }
        ]
    }
);



//validate laon entry
$('#frmPayrollPeriod').validate({
    focusInvalid: false,
    ignore: [],
    rules: {
        'rpayroll_period': {
            required: true
        },
        'rpayroll_identification': {

            required: true
        },
        'rpayroll_start_date': {

            required: true
        },
        'rpayroll_end_date': {

            required: true
        },
        'rpayroll_status': {

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
        $url = '/page/setup/payroll/payrollperiod/' + ['add', 'edit', 'delete'][$cmdOption - 1] + '/*'
        $.ajax({
            url: $url,
            type: 'POST',
            data: $("#frmPayrollPeriod").serialize(),
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
                    $modalPayrollPeriod.modal('hide');
                    $tblPayrollPeriod.ajax.reload(null, false);
                } else {
                    return false;
                }

            }
        });
        return false;
    }
});


$("#rpayroll_period").datepicker({ format: 'yyyy-mm-dd' });
$("#rpayroll_period").on('change', function () {
    $("#rpayroll_start_date").val($(this).val());
});
$("#rpayroll_identification").on('change', function () {
    var date = new Date($("#rpayroll_period").val());
    var day = date.getDate();
    var days = date.getDate() + 14;
    var dayss = date.getDate() + 30;
    var month = date.getMonth() + 1;
    var months = date.getMonth() + 2;
    var week = date.getDay();
    var year = date.getFullYear();

    switch ($("#rpayroll_identification").val()) {
        case 'Whole_Period':
            $("#rpayroll_start_date").val();
            $("#rpayroll_end_date").val(year + "-" + month + "-" + dayss);
            break;
        case 'First_Period':
            $("#rpayroll_start_date").val();
            $("#rpayroll_end_date").val(year + "-" + month + "-" + days);
            break;
        case 'Second_Period':
            $("#rpayroll_start_date").val(year + "-" + month + "-" + days);
            $("#rpayroll_end_date").val(year + "-" + month + "-" + dayss);
            break;
    }
});

//add new PayrollPeriod
$("#btnPayrollPeriodAdd").on('click', function (e) {

    clearForm();
    $cmdOption = 1;
    $("#modalTitle").html("New Payroll Period");
    $("#btnPayrollPeriod").html("Save");
    $modalPayrollPeriod.modal('show');


});

//PayrollPeriod editing
$('#tblPayrollPeriod tbody').on('click', '.btnEdit', function () {
    $cmdOption = 2;
    console.log($tblPayrollPeriod);
    var $dataRow = $tblPayrollPeriod.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblPayrollPeriod.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Update Payroll Period");
    $("#btnPayrollPeriod").html("Update");
    $modalPayrollPeriod.modal('show');

    return false;
});

//PayrollPeriod deleting
$('#tblPayrollPeriod tbody').on('click', '.btnDelete', function () {
    $cmdOption = 3;
    console.log($tblPayrollPeriod);
    var $dataRow = $tblPayrollPeriod.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblPayrollPeriod.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Delete Payroll Period");
    $("#btnPayrollPeriod").html("Delete");
    $modalPayrollPeriod.modal('show');

    return false;
});

function setValues($PayrollPeriodDetails) {

    $("#rpayroll_period_id").val($PayrollPeriodDetails.rpayroll_period_id);
    $("#rpayroll_period").val($PayrollPeriodDetails.rpayroll_period);
    $("#rpayroll_identification").val($PayrollPeriodDetails.rpayroll_identification);
    $("#rpayroll_start_date").val($PayrollPeriodDetails.rpayroll_start_date);
    $("#rpayroll_end_date").val($PayrollPeriodDetails.rpayroll_start_date);
    $("#rpayroll_status").val($PayrollPeriodDetails.rpayroll_status);

}
function clearForm() {
    $("#rpayroll_period").val('');
    $("#rpayroll_identification").val('');
    $("#rpayroll_start_date").val('');
    $("#rpayroll_end_date").val('');



};