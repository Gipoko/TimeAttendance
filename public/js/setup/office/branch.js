var $modalBranch = $("#modalBranch");
var $cmdOption = 0;
var $frmTitle = $("#frmTitle");
var $selectedID = 0;
var $tblBranch = $("#tblBranch").DataTable(
    {
        "oLanguage": {
            "sInfo": "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
        },
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/page/setup/office/branch/index/*",
            "type": "POST",
        },
        columns: [
            { data: "rbranch_id", title: "ID", "visible": true },
            { data: "rbranch_name", title: "Name", "visible": true },
            { data: "rbranch_address", title: "Address", "visible": true },
            { data: "action", title: "Action" }
        ]
    }
);



//validate laon entry
$('#frmBranch').validate({
    focusInvalid: false,
    ignore: [],
    rules: {
        'rbranch_name': {
            required: true
        },
        'rbranch_address': {

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
        $url = '/page/setup/office/branch/' + ['add', 'edit', 'delete'][$cmdOption - 1] + '/*'
        $.ajax({
            url: $url,
            type: 'POST',
            data: $("#frmBranch").serialize(),
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
                    $modalBranch.modal('hide');
                    $tblBranch.ajax.reload(null, false);
                } else {
                    return false;
                }

            }
        });
        return false;
    }
});
//add new Branch
$("#btnBranchAdd").on('click', function (e) {

    clearForm();
    $cmdOption = 1;
    $("#modalTitle").html("New Branch");
    $("#btnBranch").html("Save");
    $modalBranch.modal('show');
});

//Branch editing
$('#tblBranch tbody').on('click', '.btnEdit', function () {
    $cmdOption = 2;
    console.log($tblBranch);
    var $dataRow = $tblBranch.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblBranch.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Update Branch");
    $("#btnBranch").html("Update");
    $modalBranch.modal('show');

    return false;
});

//Branch deleting
$('#tblBranch tbody').on('click', '.btnDelete', function () {
    $cmdOption = 3;
    console.log($tblBranch);
    var $dataRow = $tblBranch.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblBranch.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Delete Branch");
    $("#btnBranch").html("Delete");
    $modalBranch.modal('show');

    return false;
});

function setValues($BranchDetails) {

    $("#rbranch_id").val($BranchDetails.rbranch_id);
    $("#rbranch_name").val($BranchDetails.rbranch_name);
    $("#rbranch_address").val($BranchDetails.rbranch_address);
}
function clearForm() {
    $("#rbranch_id").val('');
    $("#rbranch_name").val('');
    $("#rbranch_address").val('');


};