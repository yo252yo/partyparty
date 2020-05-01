
var sendAnswer = function() {
  ClientSocket.send("CaptionStockVote", document.forms.voting.elements.vote.value);
}

var moduleListener = function(event){
  console.log(event);
  switch(event.data.split("|")[0]) {
    case "CaptionStockImg":
      var src = event.data.split("|")[1];
      document.getElementById("cs_img").src = src;
      displayTimer(30);
      break;
    case "CaptionStockPropos":
      var proposals = JSON.parse(event.data.split("|")[1]);
      var html = "Pick your favorite answer:";
      html += "<form name='voting'>";
      for(var id in proposals) {
        if (id == ClientSocket.getPlayerId()) { html += "<i>"; }
        else { html += "<input type='radio' name='vote' value='" + id + "'>"; }
        html += proposals[id] + "<br />";
        if (id == ClientSocket.getPlayerId()) { html += "</i>"; }
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
