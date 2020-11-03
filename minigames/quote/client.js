
var sendAnswer = function() {
  if (document.forms.voting.elements.vote.value) {
    ClientSocket.send("QuoteVote", document.forms.voting.elements.vote.value);
  }
}

var moduleListener = function(event){
  console.log(event);
  switch(event.data.split("|")[0]) {
    case "Quote":
      var src = event.data.split("|")[1];
      document.getElementById("quote").innerHTML = src;
      displayTimer(60);
      break;
    case "QuotePropos":
      var proposals = JSON.parse(event.data.split("|")[1]);
      console.log(proposals);
      var html = "Pick your favorite answer:";
      html += "<form name='voting'>";
      for(var id in proposals) {
        for (var i in proposals[id]){
          if (id == ClientSocket.getPlayerId()) { html += "<i>"; }
          else { html += "<input type='radio' name='vote' value='" + id + "'>"; }
          html += proposals[id][i] + "<br />";
          if (id == ClientSocket.getPlayerId()) { html += "</i>"; }
        }
      }
      html += "</form>";
      document.getElementById("board").innerHTML = html;
      displayTimer(30);
      setTimeout(sendAnswer, 30000);
      break;
    case "VictoryAnnouncement":
      alert(event.data);
      break;
    default:
  }



}

ClientSocket.plugModuleListener(moduleListener);
