

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
    var split = text.split(" ").join(",")
    var confidence = event.results[0][0].confidence
    console.log("Confidence: " + confidence)

    if (confidence < 0.65) {
      diagnostic.textContent = "didn't quite catch that one"
    } else {

      query.textContent = text
      diagnostic.textContent = "click again for a new query"
      var request = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ee629647787b1fa5744734a81c4419a3&tags=" + split + "tags_mode=any&page=1&per_page=10",
      function(response){
        console.log(response)
        debugger
        var results = response.children[0].children[0].children
        for (var i = 0; i < results.length; i++) {
          var photo = response.children[0].children[0].children[i]
          var id = photo.id
          $("#pictures").append("<img src=" + results[i].url + "alt=" + results[i].name + "/>")
        }
      })
    }
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
