var all_players_ids = "";

var refreshDivContent = function(){
  document.getElementById('player_id_div').innerHTML = ClientSocket.getPlayerId();
  document.getElementById('player_id_div').style['color'] = ClientSocket.getPlayerColor();
  document.getElementById('player_id_div').style['background-color'] = invertColor(ClientSocket.getPlayerColor());
  if (! all_players_ids) {all_players_ids = ClientSocket.getPlayerId()};
  document.getElementById('all_players_div').innerHTML = all_players_ids;

}

var listener = function(event){
  if (event.data.split("|")[0] == "CurrentPlayerList"){
    var all_players_ids_raw = event.data.split("|")[1].split(",");
    var players_with_scores = [];
    for (var i in all_players_ids_raw) {
      players_with_scores.push(all_players_ids_raw[i].split(":"));
    }

    players_with_scores.sort(function(a,b) {
        return parseInt(a[1])<parseInt(b[1])?1:(parseInt(a[1])>parseInt(b[1])?-1:0);
    });

    all_players_ids = "";
    for (var i in players_with_scores) {
      var id =  players_with_scores[i][0].split("/")[0];
      var color =  players_with_scores[i][0].split("/")[1];

      all_players_ids += "<span style='color:" + color;
      all_players_ids += "; background-color:" + invertColor(color);
      if (id == ClientSocket.getPlayerId()) {  all_players_ids += "; font-weight:bold;"};
      all_players_ids += "'>" + players_with_scores[i][1] + " - " +  id + "</span><br />";
    }
  }

  refreshDivContent();
}

ClientSocket.plugModuleListener(listener);
