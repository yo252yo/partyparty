// Wrapper around the websocket where we can inject our own logic. It's all static singleton.

const ClientSocket = {
  initializeToIp: function(ip) {
    ClientSocket.webSocket = new WebSocket(ip);
    ClientSocket.webSocket.onopen = ClientSocket.onSocketOpen;
    ClientSocket.webSocket.onmessage = ClientSocket.onSocketMessage;

    ClientSocket.resetExtraListener();
  },

  resetExtraListener: function() {
    ClientSocket.extraListener = function(received_object){};
  },

  onSocketMessage: function(event) {
    var received_object;
    try {
      received_object = JSON.parse(event.data);
    }
    catch(error) {
      console.log("Error parsing received message: " + error);
      console.log(event);
    }
    ClientSocket.onReceivingObject(received_object);
  },

  onSocketOpen: function(){
    ClientSocket.send({newClient: 1});
  },

  send: function(object) {
    console.log("Sending: " + Object.keys(object));

    ClientSocket.webSocket.send(JSON.stringify(object));
  },

  onReceivingObject: function(received_object) {
    console.log(received_object);

    ClientSocket.tryLoadPage(received_object);
    ClientSocket.tryReadPlayerInfo(received_object);
    ClientSocket.tryPaintBackground(received_object);
    ClientSocket.tryReactToAnnouncement(received_object);
    ClientSocket.tryPopulateHtmlElements(received_object);

    if (ClientSocket.extraListener) {
      ClientSocket.extraListener(received_object);
    }
  },

  tryLoadPage: function(received_object){
    if(received_object.html){
      // New page
      document.body.innerHTML = received_object.html;
    }
    if(received_object.script){
      ClientSocket.resetExtraListener();
      eval(received_object.script);
    }
  },

  tryReadPlayerInfo: function(received_object){
    if (! ClientSocket.webSocket.player_data) {
      ClientSocket.webSocket.player_data = {};
    }

    if(received_object.introduction_player_id) {
      ClientSocket.webSocket.player_data.player_id = received_object.introduction_player_id;
    }
    if(received_object.introduction_color) {
      ClientSocket.webSocket.player_data.color = received_object.introduction_color;
    }
    if(received_object.introduction_theme) {
      ClientSocket.webSocket.player_data.theme = received_object.introduction_theme;
    }
    ClientHTMLTemplates.paintBackground();
    ClientHTMLTemplates.fillPlayerIdDiv();
  },

  tryPaintBackground: function(received_object){
    if(received_object.theme) {
      if(ClientSocket.webSocket.player_data.theme == received_object.theme){
        return; // work is done
      }
      ClientSocket.webSocket.player_data.theme = received_object.theme;
      ClientHTMLTemplates.paintBackground();
    }
  },

  tryPopulateHtmlElements: function(received_object){
    if(received_object.scores) {
      ClientHTMLTemplates.makeAllPlayersDiv(received_object);
    }
  },

  tryReactToAnnouncement: function(received_object){
    if(received_object.winnerAnnouncement){
      alert("Winner: " + received_object.winnerAnnouncement);
      clearTimer();
    }
  },

  getPlayerId: function() {
    return ClientSocket.webSocket.player_data.player_id;
  },

  getPlayerColor: function() {
    return ClientSocket.webSocket.player_data.color;
  },

  getTheme: function() {
    return ClientSocket.webSocket.player_data.theme;
  },

}
