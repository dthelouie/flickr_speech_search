

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

  $("#next-page").hide()
  $("#previous-page").hide()
  var diagnostic = $("#output")[0];
  var query = $("#query")[0];
  var queryCount = 0;
  var pageCount = 1;

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

  if (navigator.getUserMedia) {
    navigator.getUserMedia({audio: true}, onSuccess, onFail);
  }
  function onSuccess(){
    console.log("Ready!");
  }

  function onFail(){
    console.log("NOPE");
  }

  $("#start").click(function(){
    $("#mic-icon")[0].textContent = "mic";
    recognition.start();
    queryCount = 0;
    diagnostic.textContent = "Listening";
  })

  $("#end").click(function(){
    recognition.stop();
    $("#mic-icon")[0].textContent = "mic_none";
    diagnostic.textContent = "";
  })

  recognition.onresult = function(event){
    // recognition.stop()
    // $("#mic-icon")[0].textContent = "mic_none"
    pageCount = 1
    $("#previous-page").hide()
    var text = event.results[queryCount][0].transcript;

    var confidence = event.results[queryCount][0].confidence;
    console.log("Confidence: " + confidence);
    queryCount += 1;

    if (confidence < 0.65) {
      diagnostic.textContent = "Didn't quite catch that one";
    } else {
      $("#pictures").empty();
      query.textContent = text;
      diagnostic.textContent = "Speak again for a new query";
      getPictures(pageCount, text)
      $("#next-page").show()
    }
  };

  recognition.onend = function(){
    $("#mic-icon")[0].textContent = "mic_none"
    diagnostic.textContent = ""
  };

  recognition.onnomatch = function(event){
    diagnostic.textContent = "Try again!";
  };

  recognition.onerror = function(event) {
    diagnostic.textContent = "Didn't quite catch that one...";
  };

  $("#next-page").click(function(){
    pageCount += 1
    getPictures(pageCount, query.textContent)
    $("#previous-page").show()
  })

  $("#previous-page").click(function(){
    pageCount -= 1
    getPictures(pageCount, query.textContent)
    if (pageCount <= 1) {
      $("#previous-page").hide()
    }
  })

  var getPictures = function(pageNumber, speech){
    if (speech.includes(" ")){
      var speech = speech.replace(" ",",")
    }
    $("#pictures").empty();
    var resultsRequested = $("#results-requested")[0].value
    if (resultsRequested == ""){
      resultsRequested = 10
    }
    var idRequest = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ee629647787b1fa5744734a81c4419a3&text=" + speech + "&tags_mode=all&page=" + pageCount + "&per_page=" + resultsRequested + "&content_type=1&sort=relevance");
    idRequest.done(function(response){
      var results = response.children[0].children[0].children;
      for (var i = 0; i < results.length; i++) {
        var photo = results[i];
        // get photo id, make async call to that picture, append picture to #pictures inside img and a tags
        var id = photo.attributes.id.textContent;
        var secret = photo.attributes.secret.textContent;
        var pictureRequest = $.ajax({url: "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=ee629647787b1fa5744734a81c4419a3&photo_id=" + id + "&secret=" + secret, async: false})
          pictureRequest.done(function(response){
            var sourceUrl = response.children[0].children[0].getElementsByTagName("size")[5].attributes.source.textContent;
            var infoRequest = $.get("https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=ee629647787b1fa5744734a81c4419a3&photo_id=" + id + "&secret=" + secret);
              infoRequest.done(function(response){
                var info = response.children[0].children[0];
                var webUrl = info.getElementsByTagName("urls")[0].textContent;
                var name = info.children[1].textContent;
                $("#pictures").append("<div class='picture'> <a href='" + webUrl + "' target='_blank' >" + "<img src='" + sourceUrl + "' " + "alt='" + name + "'/></a></div>");
              })
          }
        )
      }
    })
  }
})
