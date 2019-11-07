// Paths are relative because executed from module_loader.js
var Request = require('request-promise');
var Cheerio = require('cheerio');
var AllPlayers = require('./all_players.js');
var ModuleLoader = require('./module_loader.js');
var ServerSocket = require('./server_socket.js');

var answer = "";
var game_ended = false;

setTimeout(function(){
  if (! game_ended) {
    endGame();
  }
}, 30000);

setTimeout(function(){
  if (! game_ended && answer) {
    giveFirstClue();
  }
}, 10000);

setTimeout(function(){
  if (! game_ended && answer) {
    giveSecondClue();
  }
}, 20000);

var giveFirstClue = function() {
  var clue = answer.replace(/[a-zA-Z]/g, "-");
  AllPlayers.broadcastMessage("RiddleClue", clue);
}

var giveSecondClue = function() {
  var answer_masked = answer.replace(/[a-zA-Z]/g, "-").split("");
  var answer_split = answer.split("");
  
  var clue = "";
  var hint = 0;
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
    
    if (answer.length < 5) {
      break;
    }
  }
  
  AllPlayers.broadcastMessage("RiddleClue", clue);
}

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

var endGame = function(winner){
  game_ended = true;
  console.log("Game ended");
  if (! winner){
    winner = "Noone";
  }
  
  AllPlayers.broadcastMessage("VictoryAnnouncement", winner);
  AllPlayers.broadcastMessage("AnswerAnnouncement", answer);
  ModuleLoader.endMinigame();
}

function sanitize(string){
  return string.replace(" ", "").replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase();
}

var listener = function (event, webSocket) {
  if (event.data.split("|")[0] == "ProposeRiddleAnswer"){
    var proposal = event.data.split("|")[1];
    console.log(webSocket.player_id + " proposes " + proposal);
    
    if (sanitize(proposal) == sanitize(answer)) {
      endGame(webSocket.player_id);
    }
  }
}



ServerSocket.plugModuleListener(listener);
