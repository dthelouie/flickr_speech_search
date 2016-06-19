

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
      var id_request = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ee629647787b1fa5744734a81c4419a3&text=" + speech + "&tags_mode=all&page=1&per_page=10&content_type=1&extras=url_o&sort=relevance",
      function(response){
        var results = response.children[0].children[0].children
        for (var i = 0; i < results.length; i++) {
          var photo = response.children[0].children[0].children[i]
          // get photo id, make async call to that picture, append picture to #pictures inside img and a tags
          var id = photo.attributes.id.textContent
          var secret = photo.attributes.secret.textContent

          var picture_request = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=ee629647787b1fa5744734a81c4419a3&photo_id=" + id + "&secret=" + secret,
            function(response){
              var source_url = response.children[0].children[0].children[5].attributes.source.textContent
              // var info_request = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=ee629647787b1fa5744734a81c4419a3&photo_id=" + id + "&secret=" + secret,
              //   function(response){
              //     var info = response.children[0].children[0]
              //     var web_url = info.getElementsByTagName("urls")[0].textContent
              //     var name = info.children[1].textContent
                  $("#pictures").append("<div><a href='" + source_url + "'>" + "<img src='" + source_url + "' " + "alt='" + name + "'/></a></div>")
                // })
            }
          )
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