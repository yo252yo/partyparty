var all_players_ids = "";


var refreshDivContent = function(){
  document.getElementById('player_id_div').innerHTML = ClientSocket.getPlayerId();
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
        return a[1]<b[1]?1:(a[1]>b[1]?-1:0);
    });
    
    all_players_ids = "";
    for (var i in players_with_scores) {
      if (players_with_scores[i][0] == ClientSocket.getPlayerId())  all_players_ids += "<b>";
      all_players_ids += players_with_scores[i][1] + " - " + players_with_scores[i][0] + "<br />";
      if (players_with_scores[i][0] == ClientSocket.getPlayerId())  all_players_ids += "</b>";
    }
  }
  
  refreshDivContent(); 
}

ClientSocket.plugModuleListener(listener);