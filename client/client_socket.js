class ClientSocket {
  static initializeToIp(ip) {
    ClientSocket.webSocket = new WebSocket(ip);
    ClientSocket.webSocket.onopen = ClientSocket.onSocketOpen;
    ClientSocket.webSocket.onmessage = ClientSocket.onSocketMessage;      
    ClientSocket.resetModuleListener();
  }
                              
  static receiveSocketObject(object) {
    if(object.document_html){
      // New page
      document.body.innerHTML = object.document_html;
      ClientSocket.resetModuleListener();
    }
    if(object.script){
      eval(object.script);
    }
  }

  static receiveSocketText(text){    
    if (event.data.split("|")[0] == "HereIsYourId"){
      ClientSocket.webSocket.player_id = event.data.split("|")[1];
      console.log("ID received:" + ClientSocket.webSocket.player_id);
    }
    else {
      console.log(text);
    }
  }
  
  static getPlayerId() {
    return ClientSocket.webSocket.player_id;
  }
  
  static onSocketMessage(event) {      
    try {
      var object = JSON.parse(event.data);
      ClientSocket.receiveSocketObject(object);
    }
    catch(error) {
      console.log(event);
      ClientSocket.receiveSocketText(event.data);
    }
    
    ClientSocket.executeModuleListener(event);
  }

  static onSocketOpen(){
    ClientSocket.send('NewClientAnnouncement', 'Im a new client');
  }
  
  static executeModuleListener(event){
    if (ClientSocket.moduleSocketListener) {
      ClientSocket.moduleSocketListener(event);
    }
  }
  
  static resetModuleListener(){    
    ClientSocket.moduleSocketListener = function(){};    
  }
    
  static send(prefix, message) {
    ClientSocket.webSocket.send(prefix + "|" + message);    
  }
  
  static plugModuleListener(listener){
    ClientSocket.moduleSocketListener = listener;
  }
}

