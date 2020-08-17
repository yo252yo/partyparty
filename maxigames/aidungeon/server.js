var ServerSocket = require('./server_socket.js');
var GameEngine = require('./game_engine.js');

var assess_playability = function(){
  var scores = GameEngine.getAllScores().scores;
  for(var id in scores) {
    if(scores[id] > 0) {
      console.log("Yielding control to: " + id);
      GameEngine.changeScore(id, -1);
      AllPlayers.broadcastMessage("aidungeonLeader", id);
    }
  }
}

setInterval(assess_playability, 1500);
