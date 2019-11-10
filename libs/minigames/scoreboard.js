var AllPlayers = require('../all_players.js');
var GameEngine = require('../game_engine.js');
var ModuleLoader = require('../module_loader.js');
var ServerSocket = require('../server_socket.js');
var MinigamesCommon = require('./common.js');

class Scoreboard {
  
  
  constructor() {
    this.players = GameEngine.getAllIds();
    this.scores = {};
  }
  
  getMinScore() {
    var min;
    var argMin = MinigamesCommon.getDefaultWinner();
    
    if (this.scores.length == 0){
      return argMin;
    }
    
    for (var id in this.scores){
      if (!min || this.scores[id] < min){
        min = this.scores[id];
        argMin = id;
      }
    }
    
    return argMin;    
  }
  
  setScore(player, score) {
    this.scores[player] = score;
    console.log(player + " got " + score);
  }
  
  isFull() {
    return Object.keys(this.scores).length == this.players.length;
  }

}

module.exports = Scoreboard;