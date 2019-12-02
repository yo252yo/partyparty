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

    var question = c('.query-title-link').html();
    var answer = c('.su-spoiler-content').html();

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
  Request('https://trivia.fyi/random-trivia-questions/').then(httpRequestCallback);
}

requestRiddle();
