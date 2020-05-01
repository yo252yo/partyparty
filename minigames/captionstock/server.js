// Paths are relative because executed from module_loader.js
var Request = require('request-promise');
var Cheerio = require('cheerio');
var Scoreboard = require('./minigames/scoreboard.js');
var MinigamesCommon = require('./minigames/common.js');

// Initialization
var game_ended = false;
var proposals = {};
var scores = new Scoreboard();

// Game Logic
// Getting the riddle
var httpRequestCallback = function(html){
  try {
    var c = Cheerio.load(html);
    var src = c('.preview')[0].attribs.src;
    if (!src){
      requestImg();
    }

    AllPlayers.broadcastMessage("CaptionStockImg", src);
    setTimeout(broadcastIdeas, 30000);
  } catch (error) {
    requestImg();
  }
}

var requestImg = function() {
  Request('https://old.reddit.com/r/wtfstockphotos/random').then(httpRequestCallback);
}

var broadcastIdeas = function() {
    AllPlayers.broadcastMessage("CaptionStockPropos", JSON.stringify(proposals) );
    setTimeout(endGame, 35000);
}

requestImg();



var endGame = function(){
  if (game_ended) { return; }

  game_ended = true;
  MinigamesCommon.simpleOnePlayerWin(scores.getMaxScore());
}


var moduleListener = function(event, webSocket){
  switch(event.data.split("|")[0]) {
    case "ProposeCaption":
      var proposal = event.data.split("|")[1].toLowerCase();
      proposals[webSocket.pp_data.player_id] = proposal;
      break;
    case "CaptionStockVote":
      var votefor = event.data.split("|")[1];
      scores.incrementScore(votefor);
    default:
  }
}

ServerSocket.plugModuleListener(moduleListener);
