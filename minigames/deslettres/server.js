var AllPlayers = require('./all_players.js');
var Scoreboard = require('./minigames/scoreboard.js');
var MinigamesCommon = require('./minigames/common.js');
var CheckWord = require('check-word');

var wordCheck = CheckWord('en');
var scores = new Scoreboard();
var game_ended = false;

var letters = [];
var consonnes = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
var voyelles = ['a', 'i', 'u', 'e', 'o'];

// Game logic
var randLetter = function(array){
  var letter = array[Math.floor(Math.random() * array.length)];
  letters.push(letter);
}

var consonne = function(){
  randLetter(consonnes);
}
var voyelle = function(){
  randLetter(voyelles);
}

var initializeLetters = function(){
  for (var i = 0; i< 9; i++){
    if (Math.random() < 0.35){
      voyelle();
    } else{
      consonne();
    }
  }
  AllPlayers.broadcastMessage("DeslettresLettres", letters.join());
}
initializeLetters();

// End game handling
var endGame = function(){
  if (game_ended) { return; }

  game_ended = true;
  MinigamesCommon.simpleOnePlayerWin(scores.getMaxScore());
}
setTimeout(endGame, 60000); // Deadline

var moduleListener = function(event, webSocket){
  switch(event.data.split("|")[0]) {
    case "ProposeDesLettresAnswer":
      if (game_ended) { return; }

      var proposal = event.data.split("|")[1].toLowerCase();
      if (! wordCheck.check(proposal)){
        return;
      }
      var copy = proposal;
      for (var i in letters){
        copy = copy.replace(letters[i], '');
      }
      if (copy != ""){
        return;
      }
      var score = proposal.length;
      if (score <= scores.getScore(webSocket.pp_data.player_id)){
        return;
      }

      webSocket.send("DeslettresYourword|" + proposal + " (" + score + ")");
      scores.setScore(webSocket.pp_data.player_id, score);
      break;
    default:
  }
}

ServerSocket.plugModuleListener(moduleListener);
