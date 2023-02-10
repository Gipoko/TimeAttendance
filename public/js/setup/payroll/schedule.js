var $modalSchedule = $("#modalSchedule");
var $cmdOption = 0;
var $frmTitle = $("#frmTitle");
var $selectedID = 0;
var $tblSchedule = $("#tblSchedule").DataTable(
    {
        "oLanguage": {
            "sInfo": "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
        },
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/page/setup/payroll/schedule/index/*",
            "type": "POST",
        },
        columns: [
            { data: "rsched_id", title: "ID" },
            { data: "rsched_name", title: "Name" },
            { data: "rsched_amtimein", title: "Am In" },
            { data: "rsched_amtimeout", title: "Am Out" },
            { data: "rsched_pmtimein", title: "Pm Out" },
            { data: "rsched_pmtimeout", title: "Pm Out" },
            { data: "rsched_entry", title: "Entry" },
            { data: "action", title: "Action" }
        ]
    }
);



//validate laon entry
$('#frmSchedule').validate({
    focusInvalid: false,
    ignore: [],
    rules: {
        'rsched_name': {
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
        $url = '/page/setup/payroll/schedule/' + ['add', 'edit', 'delete'][$cmdOption - 1] + '/*'
        $.ajax({
            url: $url,
            type: 'POST',
            data: $("#frmSchedule").serialize(),
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
                    $modalSchedule.modal('hide');
                    $tblSchedule.ajax.reload(null, false);
                } else {
                    return false;
                }

            }
        });
        return false;
    }
});
//add new Schedule
$("#btnScheduleAdd").on('click', function (e) {

    clearForm();
    $cmdOption = 1;
    $("#modalTitle").html("New Schedule");
    $("#btnSchedule").html("Save");
    $modalSchedule.modal('show');
});

//Schedule editing
$('#tblSchedule tbody').on('click', '.btnEdit', function () {
    $cmdOption = 2;
    console.log($tblSchedule);
    var $dataRow = $tblSchedule.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblSchedule.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Update Schedule");
    $("#btnSchedule").html("Update");
    $modalSchedule.modal('show');

    return false;
});

//Schedule deleting
$('#tblSchedule tbody').on('click', '.btnDelete', function () {
    $cmdOption = 3;
    console.log($tblSchedule);
    var $dataRow = $tblSchedule.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblSchedule.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Delete Schedule");
    $("#btnSchedule").html("Delete");
    $modalSchedule.modal('show');

    return false;
});

function setValues($scheduleDetails) {

    $("#rsched_id").val($scheduleDetails.rsched_id);
    $("#rsched_name").val($scheduleDetails.rsched_name);
    $("#rsched_amtimein").val($scheduleDetails.rsched_amtimein);
    $("#rsched_amtimeout").val($scheduleDetails.rsched_amtimeout);
    $("#rsched_pmtimein").val($scheduleDetails.rsched_pmtimein);
    $("#rsched_pmtimeout").val($scheduleDetails.rsched_pmtimeout);
    $("#rsched_entry").val($scheduleDetails.rsched_entry);
}
function clearForm() {
    $("#rsched_id").val('');
    $("#rsched_name").val('');
    $("#rsched_amtimein").val('');
    $("#rsched_amtimeout").val('');
    $("#rsched_pmtimein").val('');
    $("#rsched_pmtimeout").val('');
    $("#rsched_entry").val('');


};