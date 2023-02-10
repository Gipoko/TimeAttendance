$( document ).ready( function () {
    var $btnBankAdd = $("#btnBankAdd");
    var $frmTitle = $("#frmTitle");
    var $lastCmd = 1;
    var $selectedID = 0;
    var $tblNationality = $("#tblNationality").DataTable(
        {
            "oLanguage": {
              "sInfo" : "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
          },
          "responsive": true,
          "processing": true,
          "serverSide": true,
          "ajax": {
            "url": "/page/setup/personal-reference/nationality/index/" + (new Date()).getTime(),
  
            "type": "POST",
          },
          columns: [
            { data: "rcountry_id", title: "Id", "visible": true },
            { data: "rcountry_code", title: "Code", "visible": true }, 
            { data: "rcountry_name", title: "Nationality", "visible": true }, 
            { data: "action", title: "Action" }
          ]
      }
    );

    $('#tblNationality tbody').on('change', 'input[type="checkbox"]', function(){
        $data = $(this).data();
        $val = $(this).prop("checked");
        $state = $val ? 1 : 0;
        $sendData = {rcountry_id : $data.id, isActive : $state};
        $.ajax("/page/setup/personal-reference/nationality/edit/*", {
            type: 'POST',
            dataType: 'JSON',
            data: $sendData
        }).then(function ($data) {
            console.log('jun', $data);
            $tblBank.clear().rows.add($data.banks).draw();
            $("#rbank_name").val('');
            $lastCmd = 1;
            $selectedID = 0;
        });
        return false;
    });

});