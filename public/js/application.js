

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
    var request = $.get("https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=ee629647787b1fa5744734a81c4419a3&user_id=61896653@N06&format=json&per_page=20",
    function(response){
        results = response.blogs
        for (var i = 0; i < results.length, i ++){
          $("#pictures").append("<img src=" + results[i].url + "alt=" + results[i].name + "/>")
        }
    })

    request.done(function(response){
      console.log(response)
    })
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
