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
}, 25000);

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
  return string.replace(" ", "").toLowerCase();
}

var listener = function (event, webSocket) {
  if (event.data.split("|")[0] == "ProposeRiddleAnswer"){
    var proposal = event.data.split("|")[1];
    console.log(webSocket.player_id + " proposes " + proposal);
    
    if (sanitize(proposal) == sanitize(answer) || sanitize(proposal) + "." == sanitize(answer)) {
      endGame(webSocket.player_id);
    }
  }
}



ServerSocket.plugModuleListener(listener);
