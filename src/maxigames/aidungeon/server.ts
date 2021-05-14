
import * as SocketManager from '../../modules/server_socket_manager.js';
import * as GameEngine from '../../modules/game_engine.js';
import { ServerSocket } from '../../classes/server_socket.js';

var assess_playability = function(){
  var scores = GameEngine.getScoreboard();

  for(var id in scores.scores) {
    if(scores.scores[id] > 0) {
      console.log("Yielding control to: " + id);
      scores.setScore(id, 0);
      SocketManager.broadcast({aidungeonLeader: id});
    }
  }
}

// This is a workaround, to do it properly we should wait until the client acks that he has the lead
var checker = setInterval(assess_playability, 1500);

ServerSocket.extraListener = function(object, socket) {
  if(object.setupRandomMinigame) {
    clearInterval(checker);
  }
};
