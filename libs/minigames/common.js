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

  // Below this line will be split to a different file dedicated to question-based minigames when this file gets too long.
  // It'll also include stuff like create the answer form and focus

  static sanitizeForAnswerCheck(string){
    return string.replace(" ", "").replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase();
  }

  static obfuscateAll(string){
    return string.replace(/[a-zA-Z]/g, "-");
  }

  static obfuscatePartially(string){
    var answer_masked = MinigamesCommon.obfuscateAll(string).split("");
    var answer_split = string.split("");

    var clue = "";
    var hint = 0;
    // We want at least 3 hints...
    while(hint <= 3) {
      clue = "";
      hint = 0;

      for (var i = 0; i < answer_masked.length; i++){
        if (Math.random() < 0.15){
          clue += answer_split[i];
          hint ++;
        } else {
          clue += answer_masked[i];
        }
      }

      // ... unless the string is super short.
      if (string.length < 5) {
        break;
      }
    }

    return clue;
  }











}

module.exports = MinigamesCommon;
