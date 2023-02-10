var $modalDivisionSection = $("#modalDivisionSection");
var $cmdOption = 0;
var $frmTitle = $("#frmTitle");
var $selectedID = 0;
var $tblDivisionSection = $("#tblDivisionSection").DataTable(
    {
        "oLanguage": {
            "sInfo": "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
        },
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/page/setup/office/division_section_unit/index/*",
            "type": "POST",
        },
        columns: [
            { data: "rdivision_sectionunit_id", title: "ID", "visible": true },
            { data: "rdivision_id", title: "Division", "visible": true },
            { data: "rdivision_sectionunit_name", title: "Name", "visible": true },
            { data: "rdivision_sectionunit_code", title: "Code", "visible": true },

            { data: "action", title: "Action" }
        ]
    }
);


//validate laon entry
$('#frmDivisionSection').validate({
    focusInvalid: false,
    ignore: [],
    rules: {

        'rdivision_id': {
            required: true
        },
        'rdivision_sectionunit_code': {
            required: true
        },
        'rdivision_sectionunit_name': {

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
        $url = '/page/setup/office/division_section_unit/' + ['add', 'edit', 'delete'][$cmdOption - 1] + '/*'
        $.ajax({
            url: $url,
            type: 'POST',
            data: $("#frmDivisionSection").serialize(),
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
                    $modalDivisionSection.modal('hide');
                    $tblDivisionSection.ajax.reload(null, false);
                } else {
                    return false;
                }

            }
        });
        return false;
    }
});
//add new Division Section
$("#btnDivisionSectionAdd").on('click', function (e) {

    clearForm();
    $cmdOption = 1;
    $("#modalTitle").html("New Division Section");
    $("#btnDivisionSection").html("Save");
    $modalDivisionSection.modal('show');
});

//Division Section editing
$('#tblDivisionSection tbody').on('click', '.btnEdit', function () {
    $cmdOption = 2;
    console.log($tblDivisionSection);
    var $dataRow = $tblDivisionSection.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblDivisionSection.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Update Division Section");
    $("#btnDivisionSection").html("Update");
    $modalDivisionSection.modal('show');

    return false;
});

//Division deleting
$('#tblDivisionSection tbody').on('click', '.btnDelete', function () {
    $cmdOption = 3;
    console.log($tblDivisionSection);
    var $dataRow = $tblDivisionSection.row(this).data();

    if ($dataRow === undefined) {
        var $dataRow = $tblDivisionSection.row($(this).parents('tr')).data();
    }

    setValues($dataRow);
    $("#modalTitle").html("Delete Division Section");
    $("#btnDivisionSection").html("Delete");
    $modalDivisionSection.modal('show');

    return false;
});

function setValues($DivisionSectionDetails) {

    $("#rdivision_sectionunit_id").val($DivisionSectionDetails.rdivision_sectionunit_id);
    $("#rdivision_id").val($DivisionSectionDetails.rdivision_id);
    $("#rdivision_sectionunit_code").val($DivisionSectionDetails.rdivision_sectionunit_code);
    $("#rdivision_sectionunit_name").val($DivisionSectionDetails.rdivision_sectionunit_name);

}
function clearForm() {
    $("#rdivision_sectionunit_id").val('');
    $("#rdivision_id").val('');
    $("#rdivision_sectionunit_code").val('');
    $("#rdivision_sectionunit_name").val('');



};