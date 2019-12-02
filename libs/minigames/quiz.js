var AllPlayers = require('../all_players.js');
var MinigamesCommon = require('../minigames/common.js');
var ServerSocket = require('../server_socket.js');

class QuizMinigame {
  static sanitizeForAnswerCheck(string){
    return string.replace(" ", "").replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase();
  }

  static obfuscateAll(string){
    return string.replace(/[a-zA-Z]/g, "-");
  }

  static obfuscatePartially(string){
    var answer_masked = QuizMinigame.obfuscateAll(string).split("");
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

  static giveFirstClue(game) {
    if (game._game_ended || !game.answer) { return; }
    AllPlayers.broadcastMessage("QuizzModuleClue", QuizMinigame.obfuscateAll(game.answer));
  }

  static giveSecondClue(game) {
    if (game._game_ended || !game.answer) { return; }
    AllPlayers.broadcastMessage("QuizzModuleClue", QuizMinigame.obfuscatePartially(game.answer));
  }

  static endGame(game, winner) {
    if (game._game_ended) { return; }
    game._game_ended = true;
    AllPlayers.broadcastMessage("AnswerAnnouncement", game.answer);
    MinigamesCommon.simpleOnePlayerWin(winner);
  }

  constructor() {
    this._game_ended = false;

    setTimeout(QuizMinigame.endGame, 30000, this); // Deadline

    ServerSocket.plugModuleListener(this.getEventListener());
  }

  setAnswer(question, answer){
    console.log("Question " + question);
    console.log("Answer:" + answer);

    AllPlayers.broadcastMessage("QuizzModuleQuestion", question);

    this.question = question;
    this.answer = answer;

    setTimeout(QuizMinigame.giveFirstClue, 5000, this);
    setTimeout(QuizMinigame.giveSecondClue, 10000, this);
  }

  getEventListener () {
    var game = this;
    var moduleListener = function(event, webSocket){
      switch(event.data.split("|")[0]) {
        case "ProposeQuizzModuleAnswer":
          var proposal = event.data.split("|")[1];
          console.log(webSocket.pp_data.player_id + " proposes " + proposal);

          if (proposal && game.answer && QuizMinigame.sanitizeForAnswerCheck(proposal) == QuizMinigame.sanitizeForAnswerCheck(game.answer)) {
            QuizMinigame.endGame(game, webSocket.pp_data.player_id);
          }
          break;
        default:
      }
    }
    return moduleListener;
  }
}

module.exports = QuizMinigame;
