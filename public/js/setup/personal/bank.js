$( document ).ready( function () {
    var $btnBankAdd = $("#btnBankAdd");
    var $frmTitle = $("#frmTitle");
    var $lastCmd = 1;
    var $selectedID = 0;
    var $tblBank = $("#tblBank").DataTable(
        {
            "oLanguage": {
              "sInfo" : "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
          },
          "responsive": true,
          "processing": true,
          columns: [
            { data: "rbank_id", title: "Id", "visible": true },
            { data: "rbank_name", title: "Description", "visible": true }, 
            { data: "action", title: "Action" }
          ]
      }
    );

    $btnBankAdd.html('Add');
    $("#rbank_name").val('');

      //load the family members
    $url = "/page/setup/personal-reference/bank/index/*";
    $.ajax($url, {
        type: 'POST',
        dataType: 'JSON'
    }).then(function ($data) {
        $tblBank.clear().rows.add($data.banks).draw();
    });


    $btnBankAdd.on('click', function(e) {
        if ($("#rbank_name").val() == '' ) {
            return false;
        }
        if ($lastCmd ==1) {
            $url = "/page/setup/personal-reference/bank/add/*";
            $data = {rbank_name : $("#rbank_name").val()};
        } else if ($lastCmd == 2) {
            $url = "/page/setup/personal-reference/bank/edit/*";
            $data = {rbank_id : $selectedID, rbank_name : $("#rbank_name").val()};
        } else if ($lastCmd == 3) {
            $url = "/page/setup/personal-reference/bank/delete/*";
            $data = {rbank_id : $selectedID}
        }

        $btnBankAdd.html('Add');
        

        $.ajax($url, {
            type: 'POST',
            dataType: 'JSON',
            data: $data
        }).then(function ($data) {
            console.log('jun', $data);
            $tblBank.clear().rows.add($data.banks).draw();
            $("#rbank_name").val('');
            $lastCmd = 1;
            $selectedID = 0;
        });
    });

    $('#tblBank tbody').on('click', '.btnBankEdit', function () {
        $data = $(this).data();
        $selectedID = $data.id; 
        $("#rbank_name").val($data.val);
        $btnBankAdd.html('Update');
        $lastCmd = 2;
    });

    $('#tblBank tbody').on('click', '.btnBankDelete', function () {
        $data = $(this).data();
        $selectedID = $data.id;
        $("#rbank_name").val($data.val);
        $btnBankAdd.html('Delete');
        $lastCmd = 3;
    });

});