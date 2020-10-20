
var sendAnswer = function() {
  var key = "GFeudPropose";
  console.log(key);
  if (document.forms.voting.elements.vote.value) {
    ClientSocket.send(key, document.forms.voting.elements.vote.value);
  }
}

var moduleListener = function(event){
  console.log(event);
  switch(event.data.split("|")[0]) {
    case "GFeudPrompt":
      var src = event.data.split("|")[1];
      document.getElementById("prompt").innerHTML = src;
      displayTimer(60);
      break;
    case "VictoryAnnouncement":
      alert(event.data);
      break;
    default:
  }

}

ClientSocket.plugModuleListener(moduleListener);
