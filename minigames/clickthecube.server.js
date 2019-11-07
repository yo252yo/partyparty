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

// This IP based approach doesnt allow for two players on the same IP, to be replaced ASAP.
var players = AllPlayers.getAllIps();

var scores = {};

var listener = function (event) {
  if (event.data.split("|")[0] == "DurationToClick"){
    var score = event.data.split("|")[1];
    var ip = event.target._sender._socket.remoteAddress;
    console.log(ip + " got " + score);
    scores[ip] = score;
    
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
  
  for (var ip in scores){
    if (scores[ip] < minScore){
      minScore = scores[ip];
      argMinScore = ip;
    }
  }
  
  AllPlayers.broadcastMessage("VictoryAnnouncement", argMinScore);
  ModuleLoader.endMinigame();
}