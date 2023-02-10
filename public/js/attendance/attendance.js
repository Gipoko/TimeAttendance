$("#data").submit(function (e) {
    e.preventDefault();
    var formData = new FormData(this);

    $.ajax({
        url: '/page/attendance/' + ['upload'] + '/*',
        type: 'POST',

        data: formData,
        success: function (data) {
            alert(data)
        },
        cache: false,
        contentType: false,
        processData: false
    });
    return false;
});

var $aYearMonth = [];
var $sel2RYearMonth;
var $svrAttendanceLog;

Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
};

var getDaysInMonth = function (month, year) {
    return new Date(year, month, 0).getDate();
};
// and then call



$tblAttendanceLog = $('#tblAttendanceLog').DataTable({
    "processing": true,
    "serverSide": false,
    "searching": false,
    "paging": true,
    scrollX: true,
    columns: [
        { data: "temp_dtrbio_id", title: "ID", "visible": false },
        { data: "temp_id", title: "ID", "visible": false },
        {
            data: 'temp_dtrbio_yy',
            title: 'year',
            render: function (data, type, row) {
                return renderTextArea(data, type, row, 'year');
            }
        },
        {
            data: 'temp_dtrbio_mm',
            title: 'month',
            render: function (data, type, row) {
                return renderTextArea(data, type, row, 'month');
            }
        },
        {
            data: 'temp_dtrbio_dd',
            title: 'day',
            render: function (data, type, row) {
                return renderTextArea(data, type, row, 'day');
            }
        },
        {
            data: 'temp_dtrtime_01',
            title: 'T01',
            render: function (data, type, row) {
                return renderTextArea(data, type, row, 'T01');
            }
        }

    ]
});

function renderTextArea(data, type, row, fldName) {
    if (data == null) {
        data = "00:00";
    }
    $id = "id" + row.temp_dtrbio_id + '_' + fldName;

    $div = '<div class="row">';
    $div += '    <div class="col-sm-12">';
    $div += '       <textarea id="' + $id + '" style="resize:none;scrollbar-width: thin;overflow-x: hidden;" rows="2" cols="1" name="' + $id + '">' + data + '</textarea>';
    $div += '    </div>';
    $div += '    <div class="col-sm-12 text-center mt-1">';
    $div += '<button class="btn btnInsertFakeTime"><i class="bx bx-customize m-0 text-muted h5"></i></button>';
    $div += '<button class="btn btnClearTime"><i class="bx bx-trash m-0 text-muted h5"></i></button>';
    $div += '    </div>';
    $div += '</div>';
    return $div;
}

//get year month list
$sel2RYearMonth = $("#selYearMonth").select2({});
$url = "/page/attendance/getYearMonth/*";
$.ajax($url, {
    type: 'POST',
    dataType: 'JSON'
}).then(function ($resYearMonth) {
    console.log($resYearMonth);

    $sel2RYearMonth.select2({
        dropdownParent: $('.jun'),
        minimumResultsForSearch: -1,
        width: '100%',
        data: $resYearMonth
    });

    $sel2RYearMonth.on('select2:select', function (e) {
        $ym = $(this).val();
        if ($ym == '') {

            $tblAttendanceLog.clear().draw();
            var link = document.getElementById("prntAttendanceLog");
            link.setAttribute('href', "javascript: void(0)");
            return false;
        }
        $selEmployeeList.empty();
        for (i = 0; i < $aEmployList.length; i++) {
            $selEmployeeList.append('<option value="' + $aEmployList[i].id + '">' + $aEmployList[i].text + '</option>');
        }
        $selEmployeeList.val(-1);
    });
});

//get employee list
$selEmployeeList = $("#selEmployeeList").select2({});
$url = "/page/human-resources/employee/getEmployeeList/*";
$.ajax($url, {
    type: 'POST',
    dataType: 'JSON'
}).then(function ($resEmployeeList) {
    console.log($resEmployeeList);
    $aEmployList = $resEmployeeList;

    $selEmployeeList.on('select2:select', function (e) {
        $yymm = $sel2RYearMonth.val();
        $mid = $(this).val();


        $url = "/page/attendance/getEmployeeAttendance/*";
        $data = {
            temp_id: $mid,
            temp_dtrbio_yy: $yymm.substr(0, 4),
            temp_dtrbio_mm: $yymm.substr(-2)
        }

        $columns = [];
        $.ajax($url, {
            type: 'POST',
            dataType: 'JSON',
            data: $data
        }).then(function ($result) {
            console.log($result.attendanceLogs);
            alert('jun here xx');
            $tblAttendanceLog.clear().rows.add($result.attendanceLogs).draw();
            //change the link of the print attendance log
            $url = "javascript:voide(0)";
            if ($result.attendanceLogs.length > 0) {
                $url = "/page/attendance/printAttendanceLog/" + $yymm + "~" + $mid;
            }
            var link = document.getElementById("prntAttendanceLog");
            link.setAttribute('href', $url);
        });
    });
});