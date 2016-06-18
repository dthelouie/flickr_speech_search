$(document).ready(function(){

  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
  var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
  var grammar = "#JSGF V1.0;";
  var recognition = new SpeechRecognition;
  var speechRecognitionList = new SpeechGrammarList;
  speechRecognitionList.addFromString(grammar);
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  var diagnostic = document.querySelector('#output')[0]



    $("#start").click(function(){
      // startRecording()
      if (navigator.getUserMedia) {
          navigator.getUserMedia({audio: true}, onSuccess, onFail);
        } else {
          console.log('navigator.getUserMedia not present');
        }

    })




    $("#stop").click(function(){
      // stopRecording()
        recognition.stop();
        recognition.onresult = function(event){
          var text = event.results[0][0].transcript;
          $("#query")[0].html(text);
        }
        recognition.onnomatch = function(event){
          diagnostic.textContent = "Can't find that!";
        }

        recognition.onerror = function(event){
          diagnostic.textContent = "Didn't quite catch that one...";
        }
      }
    )

      var onFail = function(e) {
        console.log('Rejected!', e);
      };

      var onSuccess = function(s) {
        recognition.start();

        recognition.onspeechend = function(){
          recognition.stop();
          recognition.onresult = function(event){
            var text = event.results[0][0].transcript;
            console.log(event);
            $("#query")[0].html(text);
          }
          recognition.onnomatch = function(event){
            diagnostic.textContent = "Can't find that!";
          }

          recognition.onerror = function(event){
            diagnostic.textContent = "Didn't quite catch that one..." + event.error;
          }
        }
      }

      window.URL = window.URL || window.webkitURL;
      navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
      //
      // var stream;
      // var audio = document.querySelector('audio');
      //
      // function startRecording() {
      //   if (navigator.getUserMedia) {
      //     navigator.getUserMedia({audio: true}, onSuccess, onFail);
      //   } else {
      //     console.log('navigator.getUserMedia not present');
      //   }
      // }
      //
      // function stopRecording() {
      //   recorder.stop();
      //   recorder.exportWAV(function(s){
      //     audio.src = window.URL.createObjectURL(s);
      //   })
      // }




    function hasGetUserMedia(){
      return !!(navigator.getUserMedia ||navigator.webkitGetUserMedia || navigator.mozGetUzerMedia || navigator.msGetUserMedia)
    }

    if (!hasGetUserMedia()){
      alert("NOT GONNA BE ABLE TO DO IT")
    }
  })
