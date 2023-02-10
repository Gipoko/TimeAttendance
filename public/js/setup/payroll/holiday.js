var $modalHoliday = $("#modalHoliday");
var $cmdOption = 0;
var $frmTitle = $("#frmTitle");
var $selectedID = 0;
var $tblHoliday = $("#tblHoliday").DataTable(
    {
        "oLanguage": {
            "sInfo": "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
        },
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/page/setup/payroll/holiday/index/*",
            "type": "POST",
        },
        columns: [
            { data: "rholiday_id", title: "ID", "visible": true },
            { data: "rholiday_code", title: "Code", "visible": true },
            { data: "rholiday_desc", title: "Description", "visible": true },
            { data: "rholiday_date", title: "Date", "visible": true },
            { data: "rholiday_status", title: "Status", "visible": true },
            { data: "action", title: "Action" }
        ]
    }
);



//validate laon entry
$('#frmHoliday').validate({
    focusInvalid: false,
    ignore: [],
    rules: {
        'rholiday_code': {
            required: true
        },
        'rholiday_date': {
            required: true
        },
        'rholiday_desc': {
            required: true
        },
        'rholiday_status': {

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
        $url = '/page/setup/payroll/holiday/' + ['add', 'edit', 'delete'][$cmdOption - 1] + '/*'
        $.ajax({
            url: $url,
            type: 'POST',
            data: $("#frmHoliday").serialize(),
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
                    $modalHoliday.modal('hide');
                    $tblHoliday.ajax.reload(null, false);
                } else {
                    return false;
                }

            }
        });
        return false;
    }
});
//add new Holiday
$("#btnHolidayAdd").on('click', function (e) {

    clearForm();
    $cmdOption = 1;
    $("#modalTitle").html("New Holiday");
    $("#btnHoliday").html("Save");
    $modalHoliday.modal('show');
});

//Holiday editing
$('#tblHoliday tbody').on('click', '.btnEdit', function () {
    $cmdOption = 2;
    console.log($tblHoliday);
    var $dataRow = $tblHoliday.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblHoliday.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Update Holiday");
    $("#btnHoliday").html("Update");
    $modalHoliday.modal('show');

    return false;
});

//Holiday deleting
$('#tblHoliday tbody').on('click', '.btnDelete', function () {
    $cmdOption = 3;
    console.log($tblHoliday);
    var $dataRow = $tblHoliday.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblHoliday.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Delete Holiday");
    $("#btnHoliday").html("Delete");
    $modalHoliday.modal('show');

    return false;
});

function setValues($HolidayDetails) {

    $("#rholiday_id").val($HolidayDetails.rholiday_id);
    $("#rholiday_code").val($HolidayDetails.rholiday_code);
    $("#rholiday_desc").val($HolidayDetails.rholiday_desc);
    $("#rholiday_date").val($HolidayDetails.rholiday_date);
    $("#rholiday_status").val($HolidayDetails.rholiday_status);

}
function clearForm() {
    $("#rholiday_id").val('');
    $("#rholiday_code").val('');
    $("#rholiday_desc").val('');
    $("#rholiday_date").val('');



};