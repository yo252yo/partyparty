import * as SocketManager from '../../modules/server_socket_manager.js';
import * as GameEngine from '../../modules/game_engine.js';
import { ServerSocket } from '../../classes/server_socket.js';
import { Scoreboard } from '../../classes/scoreboard.js';
import * as GamesLoader from '../../modules/games_loader.js';

type tile = {
  forward?: number,
  backward?: number,
  tp?: number,
  bonus?: number,
};

// Initialization
// In this game, the score is the bonus dice roll (the thing the minigames influence), and the positions is a distinct board.
if(!GameEngine.memory.positions){
  GameEngine.memory.positions = new Scoreboard();
}
var rolledThisTurn = new Scoreboard();

var broadcastPositions = function() {
  SocketManager.broadcast({SnakesLaddBoard: board});
  GameEngine.memory.positions.broadcastScores("SnakesLaddEveryonePosition");
}
// We broadcast the positions regularly because we're not plugged on listening to new players connections.
var broadcastInterval = setInterval(broadcastPositions, 1500);

var board_size = 64;
var board : tile[];

var generateBoard = function() {
  board = [];
  for (var i=0; i < board_size; i++) {

    var x = Math.random();
    switch (true) {
        case (i == 0 || i == board_size - 1):
            board.push({});
            break;
        case (x < 0.2):
            var increment = Math.ceil(Math.random() * 4);
            board.push({forward: increment});
            break;
        case (x < 0.3):
            var increment = Math.ceil(Math.random() * 4);
            board.push({backward: increment});
            break;
        case (x < 0.35):
            var target = Math.ceil((board_size / 4) + Math.random() * (board_size / 2));
            if (target == i) { target ++;}
            board.push({tp: target});
            break;
        case (x < 0.4):
            var bonus = Math.ceil(2 * Math.random());
            board.push({bonus: bonus});
            break;
        default:
            board.push({});
            break;
    }
  }
}
generateBoard();

// Game logic
var startMinigame = function () {
  clearInterval(broadcastInterval);
  GamesLoader.setupRandomMinigame();
}

var applyLandingTileEffect = function(player_id:string, position:number) {
  var new_pos = position;
  var tile = board[position];
  if(tile.tp){
    new_pos = tile.tp;
  }
  if(tile.forward){
    new_pos += tile.forward;
  }
  if(tile.backward){
    new_pos -= tile.backward;
  }
  if(tile.bonus){
    GameEngine.getScoreboard().incrementScore(player_id, tile.bonus);
  }
  return Math.min(board_size-1, Math.max(0, new_pos));
}

var changePosition = function(player_id:string, increment:number) {
  var current_pos = GameEngine.memory.positions.getScore(player_id);
  var new_pos = Math.min(board_size-1, Math.max(0, current_pos + increment));
  GameEngine.memory.positions.setScore(player_id, applyLandingTileEffect(player_id, new_pos));
}

var normalRoll = function(player_id:string, socketMessage:string){
  var dice = parseInt(socketMessage);

  if (rolledThisTurn.getScore(player_id) > 0){
    return "You've already rolled this turn";
  } else {
    rolledThisTurn.setScore(player_id, 1);
  }

  var roll = Math.ceil(Math.random() * dice);
  changePosition(player_id, roll);


  if (rolledThisTurn.isFull()){
    setTimeout(startMinigame, 5000);
  }

  return roll.toString();
}

var bonusRoll = function(player_id:string, socketMessage:string){
  var dice = socketMessage.split("-");

  var score = GameEngine.getScoreboard().getScore(player_id);
  if (score > 0) {
    GameEngine.getScoreboard().incrementScore(player_id, -1);
    GameEngine.getScoreboard().broadcastScores();
  } else {
    return "DONT TRY TO CHEAT ME YOURE TOO POOR JUST GET GOOD";
  }

  var roll = Math.ceil(Math.random() * parseInt(dice[0]));
  if (dice[1]) { roll -= parseInt(dice[1]);}
  changePosition(player_id, roll);
  return roll.toString();
}



// Listener
ServerSocket.extraListener = function(object, socket) {
  var player_id = socket.player_data().player_id;
  if (!player_id){
    return;
  }
  if(object.SnakesLaddRoll) {
    var result = normalRoll(player_id, object.SnakesLaddRoll);
    socket.send({SnakesLaddDiceRollResult: result});
  }
  if(object.SnakesLaddRollBonus) {
    var result = bonusRoll(player_id, object.SnakesLaddRollBonus);
    socket.send({SnakesLaddDiceRollResult: result});
  }
};
