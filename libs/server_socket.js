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
      var welcome_page = ModuleLoader.getPage("maxigames", ModuleLoader.getMaxiGame());
      webSocket.send(JSON.stringify(welcome_page));

      var GameEngine = require('./game_engine.js');
      var AllPlayers = require('./all_players.js');
      console.log("Now playing:" + GameEngine.getListOfPlayers().toString());
      AllPlayers.broadcastMessage("CurrentPlayerList", GameEngine.getListOfPlayers().toString());
  }

  // The event listener is static because it can be called in any context, that's why we pass it the individual webSocket as parameter.
  static onSocketMessage(event, webSocket) {
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
        var GameEngine = require('./game_engine.js');
        GameEngine.resetWholeGame();
        break;
      case "RerollNameRequest":
        var GameEngine = require('./game_engine.js');
        GameEngine.setNewIdToPlayer(webSocket);
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

    var GameEngine = require('./game_engine.js');
    GameEngine.setNewIdToPlayer(webSocket);
  }
}

ServerSocket.next_connection_id = 0;

module.exports = ServerSocket;
