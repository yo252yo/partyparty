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

// Game logic
var loadCoordinatesFromGeoguessr = function(){
  // Asking a random latitude and longitude on street view results in a blank map. 
  // To be sure that the location exist, we ask geoguessr.
  Request.post('https://www.geoguessr.com/api/v3/games/', {
    json: {map: "trial-world", type: "standard"}
  }, (error, res, body) => {
    console.log("Request done!");
    if (error) {
      console.error("Error with geoguessr: " + error);
      loadCoordinatesFromGeoguessr();
    }
    // We cut the precision to avoid falling in an uncovered spot (discrepency between geoguessr and gps-coordinates.net)
    lat = body.rounds[0].lat.toFixed(4);
    lng = body.rounds[0].lng.toFixed(4);
    
    AllPlayers.broadcastMessage("GeoguessCoords", lat + "," + lng);
        
    console.log("Coordinates:" + lat + "," + lng);
  })
}
loadCoordinatesFromGeoguessr();

// End game handling
var endGame = function(){
  if (game_ended) { return; }
  
  game_ended = true;  
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
      
      distances.setScore(webSocket.player_id, distance);
      
      if (distances.isFull()) { endGame(); }
      break;
    default:
  }
}

ServerSocket.plugModuleListener(moduleListener);