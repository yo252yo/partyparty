import { LeastScoreWinner } from '../../classes/minigame_template.js';
import * as SocketManager from '../../modules/server_socket_manager.js';

var game = new LeastScoreWinner();

interface Enemy {
  x?: number;
  y?: number;
  dx?: number;
  dy?: number;
}


game.listener = function(object, socket){
  if (object.MyPosition){
    SocketManager.broadcast({PlayerPosition: object.MyPosition});
    console.log(`${socket.player_data().player_id}: ${object.MyPosition.x}    ${object.MyPosition.y}`);
    if(object.MyPosition.x > 0.92 && object.MyPosition.y > 0.92){
      game.scores.setScore(socket.player_data().player_id, (new Date()).getTime());
      if(game.scores.isFull()){
        game.end();
      }
    }
  }
}

// Game logic
var max_speed = 0.02 + Math.random() * 0.1;
var nb_enemies = 7 + Math.floor(Math.random() * 3);

var makeEnemy = function () {
  var r : Enemy = {};
  if(Math.random() > 0.4){
    r.x = 1;
    r.y = Math.random();
  } else {
    r.x = Math.random();
    r.y = 1;
  }
  r.dx = Math.random() * max_speed;
  r.dy = Math.random() * max_speed;
  return r;
}
var enemies = [];
for(var i = 0; i < nb_enemies; i++){
  enemies.push(makeEnemy());
}

SocketManager.broadcast({Enemies: enemies});


game.startWithDeadline(60000);
