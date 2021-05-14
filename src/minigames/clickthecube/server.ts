import { LeastScoreWinner } from '../../classes/minigame_template.js';
import * as SocketManager from '../../modules/server_socket_manager.js';

var game = new LeastScoreWinner();

game.listener = function(object, socket){
  if (object.DurationToClick){
    game.scores.setScore(socket.player_data().player_id, object.DurationToClick);
    if (game.scores.isFull()) { game.end(); }
  }
}

game.startWithDeadline(15000);

// Game logic
setTimeout(function(){
    SocketManager.broadcast({
      ClickCubeCoordinates: {x: Math.random(), y: Math.random()}
    });
}, 5000);
