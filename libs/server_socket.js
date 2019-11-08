var ModuleLoader = require('./module_loader.js');

class ServerSocket {
  // Static and class-shared
  static executeModuleListener(event, webSocket){
    if (ServerSocket.moduleSocketListener) {
      ServerSocket.moduleSocketListener(event, webSocket);
    }
  }
  
  static resetModuleListener(){    
    ServerSocket.moduleSocketListener = function(event, webSocket){};    
  }
    
  static plugModuleListener(listener){
    ServerSocket.moduleSocketListener = listener;
  }  
  
  static handleNewPlayer(webSocket){
      // This goes back to title screen every time a new player joins, which is not ideal.
      // Ideally you'd send the title screen only to them.
      ModuleLoader.endMinigame();
      webSocket.send("HereIsYourId" + "|" + webSocket.player_id);
      
      var AllPlayers = require('./all_players.js');
      console.log("Now playing:" + AllPlayers.getAllIds().toString());  
      AllPlayers.broadcastMessage("CurrentPlayerList", AllPlayers.getAllIds().toString());     
  }
  
  // The event listener is static because it can be called in any context, that's why we pass it the individual webSocket as parameter.
  static onSocketMessage(event, webSocket) {  
    // this should be a switch
    
    switch(event.data.split("|")[0]) {
      case "StartMinigame":
        ModuleLoader.loadMinigame(event.data.split("|")[1]);
        break;
      case "StartRandomMinigame":
        ModuleLoader.loadRandomMinigame();
        break;
      case "NewClientAnnouncement":
        ServerSocket.handleNewPlayer(webSocket); 
        break;
      case "ResetWholeGame":
        var AllPlayers = require('./all_players.js');
        AllPlayers.resetWholeGame();
        break;
      case "RerollNameRequest":
        var AllPlayers = require('./all_players.js');
        webSocket.player_id = AllPlayers.getNewId();
        ServerSocket.handleNewPlayer(webSocket); 
        break;
      default:
        console.log("received:" + event.data);
    }
    
    ServerSocket.executeModuleListener(event, webSocket);
  }
  
  // Individual
  constructor(webSocket) {
    this.webSocket = webSocket;    
    this.webSocket.onmessage = function (event) { ServerSocket.onSocketMessage(event, webSocket); };
    this.webSocket.connection_id = ServerSocket.next_player_id;
    ServerSocket.next_connection_id ++;
    
    var AllPlayers = require('./all_players.js');
    this.webSocket.player_id = AllPlayers.getNewId();
  }  
}

ServerSocket.next_connection_id = 0;

module.exports = ServerSocket;