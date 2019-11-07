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
    console.log(text);
  }
  
  static onSocketMessage(event) {
    ClientSocket.executeModuleListener(event);
      
    try {
      var object = JSON.parse(event.data);
      ClientSocket.receiveSocketObject(object);
    }
    catch(error) {
      ClientSocket.receiveSocketText(event.data);
    }
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

