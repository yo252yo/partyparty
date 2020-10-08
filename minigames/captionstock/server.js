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
    var title = "Unbeteitelt";
    try {
      title = c('.title.outbound')[0].children[0].data;
    } catch (e){ console.log(e);}
    console.log(title);
    proposals["dummy"] = [title.toLowerCase()];

    if (!src){
      requestImg();
    }

    AllPlayers.broadcastMessage("CaptionStockImg", src);
    setTimeout(broadcastIdeas, 60000);
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
      if(!proposals[webSocket.pp_data.player_id]){
        proposals[webSocket.pp_data.player_id] = [];
      }
      proposals[webSocket.pp_data.player_id].push(proposal);
      break;
    case "CaptionStockVote":
      var votefor = event.data.split("|")[1];
      if (votefor != "dummy") {
        scores.incrementScore(votefor);
      }
    default:
  }
}

ServerSocket.plugModuleListener(moduleListener);
