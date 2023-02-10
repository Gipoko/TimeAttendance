var $modalWithholdingtax = $("#modalWithholdingtax");
var $cmdOption = 0;
var $frmTitle = $("#frmTitle");
var $selectedID = 0;
var $tblWithholdingtax = $("#tblWithholdingtax").DataTable(
    {
        "oLanguage": {
            "sInfo": "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
        },
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/page/setup/payroll/withholdingtax/index/*",
            "type": "POST",
        },
        columns: [
            { data: "rwithtax_id", title: "ID" },
            {data: "rwithtax_paybasis",tittle: "Pay Basis"},
            { data: "rwithtax_compensation_level_from", title: "From" },
            { data: "rwithtax_compensation_level_to", title: "To" },
            { data: "rwithtax_percentage", title: "Tax Percentage(%)" },
            { data: "rwithtax_additional", title: "Tax Additional(₱)" },
            { data: "rwithtax_effective_from", title: "From" },
            { data: "rwithtax_effective_to", title: "To" },
            { data: "rwithtax_status", title: "Status" },
            { data: "action", title: "Action" }
        ]
    }
);



//validate laon entry
$('#frmWithholdingtax').validate({
    focusInvalid: false,
    ignore: [],
    rules: {
        'rwithtax_compensation_level_from': {
            required: true
        },
        'rwithtax_compensation_level_to': {

            required: true
        },
        'rwithtax_percentage': {

            required: true
        },
        'rwithtax_additional': {

            required: true
        },
        'rwithtax_status': {

            required: true
        },

        'rwithtax_paybasis': {

            required: true
        },
        'rwithtax_effective_from': {

            required: true
        },
        'rwithtax_effective_to': {

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
        $url = '/page/setup/payroll/withholdingtax/' + ['add', 'edit', 'delete'][$cmdOption - 1] + '/*'
        $.ajax({
            url: $url,
            type: 'POST',
            data: $("#frmWithholdingtax").serialize(),
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
                    $modalWithholdingtax.modal('hide');
                    $tblWithholdingtax.ajax.reload(null, false);
                } else {
                    return false;
                }

            }
        });
        return false;
    }
});

var date = new Date();
var year = date.getFullYear();
initDates();
initDates("#rwithtax_effective_from", { autoclose: true, disableTouchKeyboard: false, format: 'dd-mm-yyyy' });
initDates("#rwithtax_effective_to", { autoclose: true, disableTouchKeyboard: false, format: 'dd-mm-yyyy' });
//initialize dates
function initDates($domField, $objProperty) {
    $($domField).datepicker($objProperty).on('change', function () {
      $(this).valid(); // triggers a validation of philsys_doi
    });
  }

//add new Withholdingtax
$("#btnWithholdingtaxAdd").on('click', function (e) {

    clearForm();
    $cmdOption = 1;
    $("#modalTitle").html("New Withholdingtax");
    $("#btnWithholdingtax").html("Save");
    $modalWithholdingtax.modal('show');
   
});

//Withholdingtax editing
$('#tblWithholdingtax tbody').on('click', '.btnEdit', function () {
    $cmdOption = 2;
    console.log($tblWithholdingtax);
    var $dataRow = $tblWithholdingtax.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblWithholdingtax.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Update Withholdingtax");
    $("#btnWithholdingtax").html("Update");
    $modalWithholdingtax.modal('show');

    return false;
});

//Withholdingtax deleting
$('#tblWithholdingtax tbody').on('click', '.btnDelete', function () {
    $cmdOption = 3;
    console.log($tblWithholdingtax);
    var $dataRow = $tblWithholdingtax.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblWithholdingtax.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Delete Withholdingtax");
    $("#btnWithholdingtax").html("Delete");
    $modalWithholdingtax.modal('show');

    return false;
});

function setValues($withtaxDetails) {
    $("#rwithtax_id").val($withtaxDetails.rwithtax_id);
    $("#rwithtax_compensation_level_from").val($withtaxDetails.rwithtax_compensation_level_from);
    $("#rwithtax_compensation_level_to").val($withtaxDetails.rwithtax_compensation_level_to);
    $("#rwithtax_percentage").val($withtaxDetails.rwithtax_percentage);
    $("#rwithtax_additional").val($withtaxDetails.rwithtax_additional);
    $("#rwithtax_status").val($withtaxDetails.rwithtax_status);

    $("#rwithtax_paybasis").val($withtaxDetails.rwithtax_paybasis);
    $("#rwithtax_effective_from").val($withtaxDetails.rwithtax_effective_from);
    $("#rwithtax_effective_to").val($withtaxDetails.rwithtax_effective_to);

}
function clearForm() {
    $("#rwithtax_id").val('');
    $("#rwithtax_compensation_level_from").val('');
    $("#rwithtax_compensation_level_to").val('');
    $("#rwithtax_percentage").val('');
    $("#rwithtax_additional").val('');
    $("#rwithtax_status").val('');

    $("#rwithtax_paybasis").val('');
    $("#rwithtax_effective_from").val('');
    $("#rwithtax_effective_to").val('');


};