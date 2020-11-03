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
// Getting the quote
var httpRequestCallback = function(html){
  try {
    var c = Cheerio.load(html);
    var quote = c('.quote').children().first().text();
    var author = c('.author').children().first().next().text();

    var s = quote.split(',');
    if (s.length != 2)
      {
        fetchQuote();
      }
    else
    {
      proposals["dummy"] = [s[1].toLowerCase()];
      console.log(s[1]);
    AllPlayers.broadcastMessage("Quote", s[0] + ",<br>" + author);
    setTimeout(broadcastIdeas, 60000);
    }
  } catch (error) {
    fetchQuote();
  }
}

var fetchQuote = function() {
  Request('http://www.quotationspage.com/random.php',
    {"method": "POST",
    "body": "number=4&collection%5B%5D=mgm&collection%5B%5D=motivate&collection%5B%5D=classic&collection%5B%5D=coles&collection%5B%5D=lindsly&collection%5B%5D=poorc&collection%5B%5D=altq&collection%5B%5D=20thcent&collection%5B%5D=bywomen&collection%5B%5D=devils&collection%5B%5D=contrib"
    }).then(httpRequestCallback);
}

var broadcastIdeas = function() {
    AllPlayers.broadcastMessage("QuotePropos", JSON.stringify(proposals) );
    setTimeout(endGame, 35000);
}

fetchQuote();

var endGame = function(){
  if (game_ended) { return; }

  game_ended = true;
  MinigamesCommon.simpleOnePlayerWin(scores.getMaxScore());
}


var moduleListener = function(event, webSocket){
  switch(event.data.split("|")[0]) {
    case "ProposeQuote":
      var proposal = event.data.split("|")[1].toLowerCase();
      console.log(proposal);
      if(!proposals[webSocket.pp_data.player_id]){
        proposals[webSocket.pp_data.player_id] = [];
      }
      proposals[webSocket.pp_data.player_id].push(proposal);
      break;
    case "QuoteVote":
      var votefor = event.data.split("|")[1];
      if (votefor != "dummy") {
        scores.incrementScore(votefor);
      }
    default:
  }
}

ServerSocket.plugModuleListener(moduleListener);
