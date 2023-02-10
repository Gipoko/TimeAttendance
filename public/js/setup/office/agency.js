var $modalAgency = $("#modalAgency");
var $cmdOption = 0;
var $frmTitle = $("#frmTitle");
var $selectedID = 0;
var $tblAgency = $("#tblAgency").DataTable(
    {
        "oLanguage": {
            "sInfo": "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
        },
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/page/setup/office/agency/index/*",
            "type": "POST",
        },
        columns: [
            { data: "ragency_id", title: "ID", "visible": true },
            { data: "ragency_code", title: "Code", "visible": true },
            { data: "ragency_name", title: "Name", "visible": true },

            { data: "action", title: "Action" }
        ]
    }
);



//validate laon entry
$('#frmAgency').validate({
    focusInvalid: false,
    ignore: [],
    rules: {
        'ragency_code': {
            required: true
        },
        'ragency_name': {

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
        $url = '/page/setup/office/agency/' + ['add', 'edit', 'delete'][$cmdOption - 1] + '/*'
        $.ajax({
            url: $url,
            type: 'POST',
            data: $("#frmAgency").serialize(),
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
                    $modalAgency.modal('hide');
                    $tblAgency.ajax.reload(null, false);
                } else {
                    return false;
                }

            }
        });
        return false;
    }
});
//add new Agency
$("#btnAgencyAdd").on('click', function (e) {

    clearForm();
    $cmdOption = 1;
    $("#modalTitle").html("New Agency");
    $("#btnAgency").html("Save");
    $modalAgency.modal('show');
});

//Agency editing
$('#tblAgency tbody').on('click', '.btnEdit', function () {
    $cmdOption = 2;
    console.log($tblAgency);
    var $dataRow = $tblAgency.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblAgency.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Update Agency");
    $("#btnAgency").html("Update");
    $modalAgency.modal('show');

    return false;
});

//Agency deleting
$('#tblAgency tbody').on('click', '.btnDelete', function () {
    $cmdOption = 3;
    console.log($tblAgency);
    var $dataRow = $tblAgency.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblAgency.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Delete Agency");
    $("#btnAgency").html("Delete");
    $modalAgency.modal('show');

    return false;
});

function setValues($AgencyDetails) {

    $("#ragency_id").val($AgencyDetails.ragency_id);
    $("#ragency_code").val($AgencyDetails.ragency_code);
    $("#ragency_name").val($AgencyDetails.ragency_name);

}
function clearForm() {
    $("#ragency_id").val('');
    $("#ragency_code").val('');
    $("#ragency_name").val('');



};