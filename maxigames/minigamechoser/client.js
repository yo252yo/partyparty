var all_players_ids = "";


var refreshDivContent = function(){
  document.getElementById('player_id_div').innerHTML = ClientSocket.getPlayerId();
  if (! all_players_ids) {all_players_ids = ClientSocket.getPlayerId()};
  document.getElementById('all_players_div').innerHTML = all_players_ids; 
  
}

var listener = function(event){ 
  if (event.data.split("|")[0] == "CurrentPlayerList"){
    all_players_ids = event.data.split("|")[1];
  }
  
  refreshDivContent(); 
}

ClientSocket.plugModuleListener(listener);