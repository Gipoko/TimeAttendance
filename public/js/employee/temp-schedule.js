
var $btnScheduleAdd = $("#btnScheduleAdd");
var $frmSchedule = $("#frmSchedule");
var $lastScheduleCmd = 1;
var $selectedID = 0;
$tblSchedule = $("#tblSchedule").DataTable({
    "oLanguage": {
        "sInfo": "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
    },
    "responsive": true,
    "processing": true,
    columns: [
        { data: "temp_schedule_id", title: "Id", "visible": true },
        { data: "rsched_name", title: "Name", "visible": true },
        { data: "rsched_amtimein", title: "Am In", "visible": true },
        { data: "rsched_amtimeout", title: "Am Out", "visible": true },
        { data: "rsched_pmtimein", title: "Pm In", "visible": true },
        { data: "rsched_pmtimeout", title: "Pm Out", "visible": true },
        { data: "rsched_entry", title: "Entry", "visible": true },
        { data: "action", title: "Action" }
    ]
}
);

function loadSchedules($id) {
    $btnScheduleAdd.html('Add');
    $("#rsched_name").val('');

    //load Schedule
    $url = "/page/human-resources/employee/schedule/getScheduleList/*";
    $.ajax($url, {
        type: 'POST',
        dataType: 'JSON',
        data: { temp_id: $id },
    }).then(function ($data) {

        $tblSchedule.clear().rows.add($data.schedules).draw();
    });
}



$btnScheduleAdd.on('click', function (e) {

    if ($("#rsched_name").val() === '') {

        return false;
    }
    if ($lastScheduleCmd == 1) {
        $url = "/page/human-resources/employee/schedule/add/*";
        $data = {
            temp_id: $selectedSched_id,
            rsched_name: $("#rsched_name").val(),
            rsched_amtimein: $("#rsched_amtimein").val(),
            rsched_amtimeout: $("#rsched_amtimeout").val(),
            rsched_pmtimein: $("#rsched_pmtimein").val(),
            rsched_pmtimeout: $("#rsched_pmtimeout").val(),
            rsched_entry: $("#rsched_entry").val()

        };
    } else if ($lastScheduleCmd == 2) {
        $url = "/page/human-resources/employee/schedule/edit/*";
        $data = {
            temp_id: $selectedSched_id,
            temp_schedule_id: $selectedID,
            rsched_name: $("#rsched_name").val(),
            rsched_amtimein: $("#rsched_amtimein").val(),
            rsched_amtimeout: $("#rsched_amtimeout").val(),
            rsched_pmtimein: $("#rsched_pmtimein").val(),
            rsched_pmtimeout: $("#rsched_pmtimeout").val(),
            rsched_entry: $("#rsched_entry").val()

        };
    } else if ($lastScheduleCmd == 3) {
        $url = "/page/human-resources/employee/schedule/delete/*";
        $data = {
            temp_id: $selectedSched_id,
            temp_schedule_id: $selectedID,
            rsched_name: $("#rsched_name").val(),
            rsched_amtimein: $("#rsched_amtimein").val(),
            rsched_amtimeout: $("#rsched_amtimeout").val(),
            rsched_pmtimein: $("#rsched_pmtimein").val(),
            rsched_pmtimeout: $("#rsched_pmtimeout").val(),
            rsched_entry: $("#rsched_entry").val()
        }
    }

    $btnScheduleAdd.html('Add');

    // alert($url);
    $.ajax($url, {
        type: 'POST',
        dataType: 'JSON',
        data: $data
    }).then(function ($data) {
        // alert($("#rschedule_code").val());
        console.log('jun', $data);
        $tblSchedule.clear().rows.add($data.schedules).draw();


        $("#rsched_name").val('').trigger('change');
        $("#rsched_amtimein").val('');
        $("#rsched_amtimeout").val('');
        $("#rsched_pmtimein").val('');
        $("#rsched_pmtimeout").val('');
        $("#rsched_entry").val('');
        $lastScheduleCmd = 1;
        $selectedID = 0;

    });
    return false;
});

$('#tblSchedule tbody').on('click', '.btnScheduleEdit', function () {
    $data = $(this).data();
    $selectedID = $data.id;
    $(".rsched_name").val($data.rsched_name).trigger('change');
    $("#rsched_amtimein").val($data.rsched_amtimein);
    $("#rsched_amtimeout").val($data.rsched_amtimeout);
    $("#rsched_pmtimein").val($data.rsched_pmtimein);
    $("#rsched_pmtimeout").val($data.rsched_pmtimeout);
    $("#rsched_entry").val($data.rsched_entry);
    $btnScheduleAdd.html('Update');
    $lastScheduleCmd = 2;
});

$('#tblSchedule tbody').on('click', '.btnScheduleDelete', function () {
    $data = $(this).data();
    $selectedID = $data.id;
    $(".rsched_name").val($data.rsched_name).trigger('change');
    $("#rsched_amtimein").val($data.rsched_amtimein);
    $("#rsched_amtimeout").val($data.rsched_amtimeout);
    $("#rsched_pmtimein").val($data.rsched_pmtimein);
    $("#rsched_pmtimeout").val($data.rsched_pmtimeout);
    $("#rsched_entry").val($data.rsched_entry);
    $btnScheduleAdd.html('Delete');
    $lastScheduleCmd = 3;
});

function clearSchedForm() {
    $("#rsched_name").val('').trigger('change');;
    $("#rsched_amtimein").val('07:00');
    $("#rsched_amtimeout").val('12:00');
    $("#rsched_pmtimein").val('01:00');
    $("#rsched_pmtimeout").val('04:00');
    $("#rsched_entry").val('4');
}

