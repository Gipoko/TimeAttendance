var $modalDocument = $("#modalDocument");
var $cmdOption = 0;
var $frmTitle = $("#frmTitle");
var $selectedID = 0;
var $tblDocument = $("#tblDocument").DataTable(
    {
        "oLanguage": {
            "sInfo": "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
        },
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/page/setup/payroll/document/index/*",
            "type": "POST",
        },
        columns: [
            { data: "rdocument_id", title: "ID" },
            { data: "rdocument_type", title: "Document Type" },
            { data: "rdocument_desc", title: "Descriptiom" },
            { data: "rdocument_status", title: "Status" },
            { data: "action", title: "Action" }
        ]
    }
);



//validate laon entry
$('#frmDocument').validate({
    focusInvalid: false,
    ignore: [],
    rules: {
        'rdocument_type': {
            required: true
        },
        'rdocument_desc': {
            required: true
        },
        'rdocument_status': {
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
        $url = '/page/setup/payroll/document/' + ['add', 'edit', 'delete'][$cmdOption - 1] + '/*'
        $.ajax({
            url: $url,
            type: 'POST',
            data: $("#frmDocument").serialize(),
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
                    $modalDocument.modal('hide');
                    $tblDocument.ajax.reload(null, false);
                } else {
                    return false;
                }

            }
        });
        return false;
    }
});
//add new Document
$("#btnDocumentAdd").on('click', function (e) {

    clearForm();
    $cmdOption = 1;
    $("#modalTitle").html("New Document");
    $("#btnDocument").html("Save");
    $modalDocument.modal('show');
});

//Document editing
$('#tblDocument tbody').on('click', '.btnEdit', function () {
    $cmdOption = 2;
    console.log($tblDocument);
    var $dataRow = $tblDocument.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblDocument.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Update Document");
    $("#btnDocument").html("Update");
    $modalDocument.modal('show');

    return false;
});

//Document deleting
$('#tblDocument tbody').on('click', '.btnDelete', function () {
    $cmdOption = 3;
    console.log($tblDocument);
    var $dataRow = $tblDocument.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblDocument.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Delete Document");
    $("#btnDocument").html("Delete");
    $modalDocument.modal('show');

    return false;
});

function setValues($documentDetails) {

    $("#rdocument_id").val($documentDetails.rdocument_id);
    $("#rdocument_type").val($documentDetails.rdocument_type);
    $("#rdocument_desc").val($documentDetails.rdocument_desc);
    $("#rdocument_status").val($documentDetails.rdocument_status);


}
function clearForm() {
    $("#rdocument_id").val('');
    $("#rdocument_type").val('');
    $("#rdocument_desc").val('');
    $("#rdocument_status").val('');



};