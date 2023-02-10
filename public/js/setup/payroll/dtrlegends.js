var $modalLegend = $("#modalLegend");
var $cmdOption = 0;
var $frmTitle = $("#frmTitle");
var $selectedID = 0;
var $tblLegend = $("#tblLegend").DataTable(
    {
        "oLanguage": {
            "sInfo": "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
        },
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/page/setup/payroll/dtrlegends/index/*",
            "type": "POST",
        },
        columns: [
            { data: "dtrlegend_id", title: "ID" },
            { data: "dtrlegend_code", title: "Legend Code" },
            { data: "dtrlegend_desc", title: "Legend Description" },
            { data: "dtrlegend_status", title: "Status" },
            { data: "action", title: "Action" }
        ]
    }
);



//validate laon entry
$('#frmLegend').validate({
    focusInvalid: false,
    ignore: [],
    rules: {
        'dtrlegend_code': {
            required: true
        },
        'dtrlegend_desc': {
            required: true
        },
        'dtrlegend_status': {
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
        $url = '/page/setup/payroll/dtrlegends/' + ['add', 'edit', 'delete'][$cmdOption - 1] + '/*'
        $.ajax({
            url: $url,
            type: 'POST',
            data: $("#frmLegend").serialize(),
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
                    $modalLegend.modal('hide');
                    $tblLegend.ajax.reload(null, false);
                } else {
                    return false;
                }

            }
        });
        return false;
    }
});
//add new Legend
$("#btnLegendAdd").on('click', function (e) {

    clearForm();
    $cmdOption = 1;
    $("#modalTitle").html("New Legend");
    $("#btnLegend").html("Save");
    $modalLegend.modal('show');
});

//Legend editing
$('#tblLegend tbody').on('click', '.btnEdit', function () {
    $cmdOption = 2;
    console.log($tblLegend);
    var $dataRow = $tblLegend.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblLegend.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Update Legend");
    $("#btnLegend").html("Update");
    $modalLegend.modal('show');

    return false;
});

//Legend deleting
$('#tblLegend tbody').on('click', '.btnDelete', function () {
    $cmdOption = 3;
    console.log($tblLegend);
    var $dataRow = $tblLegend.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblLegend.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Delete Legend");
    $("#btnLegend").html("Delete");
    $modalLegend.modal('show');

    return false;
});

function setValues($legendDetails) {

    $("#dtrlegend_id").val($legendDetails.dtrlegend_id);
    $("#dtrlegend_code").val($legendDetails.dtrlegend_code);
    $("#dtrlegend_desc").val($legendDetails.dtrlegend_desc);
    $("#dtrlegend_status").val($legendDetails.dtrlegend_status);


}
function clearForm() {
    $("#dtrlegend_id").val('');
    $("#dtrlegend_code").val('');
    $("#dtrlegend_desc").val('');
    $("#dtrlegend_status").val('');



};