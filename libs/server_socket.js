var ModuleLoader = require('./module_loader.js');

class ServerSocket {
  static onSocketMessage(event) {
    ServerSocket.moduleListener(event);
    
    if (event.data.startsWith("start_")){
      var parsed = event.data.split("_");
      ModuleLoader.loadMinigame(parsed[1]);
    } else {
      console.log("received:" + event.data);
    }
  }
  
  static assignWebsocket(webSocket){
    ServerSocket.webSocket = webSocket;
    ServerSocket.webSocket.onmessage = ServerSocket.onSocketMessage;
  }
  
  static moduleListener(event){
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