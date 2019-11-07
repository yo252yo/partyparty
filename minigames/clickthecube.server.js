console.log("Minigame TEST loaded");

// Paths are relative because executed from module_loader.js
var ServerSocket = require('./server_socket.js');
var AllPlayers = require('./all_players.js');
var ModuleLoader = require('./module_loader.js');



setTimeout(function(){
  AllPlayers.broadcastMessage("ClickCubeCoordinates", Math.random() + "/" + Math.random());
}, 5000);

var game_ended = false;

setTimeout(function(){
  if (! game_ended) {
    endGame();
  }
}, 15000);

var players = AllPlayers.getAllIds();

var scores = {};

var listener = function (event, webSocket) {
  if (event.data.split("|")[0] == "DurationToClick"){
    var score = event.data.split("|")[1];
    var id = webSocket.player_id;
    console.log(id + " got " + score);
    scores[id] = score;
    
    if (Object.keys(scores).length == players.length) {
      endGame();
    }
  }
}

ServerSocket.plugModuleListener(listener);

var endGame = function(){
  game_ended = true;
  console.log("Game ended");
  var minScore = 20000;
  var argMinScore = "Noone";
  
  for (var id in scores){
    if (scores[id] < minScore){
      minScore = scores[id];
      argMinScore = id;
    }
  }
  
  AllPlayers.broadcastMessage("VictoryAnnouncement", argMinScore);
  ModuleLoader.endMinigame();
}