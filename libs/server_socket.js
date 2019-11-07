var ModuleLoader = require('./module_loader.js');
    
class ServerSocket {
  static onSocketMessage(event) {
    ServerSocket.executeModuleListener(event);
    
    if (event.data.split("|")[0] == "StartMinigame"){
      ModuleLoader.loadMinigame(event.data.split("|")[1]);
    } else if (event.data.split("|")[0] == "NewClientAnnouncement"){
      // This goes back to title screen every time a new player joins, which is not ideal.
      // Ideally you'd send the title screen only to them.
      ModuleLoader.endMinigame();
    } else {
      console.log("received:" + event.data);
    }    
  }
  
  static assignWebsocket(webSocket){
    ServerSocket.webSocket = webSocket;
    ServerSocket.webSocket.onmessage = ServerSocket.onSocketMessage;
    resetModuleListener();
  }
  
  static executeModuleListener(event){
    if (ServerSocket.moduleSocketListener) {
      ServerSocket.moduleSocketListener(event);
    }
  }
  
  static resetModuleListener(){    
    ServerSocket.moduleSocketListener = function(event){};    
  }
    
  static plugModuleListener(listener){
    ServerSocket.moduleSocketListener = listener;
  }
}

module.exports = ServerSocket;