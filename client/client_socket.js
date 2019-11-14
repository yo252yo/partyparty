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
    switch(event.data.split("|")[0]) {
      case "HereIsYourId":
        var message = event.data.split("|")[1];
        if (! ClientSocket.webSocket.pp_data) { ClientSocket.webSocket.pp_data = {}; }
        ClientSocket.webSocket.pp_data.player_id = message.split("/")[0];
        ClientSocket.webSocket.pp_data.color = message.split("/")[1];
        console.log("ID received:" + ClientSocket.webSocket.pp_data.player_id);
        break;
      default:
        console.log(text);
    }
  }

  static getPlayerId() {
    return ClientSocket.webSocket.pp_data.player_id;
  }

  static getPlayerColor() {
    return ClientSocket.webSocket.pp_data.color;
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
