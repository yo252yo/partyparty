import { LeastScoreWinner } from '../../classes/minigame_template.js';
import * as SocketManager from '../../modules/server_socket_manager.js';

var game = new LeastScoreWinner();

game.listener = function(object, socket){
  if (object.MyPosition){
    SocketManager.broadcast({PlayerPosition: object.MyPosition});
    if(object.MyPosition.x > 0.95 && object.MyPosition.y > 0.95){
      game.scores.setScore(socket.player_data().player_id, (new Date()).getTime());
      if(game.scores.isFull()){
        game.end();
      }
    }
  }
}

// Game logic

game.startWithDeadline(60000);
