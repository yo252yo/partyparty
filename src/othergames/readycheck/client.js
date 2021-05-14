var sendReady = function (){
  ClientSocket.send({MinigameReadyCheck: ClientSocket.getPlayerId()});
  document.removeEventListener('click', sendReady);
}

document.addEventListener('click', sendReady);

var elem = document.createElement('div');
elem.innerHTML = '<div class="textbox_1" style="background-color:white;">READY CHECK (click anywhere)<div id="all_players_div"></div></div>';
document.body.appendChild(elem);

// Could be deleted but I'm leaving it here for example
ClientSocket.extraListener = function(object) {};
