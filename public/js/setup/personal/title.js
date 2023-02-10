$(document).ready(function () {
    var $btnTitleAdd = $("#btnTitleAdd");
    var $frmTitle = $("#frmTitle");
    var $lastCmd = 1;
    var $selectedID = 0;
    var $tblTitle = $("#tblTitle").DataTable(
        {
            "oLanguage": {
                "sInfo": "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
            },
            "responsive": true,
            "processing": true,
            columns: [
                { data: "rtitle_id", title: "Id", "visible": true },
                { data: "rtitle_desc", title: "Description", "visible": true },
                { data: "action", title: "Action" }
            ]
        }
    );

    $btnTitleAdd.html('Add');
    $("#rtitle_desc").val('');

    //load the family members
    $url = "/page/setup/personal-reference/title/index/*";
    $.ajax($url, {
        type: 'POST',
        dataType: 'JSON'
    }).then(function ($data) {
        console.log($data);
        $tblTitle.clear().rows.add($data.titles).draw();
    });


    $btnTitleAdd.on('click', function (e) {
        if ($("#rtitle_desc").val() == '') {
            return false;
        }
        if ($lastCmd == 1) {
            $url = "/page/setup/personal-reference/title/add/*";
            $data = { rtitle_desc: $("#rtitle_desc").val() };
        } else if ($lastCmd == 2) {
            $url = "/page/setup/personal-reference/title/edit/*";
            $data = { rtitle_id: $selectedID, rtitle_desc: $("#rtitle_desc").val() };
        } else if ($lastCmd == 3) {
            $url = "/page/setup/personal-reference/title/delete/*";
            $data = { rtitle_id: $selectedID }
        }

        $btnTitleAdd.html('Add');


        $.ajax($url, {
            type: 'POST',
            dataType: 'JSON',
            data: $data
        }).then(function ($data) {
            console.log('jun', $data);
            $tblTitle.clear().rows.add($data.titles).draw();
            $("#rtitle_desc").val('');
            $lastCmd = 1;
            $selectedID = 0;
        });
    });

    $('#tblTitle tbody').on('click', '.btnTitleEdit', function () {
        $data = $(this).data();
        $selectedID = $data.id;
        $("#rtitle_desc").val($data.val);
        $btnTitleAdd.html('Update');
        $lastCmd = 2;
    });

    $('#tblTitle tbody').on('click', '.btnTitleDelete', function () {
        $data = $(this).data();
        $selectedID = $data.id;
        $("#rtitle_desc").val($data.val);
        $btnTitleAdd.html('Delete');
        $lastCmd = 3;
    });

});