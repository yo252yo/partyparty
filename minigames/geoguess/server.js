var ServerSocket = require('./server_socket.js');
var Request = require('request-promise');
var Cheerio = require('cheerio');
var AllPlayers = require('./all_players.js');
var MinigamesCommon = require('./minigames/common.js');
var Scoreboard = require('./minigames/scoreboard.js');

// Initialization
var lat = 0;
var lng = 0;
var game_ended = false;
var distances = new Scoreboard();
var coordinatesRecord = new Scoreboard();

// Game logic
// Game Logic
// Getting the riddle
var httpRequestCallback = function(html){
  try {
    var c = Cheerio.load(html);
    var locations= c('script').get()[6].children[0].data;
    var rx = /"lat":"([^"]*)","lng":"([^"]*)"/g;
    var parse = rx.exec(locations);
    lat = parse[1];
    lng = parse[2];

    AllPlayers.broadcastMessage("GeoguessCoords", lat + "," + lng);
    console.log("Coordinates:" + lat + "," + lng);

  } catch (error) {
    fetchCoordinates();
  }
}
var fetchCoordinates = function() {
  Request('https://randomstreetview.com/').then(httpRequestCallback);
}
fetchCoordinates();


// End game handling
var endGame = function(){
  if (game_ended) { return; }

  game_ended = true;
  coordinatesRecord.broadcastScores("GeoguessPlayerResults");
  MinigamesCommon.simpleOnePlayerWin(distances.getMinScore(), 10000);
}
setTimeout(endGame, 30000); // Deadline

// Listener
var moduleListener = function(event, webSocket){
  switch(event.data.split("|")[0]) {
    case "GeoguessAnswerProposal":
      var coordinates = event.data.split("|")[1];
      var p_lat = coordinates.split(",")[0];
      var p_lng = coordinates.split(",")[1];
      var distance = Math.sqrt(Math.pow(p_lat - lat,2) + Math.pow(p_lng - lng,2));

      distances.setScore(webSocket.pp_data.player_id, distance);
      coordinatesRecord.setScore(webSocket.pp_data.player_id, p_lat + "," + p_lng);

      if (distances.isFull()) { endGame(); }
      break;
    default:
  }
}

ServerSocket.plugModuleListener(moduleListener);
