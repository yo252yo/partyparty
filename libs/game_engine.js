var Fs = require('fs');
var AllPlayers = require('./all_players.js');

class GameEngine {
  static getScore(id) {
    if (id in GameEngine.scores){
      return GameEngine.scores[id];
    }
    return 0;
  }
  
  static changeScore(id, increment) {
    GameEngine.scores[id] = GameEngine.getScore(id) + increment;
  }
  
  static initializeModule(){
    GameEngine.usedIds = [];
    GameEngine.theme = "";
    GameEngine.pickTheme();
    
    GameEngine.scores = {};    
  }
  
  static resetWholeGame(){
    console.log("RESETING GAME");
    GameEngine.initializeModule();
    
    AllPlayers.doToAllClients(function (client) {
      client.player_id = GameEngine.getNewId();
      
      var ServerSocket = require('./server_socket.js');
      ServerSocket.handleNewPlayer(client);
    });      
  }
  
  static getAllIds() {
    var result  = [];
    
    var all_ids = AllPlayers.getAllIds();
    for (var i in all_ids){
      result.push(all_ids[i] + ":" + parseInt(GameEngine.getScore(all_ids[i])));
    }
    
    return result;
  }
  
  static getNewId(){
    var nouns = require('../themes/nouns/' + GameEngine.theme + '.js');
    var modifiers = require('../themes/modifiers.js');
    var rollProposal = function(){
      return modifiers[Math.floor(Math.random()*modifiers.length)] + nouns[Math.floor(Math.random()*nouns.length)];
    }
    
    var proposal = rollProposal();
    while (proposal in GameEngine.usedIds){
      proposal = rollProposal();
    }
    GameEngine.usedIds.push(proposal);
    return proposal;
  }
  
  static pickTheme() {
    var themes = Fs.readdirSync("./themes/nouns/");
    GameEngine.theme = themes[Math.floor(Math.random() * themes.length)].split(".")[0]; 
    console.log("Theme set:" + GameEngine.theme);
  }
}

GameEngine.initializeModule();

module.exports = GameEngine;