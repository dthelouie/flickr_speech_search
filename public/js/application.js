

$(document).ready(function(){
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
  var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
  var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
  var grammar = "#JSGF V1.0;"

  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  var diagnostic = document.querySelector('#output');
  var query = document.querySelector('#query');

  $("#start").click(function(){
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia

    if (navigator.getUserMedia) {
      navigator.getUserMedia({audio: true}, onSuccess, onFail);
    }
    function onSuccess(){
      recognition.start();
    }

    function onFail(){
      console.log("NOPE")
    }
  })

  recognition.onresult = function(event){
    recognition.stop()
    var text = event.results[0][0].transcript
    query.textContent = text
    diagnostic.textContent = ""
  }

  recognition.onspeechend = function(){
    recognition.stop()
  }


  recognition.onnomatch = function(event){
    diagnostic.textContent = "nope!"
  }

  recognition.onerror = function(event) {
    diagnostic.textContent = "didn't quite hear that one..."
  }

})
