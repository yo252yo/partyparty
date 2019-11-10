// Paths are relative because executed from module_loader.js
var Request = require('request-promise');
var Cheerio = require('cheerio');
var AllPlayers = require('./all_players.js');
var ServerSocket = require('./server_socket.js');
var MinigamesCommon = require('./minigames/common.js');

// Initialization
var answer = "";
var game_ended = false;


// Game Logic
// Getting the riddle
var httpRequestCallback = function(html){
  try {
    var c = Cheerio.load(html);
    
    var question = c('.riddle-question > p').html().split("</strong>")[1]; 
    answer = c('.riddle-answer > p').html().split("</strong>")[1];
    
    if(answer.length > 30){
      console.log("Too long, repick");
      requestRiddle();      
    } else {    
      console.log("Question " + question);  
      AllPlayers.broadcastMessage("RiddleQuestion", question);
      
      console.log("Answer:" + answer);
    }
    
  } catch (error) {
    requestRiddle();
  }
}

var requestRiddle = function() {
  Request('https://www.goodriddlesnow.com/riddles/random').then(httpRequestCallback); 
}

requestRiddle();

// Giving out the clues
var giveFirstClue = function() {
  if (game_ended || !answer) { return; }
  AllPlayers.broadcastMessage("RiddleClue", MinigamesCommon.obfuscateAll(answer));
}
setTimeout(giveFirstClue, 10000);

var giveSecondClue = function() {
  if (game_ended || !answer) { return; }
  AllPlayers.broadcastMessage("RiddleClue", MinigamesCommon.obfuscatePartially(answer));
}
setTimeout(giveSecondClue, 20000);

// End game handling
var endGame = function(winner){
  if (game_ended) { return; }
  game_ended = true;
  AllPlayers.broadcastMessage("AnswerAnnouncement", answer);
  MinigamesCommon.simpleOnePlayerWin(winner);
}
setTimeout(endGame, 30000); // Deadline

// Listener
var moduleListener = function(event, webSocket){ 
  switch(event.data.split("|")[0]) {
    case "ProposeRiddleAnswer":
      var proposal = event.data.split("|")[1];
      console.log(webSocket.player_id + " proposes " + proposal);
      
      if (MinigamesCommon.sanitizeForAnswerCheck(proposal) == MinigamesCommon.sanitizeForAnswerCheck(answer)) {
        endGame(webSocket.player_id);
      }
      break;
    default:
  }
}
ServerSocket.plugModuleListener(moduleListener);
