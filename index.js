$(document).ready(function(){

    $("#start").click(function(){
      startRecording()
    })

    $("#stop").click(function(){
      stopRecording()
    })

      var onFail = function(e) {
        console.log('Rejected!', e);
      };

      var onSuccess = function(s) {
        stream = s;
      }

      window.URL = window.URL || window.webkitURL;
      navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

      var stream;
      var audio = document.querySelector('audio');

      function startRecording() {
        if (navigator.getUserMedia) {
          navigator.getUserMedia({audio: true}, onSuccess, onFail);
        } else {
          console.log('navigator.getUserMedia not present');
        }
      }

      function stopRecording() {
        audio.src = window.URL.createObjectURL(stream);
      }

    function hasGetUserMedia(){
      return !!(navigator.getUserMedia ||navigator.webkitGetUserMedia || navigator.mozGetUzerMedia || navigator.msGetUserMedia)
    }

    if (!hasGetUserMedia()){
      alert("NOT GONNA BE ABLE TO DO IT")
    }
  })
