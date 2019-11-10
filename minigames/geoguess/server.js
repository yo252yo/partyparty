var Request = require('request-promise');
var Cheerio = require('cheerio');
var AllPlayers = require('./all_players.js');
var GameEngine = require('./game_engine.js');
var ModuleLoader = require('./module_loader.js');

var game_ended = false;

setTimeout(function(){
  if (! game_ended) {
    endGame();
  }
}, 30000);

var lat = 0;
var lng = 0;

// Asking a random latitude and longitude on street view results in a blank map. 
// To be sure that the location exist, we ask geoguessr.
var loadCoordinatesFromGeoguessr = function(){
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


var players = GameEngine.getAllIds();
var distances = {};

var listener = function (event, webSocket) {
  if (event.data.split("|")[0] == "GeoguessAnswerProposal"){
    var coordinates = event.data.split("|")[1];
    var p_lat = coordinates.split(",")[0];
    var p_lng = coordinates.split(",")[1];
    var distance = Math.sqrt(Math.pow(p_lat - lat,2) + Math.pow(p_lng - lng,2));
    var id = webSocket.player_id;
    console.log(id + " got " + distance + " at " + coordinates);
    
    distances[id] = distance;
    
    if (Object.keys(distances).length == players.length) {
      endGame();
    }
  }
}

ServerSocket.plugModuleListener(listener);

var endGame = function(){
  game_ended = true;
  console.log("Game ended");  
  
  var minDist = 20000;
  var argMinDist = "Noone";
  
  for (var id in distances){
    if (distances[id] < minDist){
      minDist = distances[id];
      argMinDist = id;
    }
  }
  
  if (argMinDist != "Noone"){
    GameEngine.changeScore(argMinDist, 1);
  }
  
  AllPlayers.broadcastMessage("VictoryAnnouncement", argMinDist);
  
  setTimeout(function(){
    ModuleLoader.endMinigame();
  }, 10000);
}