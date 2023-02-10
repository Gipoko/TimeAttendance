$(document).ready(function () {
  $('#frmLogin').validate({
    rules: {
      'tuser_username': {
        required: true
      },
      'tuser_password': {
        required: true
      },
      'recpatcha': {
        required: true
      }
    },
    highlight: function (input) {
      $(input).addClass('is-invalid');
    },
    unhighlight: function (input) {
      $(input).removeClass('is-invalid');
    },
    errorPlacement: function (error, element) {
      $(element).next().append(error);
    },
    submitHandler: function (form) {

      $.ajax({
        url: '/user/login',
        type: 'POST',
        data: $("#frmLogin").serialize(),
        success: function (data) {
          $newData = JSON.parse(data);

          if (!$newData.status) {
            $.confirm({
              bgOpacity: 0.9,
              title: $newData.title,
              content: $newData.content,
              type: 'red',
              typeAnimated: true,
              autoClose: 'ok|10000',
              buttons: {
                ok: {
                  text: 'Ok',
                  btnClass: 'btn-red'
                }
              }
            });
            return false;
          }
          window.location.replace($newData.mainpage);
        }
      });
      return false;
    }
  });
});