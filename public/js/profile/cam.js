$(function () {

  var $modalCam = $("#modalCam");
  var $imgChangePicture = $(".imgChangePicture");
 
  $imgChangePicture.on('click', function(e) {
     $modalCam.modal('show');
  })
  
  
  $camOption = $("#camOption");
  var camName = ['front', 'back'];
  var cameras = new Array();
  
  navigator.mediaDevices.enumerateDevices() // get the available devices found in the machine
  .then(function(devices) {

  devices.forEach(function(device) {
      var i = 0;
      if(device.kind=== "videoinput"){ //filter video devices only
        cameras.push(device.deviceId); // save the camera id's in the camera array
        i++;
      }
    });

    if (cameras.length == 1) {
      $("select[name=camOption] option:last").remove();
    }
  }

  );


  var attachWebcam = function() {
    var width = 260;
    var height = 220;
  
    if(screen.width < screen.height) {
      width = 240;
      height = 240;
    }
  
    Webcam.set({
      width: width,
      height: height,
      dest_width: width,
      dest_height: height,
      crop_width: width,
      crop_height: height
    });
  
    Webcam.attach('#my_camera');
  };
  
  window.addEventListener('orientationchange', function() {
    Webcam.reset();
    attachWebcam();
  });
  
  attachWebcam();

  navigator.mediaDevices.enumerateDevices() // get the available devices found in the machine
    .then(function(devices) {
      devices.forEach(function(device) {
          var i = 0;
          if(device.kind=== "videoinput"){ //filter video devices only
            cameras[i]= device.deviceId; // save the camera id's in the camera array
            i++;
          }
        }
      );
  });

  
    $camOption.on('change', function(e) {
      $val = $(this).val();
      Webcam.reset();
      Webcam.set({
        width: 300,
        height: 300,
        image_format: 'jpeg',
        jpeg_quality: 100,
        constraints: {
          facingMode: $val
        }
      });
      Webcam.attach( '#imgEmployeeProfile' );
    });
  




$("#btnCamClick").on('click', function(e) {
  // cameraFacingMode = (cameraFacingMode == 'user') ? 'environment' : 'user';

  
  take_snapshot();
})
function take_snapshot() {
    Webcam.snap( function(data_uri) {
        $(".image-tag").val(data_uri);
        document.getElementById('camResult').innerHTML = '<img id="imgCanvas" src="'+data_uri+'" width="260" height="200"/>';
    } );
}


function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
  }

var blob = new Blob(byteArrays, {type: contentType});
return blob;
}

$("#frmCamUpload").submit(function(e){
  e.preventDefault();
  appendFileAndSubmit();
});

function appendFileAndSubmit(){
  // Get the form
  var form = document.getElementById("frmCamUpload");

  var ImageURL = imgCanvas.src;
  // Split the base64 string in data and contentType
  var block = ImageURL.split(";");
  // Get the content type
  var contentType = block[0].split(":")[1];// In this case "image/gif"
  // get the real base64 content of the file
  var realData = block[1].split(",")[1];// In this case "iVBORw0KGg...."

  // Convert to blob
  var blob = b64toBlob(realData, contentType);

  // Create a FormData and append the file
  var fd = new FormData(form);
  fd.append("image", blob);
  

  // Submit Form and upload file
  $.ajax({
      url:"/page/employee/details/uploadpicture/*",
      data: fd,// the formData function is available in almost all new browsers.
      type:"POST",
      contentType:false,
      processData:false,
      cache:false,
      dataType:"json", // Change this according to your response from the server.
      error:function(err){
          console.error(err);
      },
      success:function($data){
        //update picture of employee profile
        // window.tblPerson.ajax.reload(null, false);
        console.log($data);
        $imgChangePicture.attr("src", "/" + $data.file + "?" + (new Date()).getTime());
          Swal.fire(
            $data.label,
            $data.msg,
            $data.icon
          )
          $modalCam.modal('hide');
      },
      complete:function(){
        
      }
  });
}

});