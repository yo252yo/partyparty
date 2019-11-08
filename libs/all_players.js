var Fs = require('fs');

class AllPlayers {
  // This is not great but I don't want to have to pass expressWs everywhere.
  // It will probably end up transformed into "initializePlayers" anyway.
  static bindExpressWs(expressWs){
    AllPlayers.ExpressWs = expressWs;
  }
  
  static doToAllClients(f){
    AllPlayers.ExpressWs.getWss('/').clients.forEach(function (client) {
      f(client);
    });
  }
 
  static broadcastMessage(prefix, msg) {
    //console.log("BC:" + msg);
    AllPlayers.doToAllClients(function (client) {
      client.send(prefix + "|" + msg);
    });  
  }
  
  static broadcastObject(object) {
    //console.log("BC:" + object);
    AllPlayers.doToAllClients(function (client) {
      client.send(JSON.stringify(object));
    });  
  }
  
  static getAllIps() {
    var result  = [];
    AllPlayers.doToAllClients(function (client) {
      result.push(client._socket.remoteAddress);
    });  
    return result;
  }
  
  static getScore(id) {
    if (id in AllPlayers.scores){
      return AllPlayers.scores[id];
    }
    return 0;
  }
  
  static changeScore(id, increment) {
    AllPlayers.scores[id] = AllPlayers.getScore(id) + increment;
  }
  
  static initializeModule(){
    AllPlayers.usedIds = [];
    AllPlayers.theme = "";
    AllPlayers.scores = {};    
  }
  
  static resetWholeGame(){
    AllPlayers.initializeModule();
    AllPlayers.pickTheme();
    
    AllPlayers.doToAllClients(function (client) {
      client.player_id = AllPlayers.getNewId();
      
      var ServerSocket = require('./server_socket.js');
      ServerSocket.handleNewPlayer(client);
    });      
  }
  
  static getAllIds() {
    var result  = [];
    AllPlayers.doToAllClients(function (client) {
      result.push(client.player_id + ":" + parseInt(AllPlayers.getScore(client.player_id)));
    });  
    return result;
  }
  
  static getNewId(){
    var nouns = require('../themes/nouns/' + AllPlayers.theme + '.js');
    var modifiers = require('../themes/modifiers.js');
    var rollProposal = function(){
      return modifiers[Math.floor(Math.random()*modifiers.length)] + nouns[Math.floor(Math.random()*nouns.length)];
    }
    
    var proposal = rollProposal();
    while (proposal in AllPlayers.usedIds){
      proposal = rollProposal();
    }
    AllPlayers.usedIds.push(proposal);
    return proposal;
  }
  
  static pickTheme() {
    var themes = Fs.readdirSync("./themes/nouns/");
    AllPlayers.theme = themes[Math.floor(Math.random() * themes.length)].split(".")[0]; 
    console.log("Theme set:" + AllPlayers.theme);
  }
}

AllPlayers.initializeModule();

module.exports = AllPlayers;