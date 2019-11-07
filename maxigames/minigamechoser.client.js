var fillIdDiv = function(event){ 
  document.getElementById('player_id').innerHTML = ClientSocket.getPlayerId();
}

ClientSocket.plugModuleListener(fillIdDiv);