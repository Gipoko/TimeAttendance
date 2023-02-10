var $modalLoan = $("#modalLoan");

var $cmdOption = 0;
var $frmTitle = $("#frmTitle");
var $selectedID = 0;
var $tblLoan = $("#tblLoan").DataTable(
    {
        "oLanguage": {
            "sInfo": "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
        },
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/page/setup/payroll/loan/index/*",
            "type": "POST",
        },
        columns: [
            { data: "rloan_id", title: "ID", "visible": true },
            { data: "rloan_code", title: "Code", "visible": true },
            { data: "rloan_desc", title: "Description", "visible": true },
            { data: "rloan_type", title: "Loan Type", "visible": true },
            { data: "action", title: "Action" }
        ]
    }
);



//validate laon entry
$('#frmLoan').validate({
    focusInvalid: false,
    ignore: [],
    rules: {
        'rloansub_code': {
            required: true
        },
        'rloansub_desc': {

            required: true
        },

        'rloansub_status': {

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
        $url = '/page/setup/payroll/loan/' + ['add', 'edit', 'delete'][$cmdOption - 1] + '/*'
        $.ajax({
            url: $url,
            type: 'POST',
            data: $("#frmLoan").serialize(),
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
                    $modalLoan.modal('hide');
                    $tblLoan.ajax.reload(null, false);
                } else {
                    return false;
                }

            }
        });
        return false;
    }
});




//add new Loan
$("#btnLoanAdd").on('click', function (e) {

    clearForm();
    $cmdOption = 1;
    $("#modalTitle").html("New Loan");
    $("#btnLoan").html("Save");
    $modalLoan.modal('show');
});

//Loan editing
$('#tblLoan tbody').on('click', '.btnEdit', function () {
    $cmdOption = 2;
    console.log($tblLoan);
    var $dataRow = $tblLoan.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblLoan.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Update Loan");
    $("#btnLoan").html("Update");
    $modalLoan.modal('show');

    return false;
});

//Loan deleting
$('#tblLoan tbody').on('click', '.btnDelete', function () {
    $cmdOption = 3;
    console.log($tblLoan);
    var $dataRow = $tblLoan.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblLoan.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Delete Loan");
    $("#btnLoan").html("Delete");
    $modalLoan.modal('show');

    return false;
});

function setValues($LoanDetails) {

    $("#rloan_id").val($LoanDetails.rloan_id);
    $("#rloan_code").val($LoanDetails.rloan_code);
    $("#rloan_desc").val($LoanDetails.rloan_desc);
    $("#rloan_type").val($LoanDetails.rloan_type);
}
function clearForm() {
    $("#rloan_id").val('');
    $("#rloan_code").val('');
    $("#rloan_desc").val('');
    $("#rloan_type").val('');


};