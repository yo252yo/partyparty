console.log("Minigame TEST loaded");

setTimeout(function(){
  PLAYERS.broadcastMessage(Math.random() + "/" + Math.random());
}, 5000);

game_ended = false;

setTimeout(function(){
  if (! game_ended) {
    endGame();
  }
}, 15000);

// This IP based approach doesnt allow for two players on the same IP, to be replaced ASAP.
var players = PLAYERS.getAllIps();

var scores = {};

listener = function (event) {
  var score = event.data;
  var ip = event.target._sender._socket.remoteAddress;
  console.log(ip + " got " + score);
  scores[ip] = score;
  
  if (Object.keys(scores).length == players.length) {
    endGame();
  }  
}

SERVER_SOCKET.plugModuleListener(listener);

endGame = function(){
  game_ended = true;
  console.log("Game ended");
  var minScore = 20000;
  var argMinScore = "Noone";
  
  for (ip in scores){
    if (scores[ip] < minScore){
      minScore = scores[ip];
      argMinScore = ip;
    }
  }
  
  PLAYERS.broadcastMessage("Victory of " + argMinScore);
}