$( document ).ready( function () {
    var $btnReligionAdd = $("#btnReligionAdd");
    var $frmReligion = $("#frmReligion");
    var $lastCmd = 1;
    var $selectedID = 0;
    var $tblReligion = $("#tblReligion").DataTable(
        {
            "oLanguage": {
              "sInfo" : "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
          },
          "responsive": true,
          "processing": true,
          columns: [
            { data: "rreligion_id", title: "Id", "visible": true },
            { data: "rreligion_desc", title: "Description", "visible": true }, 
            { data: "action", title: "Action" }
          ]
      }
    );

    $btnReligionAdd.html('Add');
    $("#rreligion_desc").val('');

      //load the family members
    $url = "/page/setup/personal-reference/religion/index/*";
    $.ajax($url, {
        type: 'POST',
        dataType: 'JSON'
    }).then(function ($data) {
        $tblReligion.clear().rows.add($data.religions).draw();
    });


    $btnReligionAdd.on('click', function(e) {
        if ($("#rreligion_desc").val() == '' ) {
            return false;
        }
        if ($lastCmd ==1) {
            $url = "/page/setup/personal-reference/religion/add/*";
            $data = {rreligion_desc : $("#rreligion_desc").val()};
        } else if ($lastCmd == 2) {
            $url = "/page/setup/personal-reference/religion/edit/*";
            $data = {rreligion_id : $selectedID, rreligion_desc : $("#rreligion_desc").val()};
        } else if ($lastCmd == 3) {
            $url = "/page/setup/personal-reference/religion/delete/*";
            $data = {rreligion_id : $selectedID}
        }

        $btnReligionAdd.html('Add');
        

        $.ajax($url, {
            type: 'POST',
            dataType: 'JSON',
            data: $data
        }).then(function ($data) {
            console.log('jun', $data);
            $tblReligion.clear().rows.add($data.religions).draw();
            $("#rreligion_desc").val('');
            $lastCmd = 1;
            $selectedID = 0;
        });
    });

    $('#tblReligion tbody').on('click', '.btnReligionEdit', function () {
        $data = $(this).data();
        $selectedID = $data.id; 
        $("#rreligion_desc").val($data.val);
        $btnReligionAdd.html('Update');
        $lastCmd = 2;
    });

    $('#tblReligion tbody').on('click', '.btnReligionDelete', function () {
        $data = $(this).data();
        $selectedID = $data.id;
        $("#rreligion_desc").val($data.val);
        $btnReligionAdd.html('Delete');
        $lastCmd = 3;
    });

});