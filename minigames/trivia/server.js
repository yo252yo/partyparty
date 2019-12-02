// Paths are relative because executed from module_loader.js
var Request = require('request-promise');
var Cheerio = require('cheerio');
var QuizMinigame = require('./minigames/quiz.js');

// Initialization
var game = new QuizMinigame();

// Game Logic
// Getting the riddle
var httpRequestCallback = function(html){
  var json = JSON.parse(html);
  var question = json[0]['question'];
  var answer = json[0]['answer'];

  if(answer.length > 30){
    console.log("Too long, repick");
    requestRiddle();
  } else {
    game.setAnswer(question, answer);
  }
}

var requestRiddle = function() {
  Request('https://www.randomtriviagenerator.com/questions?limit=6&page=1').then(httpRequestCallback);
}

requestRiddle();
