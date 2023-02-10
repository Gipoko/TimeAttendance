    //refresh the captcha
    $("#btnRefreshCaptcha").click(function(){
        var captchaImage = "/recaptcha?rand="+Math.random()*1000;
        $('#imgCaptcha').attr('src', captchaImage);
      });
