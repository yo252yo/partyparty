var all_players_ids = "";

var refreshDivContent = function(){
  document.getElementById('player_id_div').innerHTML = ClientSocket.getPlayerId();
  document.getElementById('player_id_div').style['color'] = ClientSocket.getPlayerColor();
  document.getElementById('player_id_div').style['background-color'] = invertColor(ClientSocket.getPlayerColor());
  if (! all_players_ids) {all_players_ids = ClientSocket.getPlayerId()};
  document.getElementById('all_players_div').innerHTML = all_players_ids;

}

var listener = function(event){
  try { // only expects objects
    var object = JSON.parse(event.data);
    if (object.messageKey != "CurrentPlayerList"){ return ""; }
    all_players_ids = getPlayerListStringFromSocketObject(object);
    refreshDivContent();
  }
  catch(error) { }
}

ClientSocket.plugModuleListener(listener);
