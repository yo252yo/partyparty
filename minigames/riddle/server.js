// Paths are relative because executed from module_loader.js
var Request = require('request-promise');
var Cheerio = require('cheerio');
var QuizMinigame = require('./minigames/quiz.js');

// Initialization
var game = new QuizMinigame();

// Game Logic
// Getting the riddle
var httpRequestCallback = function(html){
  try {
    var c = Cheerio.load(html);

    var question = c('.riddle-question > p').html().split("</strong>")[1];
    var answer = c('.riddle-answer > p').html().split("</strong>")[1];

    if(answer.length > 30){
      console.log("Too long, repick");
      requestRiddle();
    } else {
      game.setAnswer(question, answer);
    }

  } catch (error) {
    requestRiddle();
  }
}

var requestRiddle = function() {
  Request('https://www.goodriddlesnow.com/riddles/random').then(httpRequestCallback);
}

requestRiddle();
