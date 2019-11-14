var sendReady = function (){
  ClientSocket.send("MinigameReadyCheck", ClientSocket.getPlayerId());
  document.removeEventListener('click', sendReady);
}

document.addEventListener('click', sendReady);


var elem = document.createElement('div');
elem.innerHTML = '<div class="textbox_1" style="background-color:white;">READY CHECK (click anywhere)<div id="readycheck"></div></div>';
document.body.appendChild(elem);


var moduleListener = function(event){
  switch(event.data.split("|")[0]) {
    case "MinigamePlayerReadyCheck":

        // can maybe be factored with the score screen
        var all_players_ids_raw = event.data.split("|")[1].split(",");
        var players_with_scores = [];
        for (var i in all_players_ids_raw) {
          players_with_scores.push(all_players_ids_raw[i].split(":"));
        }
        console.log("AAAAAAAAAA");

        var all_players_ids = "";
        for (var i in players_with_scores) {
          if (players_with_scores[i] == "") {
            continue;
          }
          var id =  players_with_scores[i][0].split("/")[0];
          var color =  players_with_scores[i][0].split("/")[1];

          all_players_ids += "<span style='color:" + color;
          all_players_ids += "; background-color:" + invertColor(color);
          if (id == ClientSocket.getPlayerId()) {  all_players_ids += "; font-weight:bold;"};
          all_players_ids += "'>" + id + ": " + players_with_scores[i][1] + "</span><br />";
        }
        console.log(all_players_ids);

        document.getElementById('readycheck').innerHTML = all_players_ids;

      break;
    default:
  }
}

ClientSocket.plugModuleListener(moduleListener);
