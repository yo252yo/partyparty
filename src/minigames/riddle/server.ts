import { QuizzGame } from '../../classes/minigame_template.js';
import * as SocketManager from '../../modules/server_socket_manager.js';
import Request from 'request-promise';
import Cheerio from 'cheerio';

// Initialization
var game = new QuizzGame();

// Game Logic
// Getting the riddle
var httpRequestCallback = function(html: string){
  try {
    var c = Cheerio.load(html);

    var question = (c('.riddle-question > p').html() || "").split("</strong>")[1];
    var answer = (c('.riddle-answer > p').html() || "").split("</strong>")[1];

    if(answer.length > 30){
      console.log("Too long, repick");
      requestRiddle();
    } else {
      game.startWithAnswer(question, answer);
    }

  } catch (error) {
    requestRiddle();
  }
}

var requestRiddle = function() {
  Request('https://www.goodriddlesnow.com/riddles/random').then(httpRequestCallback);
}

requestRiddle();
