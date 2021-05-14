import { MostScoreWinner } from '../../classes/minigame_template.js';
import { ServerSocket } from '../../classes/server_socket.js';
import * as SocketManager from '../../modules/server_socket_manager.js';

type weightedLetter = [string, number];

// Initialization
var game = new MostScoreWinner();

var CheckWord = require('check-word');
var wordCheck = CheckWord('en');
var wordCheck2 = CheckWord('fr');
var game_started = false;
var num_letters = 13;

var letters : string[] = [];
var consonnes : weightedLetter[] = [['b',2], ['c',3], ['d',6], ['f',2], ['g',3], ['h',2], ['j',1], ['k',1], ['l',5], ['m',4], ['n',8], ['p',4], ['q',1], ['r',9], ['s',9], ['t',9], ['v',1], ['w',1], ['x',1], ['y',1], ['z',1],
['b',2], ['c',2], ['d',3], ['f',2], ['g',2], ['h',2], ['j',1], ['k',1], ['l',5], ['m',3], ['n',6], ['p',2], ['q',1], ['r',6], ['s',6], ['t',6], ['v',2], ['w',1], ['x',1], ['y',1], ['z',1],
];
var voyelles : weightedLetter[] = [['a',15], ['i',13], ['u',5], ['e',21], ['o',13],
['a',9], ['i',8], ['u',6], ['e',15], ['o',6],
];

// Game logic
var randLetter = function(array: weightedLetter[]){
  var total = 0;
  array.forEach(pair => total += pair[1]);
  var random = Math.floor(Math.random() * total);

  var index = 0;
  while (random >= 0){
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
  SocketManager.broadcast({DeslettresLettres: letters});
  if (letters.length == num_letters){
    game_started = true;
  }
}

var proposeAnswer = function(answer: string, socket: ServerSocket){
  if (game.ended) { return; }

  var proposal = answer.toLowerCase();
  if (! (wordCheck.check(proposal) || wordCheck2.check(proposal))){
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
  if (score <= game.scores.getScore(socket.player_data().player_id)){
    return;
  }

  socket.send({DeslettresYourword: proposal + " (" + score + ")"});
  SocketManager.broadcast({DeslettresWord: proposal + " (" + score + "," + socket.player_data().player_id +")"});
  game.scores.setScore(socket.player_data().player_id, score);
}


game.listener = function(object, socket){
  if (object.ProposeQuizzModuleAnswer){
    proposeAnswer(object.ProposeQuizzModuleAnswer, socket)
  }
  if (object.DesLettresAskConsonne){
    consonne();
  }
  if (object.DesLettresAskVoyelle){
    voyelle();
  }
}


game.startWithDeadline(75000);
