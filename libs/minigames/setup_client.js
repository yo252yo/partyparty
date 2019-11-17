var sendReady = function (){
  ClientSocket.send("MinigameReadyCheck", ClientSocket.getPlayerId());
  document.removeEventListener('click', sendReady);
}

document.addEventListener('click', sendReady);


var elem = document.createElement('div');
elem.innerHTML = '<div class="textbox_1" style="background-color:white;">READY CHECK (click anywhere)<div id="readycheck"></div></div>';
document.body.appendChild(elem);

console.log("AAAAAAA");

var moduleListener = function(event){
  try { // only expects objects
    var object = JSON.parse(event.data);
    if (object.messageKey != "MinigamePlayerReadyCheck"){ return ""; }
    var all_players_ids = getPlayerListStringFromSocketObject(object);
    document.getElementById('readycheck').innerHTML = all_players_ids;
  }
  catch(error) { }
}

ClientSocket.plugModuleListener(moduleListener);
