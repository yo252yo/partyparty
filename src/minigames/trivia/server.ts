import { QuizzGame } from '../../classes/minigame_template.js';
import * as SocketManager from '../../modules/server_socket_manager.js';
import Request from 'request-promise';

// Initialization
var game = new QuizzGame();

// Game Logic
// Getting the riddle
var httpRequestCallback = function(html: string){
  var json = JSON.parse(html);
  var question = json[0]['question'];
  var answer = json[0]['answer'];

  if(answer.length > 30){
    console.log("Too long, repick");
    requestRiddle();
  } else {
    console.log("Answer: " + answer);
    game.startWithAnswer(question, answer);
  }
}

var requestRiddle = function() {
  Request('https://www.randomtriviagenerator.com/questions?limit=6&page=1').then(httpRequestCallback);
}

requestRiddle();
