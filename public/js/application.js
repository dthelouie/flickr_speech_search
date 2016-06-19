

$(document).ready(function(){
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
  var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
  var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
  var grammar = "#JSGF V1.0;"

  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.continuous = true;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  var diagnostic = document.querySelector('#output');
  var query = document.querySelector('#query');
  var query_count = 0

  $("#start").click(function(){
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia

    if (navigator.getUserMedia) {
      navigator.getUserMedia({audio: true}, onSuccess, onFail);
    }
    function onSuccess(){
      $("#mic-icon")[0].textContent = "mic"
      recognition.start();
      diagnostic.textContent = "Listening"
    }

    function onFail(){
      console.log("NOPE")
    }
  })

  $("#end").click(function(){
    recognition.stop()
    $("#mic-icon")[0].textContent = "mic_none"
  })

  recognition.onresult = function(event){
    // recognition.stop()
    // $("#mic-icon")[0].textContent = "mic_none"

    var text = event.results[query_count][0].transcript
    if (text.includes(" ")){
      var speech = text.split(" ").join(",")
    } else {
      var speech = text
    }
    var confidence = event.results[query_count][0].confidence
    console.log("Confidence: " + confidence)
    query_count += 1

    if (confidence < 0.65) {
      diagnostic.textContent = "Didn't quite catch that one"
    } else {
      $("#pictures").empty()
      query.textContent = text
      diagnostic.textContent = "Speak again for a new query"
      var id_request = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ee629647787b1fa5744734a81c4419a3&text=" + speech + "&tags_mode=all&page=1&per_page=25&content_type=1&sort=relevance",
      function(response){
        var results = response.children[0].children[0].children
        for (var i = 0; i < results.length; i++) {
          var photo = response.children[0].children[0].children[i]
          // get photo id, make async call to that picture, append picture to #pictures inside img and a tags
          var id = photo.attributes.id.textContent
          var secret = photo.attributes.secret.textContent
          var picture_request = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=ee629647787b1fa5744734a81c4419a3&photo_id=" + id + "&secret=" + secret,
            function(response){
              var source_url = response.children[0].children[0].getElementsByTagName("size")[5].attributes.source.textContent
              // var info_request = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=ee629647787b1fa5744734a81c4419a3&photo_id=" + id + "&secret=" + secret,
              //   function(response){
              //     var info = response.children[0].children[0]
              //     var web_url = info.getElementsByTagName("urls")[0].textContent
              //     var name = info.children[1].textContent
                  $("#pictures").append("<div class='picture'> <a href='" + source_url + "'>" + "<img src='" + source_url + "' " + "alt='" + name + "'/></a></div>")
                // })
            }
          )
        }
      })
    }
  }

  recognition.onspeechstart = function(){
    $("#mic-icon")[0].textContent = "mic"
  }

  recognition.onspeechend = function(){
    // recognition.stop()
    // $("#mic-icon")[0].textContent = "mic_none"
  }


  recognition.onnomatch = function(event){
    diagnostic.textContent = "Try again!"
    // $("#mic-icon")[0].textContent = "mic_none"
  }

  recognition.onerror = function(event) {
    diagnostic.textContent = "Didn't quite catch that one..."
    // $("#mic-icon")[0].textContent = "mic_none"
  }

})
