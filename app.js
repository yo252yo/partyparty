var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var fs = require('fs');

app.get('/', function(req, res, next){
  res.sendfile('client.html');
});

app.get('/client_library.js', function(req, res, next){
  res.sendfile('client_library.js');
});



class Players {
  constructor() {
    this.all_websockets = expressWs.getWss('/');
  }  

  broadcastMessage(msg) {
    //console.log("BC:" + msg);
    this.all_websockets.clients.forEach(function (client) {
      client.send(msg);
    });  
  }
  
  getAllIps() {
    var result  = [];
    this.all_websockets.forEach(function (client) {
      result.push(client._socket.remoteAddress);
    });  
    return result;
  }
    
  getAllIpsAsString() {
    return getAllIps().toString();
  }  
}

var PLAYERS = new Players();



var loadMinigame = function (name) {     
  var setup = {
    document_html: fs.readFileSync('./minigames/' +  name + '.setup.html').toString()
  };    
  PLAYERS.broadcastMessage(JSON.stringify(setup));
  
  setTimeout(function() {
    var page = {
      document_html: fs.readFileSync('./minigames/' +  name + '.html').toString(),
      script: fs.readFileSync('./minigames/' +  name + '.client.js').toString()
    };
    PLAYERS.broadcastMessage(JSON.stringify(page));  
    eval(fs.readFileSync('./minigames/' +  name + '.server.js').toString());
  }, 5000);

  
}

var loadTestMinigame = function () { 
  loadMinigame('test');
}



class ServerSocket {
  constructor(webSocket) {
    this.webSocket = webSocket;
    this.webSocket.onmessage = this.onSocketMessage;
    
    console.log('New connection ' + this.webSocket._socket.remoteAddress);
  }  

  onSocketMessage(event) {
    if (event.data == "start_test"){
      loadTestMinigame();
    } else {
      console.log(event.data);
    }
  }
}

var on_socket_connection = function(webSocket, request) {
  serverSocket = new ServerSocket(webSocket);
  PLAYERS.broadcastMessage("Now playing: " + PLAYERS.getAllIpsAsString());  
};

app.ws('/', on_socket_connection);

app.listen(25565);
