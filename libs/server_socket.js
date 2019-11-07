class ServerSocket {
  
  // Static and class-shared
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
  
  
  // Individual
  onSocketMessage(event) {
    var ModuleLoader = require('./module_loader.js');
  
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
  
  constructor(webSocket) {
    this.webSocket = webSocket;
    this.webSocket.onmessage = this.onSocketMessage;
  }  
}

module.exports = ServerSocket;