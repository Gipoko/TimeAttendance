var $modalVisitor = $("#modalVisitor");
var $cmdOption = 0;
var $frmTitle = $("#frmTitle");
var $selectedID = 0;
var $tblVisitor = $("#tblVisitor").DataTable(
    {
        "oLanguage": {
            "sInfo": "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
        },
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/page/visitor/index/*",
            "type": "POST",
        },
        columns: [
            { data: "visitors_id", title: "ID", "visible": true },
            { data: "visitors_name", title: "Name", "visible": true },
            { data: "visitors_company", title: "Company", "visible": true },
            { data: "visitors_visit_department", title: "Visit Department", "visible": true },
            { data: "visitors_visit_host", title: "Host / Visited", "visible": true },
            { data: "visitors_visit_reason", title: "Reason", "visible": true },
            { data: "visitors_created", title: "Date", "visible": true },

            { data: "action", title: "Action" }
        ]
    }
);



//validate laon entry
$('#frmVisitor').validate({
    focusInvalid: false,
    ignore: [],
    rules: {
        
        'visitors_name': {

            required: true
        },
        'visitors_company': {
            required: true
        },
        'visitors_visit_department': {
            required: true
        },
        'visitors_visit_host': {
            required: true
        },
        'visitors_visit_reason': {
            required: true
        },

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
        $url = '/page/visitor/' + ['add', 'edit', 'delete'][$cmdOption - 1] + '/*'
        $.ajax({
            url: $url,
            type: 'POST',
            data: $("#frmVisitor").serialize(),
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
                    $modalVisitor.modal('hide');
                    $tblVisitor.ajax.reload(null, false);
                } else {
                    return false;
                }

            }
        });
        return false;
    }
});
//add new Visitor
$("#btnVisitorAdd").on('click', function (e) {

    clearForm();
    $cmdOption = 1;
    $("#modalTitle").html("New Visitor");
    $("#btnVisitor").html("Save");
    $modalVisitor.modal('show');
});

//Visitor editing
$('#tblVisitor tbody').on('click', '.btnEdit', function () {
    $cmdOption = 2;
    console.log($tblVisitor);
    var $dataRow = $tblVisitor.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblVisitor.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Update Visitor");
    $("#btnVisitor").html("Update");
    $modalVisitor.modal('show');

    return false;
});

//Visitor deleting
$('#tblVisitor tbody').on('click', '.btnDelete', function () {
    $cmdOption = 3;
    console.log($tblVisitor);
    var $dataRow = $tblVisitor.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblVisitor.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Delete Visitor");
    $("#btnVisitor").html("Delete");
    $modalVisitor.modal('show');

    return false;
});

function setValues($VisitorDetails) {

    $("#visitors_id").val($VisitorDetails.visitors_id);
    
    $("#visitors_name").val($VisitorDetails.visitors_name);
    $("#visitors_company").val($VisitorDetails.visitors_company);
    $("#visitors_visit_department").val($VisitorDetails.visitors_visit_department);

    $("#visitors_visit_host").select2({ dropdownParent: "#modalVisitor" });

    $("#visitors_visit_host").val($VisitorDetails.visitors_visit_host).select2().trigger("change");
    $("#visitors_visit_reason").val($VisitorDetails.visitors_visit_reason);

}
function clearForm() {
    $("#visitors_name").val('');
    $("#visitors_company").val('');
    $("#visitors_visit_department").val('');
    $("#visitors_visit_host").val('');
    $("#visitors_visit_reason").val('');
};

$("#visitors_visit_host").select2({ dropdownParent: "#modalVisitor" });