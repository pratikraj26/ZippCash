var sPicData, sVideoData; //store image data for image upload functionality

function captureVideo(cb){
  if (cb == null ){
    var options = { limit: 1 };
    navigator.device.capture.captureVideo(captureVideoSuccess, captureVideoError, options);
  }else{
    var options = { limit: 1 };
    navigator.device.capture.captureVideo(cb, captureVideoError, options);
  }
}

function capturePhoto(cb){
  if (cb == null ){
    navigator.camera.getPicture(picOnSuccess, picOnFailure, {
      quality: 80,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      correctOrientation: true
    });
  }else{
    navigator.camera.getPicture(cb, picOnFailure, {
      quality: 80,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      correctOrientation: true
    });
  }
}

function getPhoto(cb){
  if (cb == null ){
    window.imagePicker.getPictures(
      function(results) {
        for (var i = 0; i < results.length; i++) {
          picOnSuccess(results[i]);
        }
      }, function (error) {
        console.log('Error: ' + error);
      }, {
        maximumImagesCount: 1,
        quality: 90
      }
    );
  }else{
    window.imagePicker.getPictures(
      function(results) {
        for (var i = 0; i < results.length; i++) {
          cb(results[i]);
        }
      }, function (error) {
        console.log('Error: ' + error);
      }, {
        maximumImagesCount: 1,
        quality: 90
      }
    );
  }
}

function getPhotos(cb){
  if (cb == null ){
    window.imagePicker.getPictures(
      function(results) {
        for (var i = 0; i < results.length; i++) {
          picOnSuccess(results[i]);
        }
      }, function (error) {
        console.log('Error: ' + error);
      }, {
        maximumImagesCount: 10,
        quality: 90
      }
    );
  }else{
    window.imagePicker.getPictures(
      function(results) {
        for (var i = 0; i < results.length; i++) {
          cb(results[i]);
        }
      }, function (error) {
        console.log('Error: ' + error);
      }, {
        maximumImagesCount: 10,
        quality: 90
      }
    );
  }
}

function captureVideoSuccess(mediaFile){
  sVideoData = mediaFile[0];
  console.log (sVideoData );
  var clipUrl = sVideoData.localURL;

  VideoService.saveVideo(sVideoData).success(function(data) {
    console.log (data );
    //$scope.clip = data;
    //$scope.$apply();
  }).error(function(data) {
    console.log('ERROR: ' + data);
  });
}

function captureVideoError(message){
  alert('Failed because: ' + message);
}

function picOnSuccess(mediaFile){
  sPicData  = mediaFile; //store image data in a variable
  if (document.getElementById('cameraPic')) {
    var image = document.getElementById('cameraPic');
    image.style.backgroundImage = "url('"+mediaFile+"')";
  }
  if (document.getElementById('attachment-container')) {
    document.getElementById('attachment-container').style.display = "block";
    document.getElementById('new-post').style.height = "80px";
  }
  return true;
}

function picOnFailure(message){
  alert('Failed because: ' + message);
}

// ----- upload video ------------
function videoUpload(mediaFile, onVideoUploadSuccess, onVideoUploadFail) {
  var path = mediaFile.toURL();
  var name='';
  var possible='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for(var i=0;i<5;i++){
    name+=possible.charAt(Math.floor(Math.random()*possible.length));
  }
  var ft = new FileTransfer();

  ft.onprogress = function(progressEvent){
    if (progressEvent.lengthComputable) {
      //loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
      var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
      console.log (perc );
      document.getElementById("progressBar").value = perc;
      document.getElementById("status").innerHTML = "<ion-spinner icon='android'></ion-spinner>" + perc + "%";
    } else {
      //loadingStatus.increment();
    }
  };

  var options = new FileUploadOptions();
  options.fileKey = "file";
  options.fileName = name;
  options.mimeType = "video/mov";
  options.chunkedMode = false;
  options.headers = {
    Connection: "close"
  };

  var params = {};
  params.controller = "user";
  params.action = "upload_user_video";

  options.params = params;

  console.log (options);
  ft.upload(path,
    encodeURI("http://kizombanight.com/zippcash/api/ajaxupload.php"),
    onVideoUploadSuccess,
    onVideoUploadFail,
    options,
    true
  );
}
// ----- upload video ------------
function videoThumbUpload(mediaFile, onVideoThumbUploadSuccess, onVideoThumbUploadFail) {
  var path = mediaFile.toURL();
  var name='';
  var possible='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for(var i=0;i<5;i++){
    name+=possible.charAt(Math.floor(Math.random()*possible.length));
  }
  var ft = new FileTransfer();

  var options = new FileUploadOptions();
  options.fileKey = "file";
  options.fileName = name;
  options.mimeType = "image/png";
  options.chunkedMode = false;
  options.headers = {
    Connection: "close"
  };

  var params = {};
  params.controller = "user";
  params.action = "upload_user_video_thumb";

  options.params = params;

  console.log (options);
  ft.upload(path,
    encodeURI("http://kizombanight.com/zippcash/api/ajaxupload.php"),
    onVideoThumbUploadSuccess,
    onVideoThumbUploadFail,
    options,
    true
  );
}
// ----- upload image ------------
function photoUpload(mediaFile, onPhotoUploadSuccess, onPhotoUploadFail) {
  var path = mediaFile.toURL();
  var name = mediaFile.name;
  var ft = new FileTransfer();

  var options = new FileUploadOptions();
  options.fileKey = "file";
  options.fileName = name;
  options.mimeType = "image/jpeg";
  options.chunkedMode = false;
  options.headers = {
    Connection: "close"
  };

  var params = {};
  params.controller = "user";
  params.action = "upload_user_file";

  options.params = params;

  ft.upload(path,
    encodeURI("http://kizombanight.com/zippcash/api/ajaxupload.php"),
    onPhotoUploadSuccess,
    onPhotoUploadFail,
    options,
    true
  );
}

// ----- upload profile image ------------
function profilePhotoUpload(mediaFile, onPhotoUploadSuccess, onPhotoUploadFail) {
  var path = mediaFile.toURL();
  var name = mediaFile.name;
  var ft = new FileTransfer();

  var options = new FileUploadOptions();
  options.fileKey = "file";
  options.fileName = name;
  options.mimeType = "image/jpeg";
  options.chunkedMode = false;
  options.headers = {
    Connection: "close"
  };

  var params = {};
  params.controller = "user";
  params.action = "upload_profile_pic";

  options.params = params;

  ft.upload(path,
    encodeURI("http://kizombanight.com/zippcash/api/ajaxupload.php"),
    onPhotoUploadSuccess,
    onPhotoUploadFail,
    options,
    true
  );
}
