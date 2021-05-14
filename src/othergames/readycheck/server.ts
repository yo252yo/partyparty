import { Scoreboard } from '../../classes/scoreboard.js';
import { ServerSocket } from '../../classes/server_socket.js';
import * as GamesLoader from '../../modules/games_loader.js';

var readyChecks = new Scoreboard();
console.log(readyChecks.scores);

var endGame = function(){
  console.log("#ReadyCheck: Starting pending minigame now");
  GamesLoader.startPendingMinigame();
}

readyChecks.broadcastScores();

ServerSocket.extraListener = function(object, socket){
  if (object.MinigameReadyCheck){
    var player_id = socket.player_data().player_id;
    if(player_id){
      readyChecks.setScore(player_id, 1);
    }
    readyChecks.broadcastScores();

    if (readyChecks.isFull()) { endGame(); }
  }
}
