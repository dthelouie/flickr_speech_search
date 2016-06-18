

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
    $("#pictures").empty()
    var text = event.results[0][0].transcript
    if (text.includes(" ")){
      var speech = text.split(" ").join(",")
    } else {
      var speech = text
    }
    var confidence = event.results[0][0].confidence
    console.log("Confidence: " + confidence)

    if (confidence < 0.65) {
      diagnostic.textContent = "didn't quite catch that one"
    } else {

      query.textContent = text
      diagnostic.textContent = "click again for a new query"
      var id_request = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ee629647787b1fa5744734a81c4419a3&text=" + speech + "&tags_mode=all&page=1&per_page=10&content_type=1&sort=relevance",
      function(response){
        var results = response.children[0].children[0].children
        for (var i = 0; i < results.length; i++) {
          // response is in XML, try to get JSON
          var photo = response.children[0].children[0].children[i]
          // get photo id, get owner id, make async call to that picture, append picture to #pictures
          var id = photo.attributes.id.textContent
          var picture_request = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=ee629647787b1fa5744734a81c4419a3&photo_id=" + id,
            function(response){
              var url = response.children[0].children[0].getElementsByTagName("urls")[0].textContent
              var name = response.children[0].children[0].children[1].textContent
              debugger
              $("#pictures").append("<a href='" + url + "'>" + "'<img src='" + url + "' " + "alt='" + name + "'/></a>")

            })


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
