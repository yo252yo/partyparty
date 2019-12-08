var AllPlayers = require('./all_players.js');
var Scoreboard = require('./minigames/scoreboard.js');
var MinigamesCommon = require('./minigames/common.js');
var CheckWord = require('check-word');

var wordCheck = CheckWord('en');
var scores = new Scoreboard();
var game_ended = false;
var game_started = false;
var num_letters = 8;

var letters = [];
var consonnes = [['b',2], ['c',3], ['d',6], ['f',2], ['g',3], ['h',2], ['j',1], ['k',1], ['l',5], ['m',4], ['n',8], ['p',4], ['q',1], ['r',9], ['s',9], ['t',9], ['v',1], ['w',1], ['x',1], ['y',1], ['z',1]];
var voyelles = [['a',15], ['i',13], ['u',5], ['e',21], ['o',13]];

// Game logic
var randLetter = function(array){
  var total = 0;
  array.forEach(pair => total += pair[1]);
  var random = Math.floor(Math.random() * total);

  var index = 0;
  while (random > 0){
    random -= array[index][1];
    index ++;
  }
  index --; // We overshoot since we're stopping when random gets negative.

  letters.push(array[index][0]);
}

var consonne = function(){
  if (game_started){ return; }
  randLetter(consonnes);
  checkLetters();
}
var voyelle = function(){
  if (game_started){ return; }
  randLetter(voyelles);
  checkLetters();
}

var checkLetters = function(){
  AllPlayers.broadcastMessage("DeslettresLettres", letters.join());
  if (letters.length == num_letters){
    game_started = true;
  }
}

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
    case "DesLettresAskConsonne":
      consonne();
      break;
    case "DesLettresAskVoyelle":
      voyelle();
      break;
    default:
  }
}

ServerSocket.plugModuleListener(moduleListener);
