var ServerSocket = require('./server_socket.js');
var AllPlayers = require('./all_players.js');
var MinigamesCommon = require('./minigames/common.js');
var Scoreboard = require('./minigames/scoreboard.js');

// Initialization
var game_ended = false;
var times = new Scoreboard();

// Game logic
setTimeout(function(){
  AllPlayers.broadcastMessage("ClickCubeCoordinates", Math.random() + "/" + Math.random());
}, 5000);

// End game handling
var endGame = function(){
  if (game_ended) { return; }
  
  game_ended = true;
  MinigamesCommon.simpleOnePlayerWin(times.getMinScore());
}
setTimeout(endGame, 15000); // Deadline

// Listener
var moduleListener = function(event, webSocket){ 
  switch(event.data.split("|")[0]) {
    case "DurationToClick":    
      times.setScore(webSocket.player_id, event.data.split("|")[1]);      
      if (times.isFull()) { endGame(); }
      break;
    default:
  }
}
ServerSocket.plugModuleListener(moduleListener);