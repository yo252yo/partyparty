var AllPlayers = require('../all_players.js');
var GameEngine = require('../game_engine.js');
var Scoreboard = require('../minigames/scoreboard.js');
var ModuleLoader = require('../module_loader.js');

class MinigamesCommon {
  static simpleOnePlayerWin(winner, delay_in_redirect){
    if (! winner){
      winner = Scoreboard.getDefaultWinner();
    } else {
      GameEngine.changeScore(winner, 1);
    }
    console.log("Minigame ended with winner: " + winner);

    AllPlayers.broadcastMessage("VictoryAnnouncement", winner);

    if (! delay_in_redirect) delay_in_redirect = 1000;
    setTimeout(function(){
      ModuleLoader.endMinigame();
    }, delay_in_redirect);
  }
}

module.exports = MinigamesCommon;
