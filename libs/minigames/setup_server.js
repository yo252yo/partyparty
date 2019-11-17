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
  readyChecks.broadcastScores("MinigamePlayerReadyCheck");
}
broadcastPlayerReadyCheck();

var moduleListener = function(event, webSocket){
  switch(event.data.split("|")[0]) {
    case "MinigameReadyCheck":
      readyChecks.setScore(webSocket.pp_data.player_id, "X");
      broadcastPlayerReadyCheck("MinigamePlayerReadyCheck");
      if (readyChecks.isFull()) { endGame(); }
      break;
    default:
  }
}
ServerSocket.plugModuleListener(moduleListener);
