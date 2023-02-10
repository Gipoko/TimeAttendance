var $modalSection = $("#modalSection");
var $cmdOption = 0;
var $frmTitle = $("#frmTitle");
var $selectedID = 0;
var $tblSection = $("#tblSection").DataTable(
    {
        "oLanguage": {
            "sInfo": "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
        },
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/page/setup/office/section/index/*",
            "type": "POST",
        },
        columns: [
            { data: "rsection_id", title: "ID", "visible": true },
            { data: "rsection_code", title: "Code", "visible": true },
            { data: "rsection_name", title: "Name", "visible": true },

            { data: "action", title: "Action" }
        ]
    }
);



//validate laon entry
$('#frmSection').validate({
    focusInvalid: false,
    ignore: [],
    rules: {
        'rsection_code': {
            required: true
        },
        'rsection_name': {

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
        $url = '/page/setup/office/section/' + ['add', 'edit', 'delete'][$cmdOption - 1] + '/*'
        $.ajax({
            url: $url,
            type: 'POST',
            data: $("#frmSection").serialize(),
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
                    $modalSection.modal('hide');
                    $tblSection.ajax.reload(null, false);
                } else {
                    return false;
                }

            }
        });
        return false;
    }
});
//add new Section
$("#btnSectionAdd").on('click', function (e) {

    clearForm();
    $cmdOption = 1;
    $("#modalTitle").html("New Section");
    $("#btnSection").html("Save");
    $modalSection.modal('show');
});

//Section editing
$('#tblSection tbody').on('click', '.btnEdit', function () {
    $cmdOption = 2;
    console.log($tblSection);
    var $dataRow = $tblSection.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblSection.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Update Section");
    $("#btnSection").html("Update");
    $modalSection.modal('show');

    return false;
});

//Section deleting
$('#tblSection tbody').on('click', '.btnDelete', function () {
    $cmdOption = 3;
    console.log($tblSection);
    var $dataRow = $tblSection.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblSection.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Delete Section");
    $("#btnSection").html("Delete");
    $modalSection.modal('show');

    return false;
});

function setValues($SectionDetails) {

    $("#rsection_id").val($SectionDetails.rsection_id);
    $("#rsection_code").val($SectionDetails.rsection_code);
    $("#rsection_name").val($SectionDetails.rsection_name);

}
function clearForm() {
    $("#rsection_id").val('');
    $("#rsection_code").val('');
    $("#rsection_name").val('');



};