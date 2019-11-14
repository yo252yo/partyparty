var ServerSocket = require('./server_socket.js');
var ModuleLoader = require('./module_loader.js');
var AllPlayers = require('./all_players.js');
var Scoreboard = require('./minigames/scoreboard.js');

var readyChecks = new Scoreboard();

var endGame = function(){
  console.log("Starting now");
  ModuleLoader.startMinigame();
}

// can maybe be factored with the score screen
var broadcastPlayerReadyCheck = function(){
  var result = "";
  var all_data = AllPlayers.getAllPpData();
  for (var i in all_data){
    var player = all_data[i];
    var name = player.player_id;
    var readied = "";
    if (readyChecks.getScore(name)) { readied = "X"; }
    result += player.player_id + "/" + player.color + ":" + readied + ",";
  }
  AllPlayers.broadcastMessage("MinigamePlayerReadyCheck", result);
}
broadcastPlayerReadyCheck();

var moduleListener = function(event, webSocket){
  switch(event.data.split("|")[0]) {
    case "MinigameReadyCheck":
      readyChecks.setScore(webSocket.pp_data.player_id, 1);
      broadcastPlayerReadyCheck();
      if (readyChecks.isFull()) { endGame(); }
      break;
    default:
  }
}
ServerSocket.plugModuleListener(moduleListener);
