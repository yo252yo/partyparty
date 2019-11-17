var ServerSocket = require('./server_socket.js');
var AllPlayers = require('./all_players.js');
var ModuleLoader = require('./module_loader.js');
var MinigamesCommon = require('./minigames/common.js');
var Scoreboard = require('./minigames/scoreboard.js');
var GameEngine = require('./game_engine.js');

// Initialization
var positions = new Scoreboard();
var turn = new Scoreboard();
var broadcastPositions = function (){
  if(ServerSocket.getPermanentModuleListener() != moduleListener){
    // We're unplugged, lets just die
    clearInterval(broadcastPositions);
    return;
  }

  AllPlayers.broadcastObject({messageKey:"SnakesLaddBoard", SnakesLaddBoard: board});
  positions.broadcastScores("SnakesLaddEveryonePosition");
}
// We broadcast the positions regularly because we're not plugged on listening to new players connections.
setInterval(broadcastPositions, 3000);

var board_size = 64;
var board;

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
        default:
            board.push({});
            break;
    }
  }
}
generateBoard();

// Game logic
var startMinigame = function () {
  turn = new Scoreboard();
  ModuleLoader.loadRandomMinigame();
}

var applyLandingTileEffect = function(position) {
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
  return Math.min(board_size, Math.max(0, new_pos));
}

var changePosition = function(player_id, increment) {
  var current_pos = positions.getScore(player_id);
  var new_pos = Math.min(board_size, Math.max(0, current_pos + increment));
  positions.setScore(player_id, applyLandingTileEffect(new_pos));
}

var normalRoll = function(player_id, socketMessage){
  var dice = socketMessage;

  if (turn.getScore(player_id) > 0){
    return "You've already rolled this turn";
  } else {
    turn.setScore(player_id, 1);
  }

  var roll = Math.ceil(Math.random() * dice);
  changePosition(player_id, roll);


  if (turn.isFull()){
    setTimeout(startMinigame, 5000);
  }

  return roll;
}

var bonusRoll = function(player_id, socketMessage){
  var dice = socketMessage.split("-");

  var score = GameEngine.getScore(player_id);
  if (score > 0) {
    GameEngine.changeScore(player_id, -1);
    GameEngine.broadcastPlayersList();
  } else {
    return "DONT TRY TO CHEAT ME YOURE TOO POOR JUST GET GOOD";
  }

  var roll = Math.ceil(Math.random() * dice[0]);
  if (dice[1]) { roll -= dice[1];}
  changePosition(player_id, roll);
  return roll;
}


// Listener
var moduleListener = function(event, webSocket){
  switch(event.data.split("|")[0]) {
    case "SnakesLaddRoll":
      var result = normalRoll(webSocket.pp_data.player_id, event.data.split("|")[1]);
      webSocket.send("SnakesLaddDiceRollResult|" + result);
      break;
    case "SnakesLaddRollBonus":
      var result = bonusRoll(webSocket.pp_data.player_id, event.data.split("|")[1]);
      webSocket.send("SnakesLaddDiceRollResult|" + result);
      break;
    default:
  }
}
ServerSocket.plugPermanentModuleListener(moduleListener);
