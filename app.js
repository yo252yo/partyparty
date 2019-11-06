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
 
var ALL_WEBSOCKETS = expressWs.getWss('/');

var broadcastMessage = function (msg) {
  //console.log("BC:" + msg);
	ALL_WEBSOCKETS.clients.forEach(function (client) {
	  client.send(msg);
	});  
}

var getAllPlayers = function () {
  var result  = "";
	ALL_WEBSOCKETS.clients.forEach(function (client) {
	  result += client._socket.remoteAddress;
    result += "//";
	});  
  return result;
}

var loadMinigame = function (name) {     
  var setup = {
    document_html: fs.readFileSync('./minigames/' +  name + '.setup.html').toString()
  };    
  broadcastMessage(JSON.stringify(setup));
  
  setTimeout(function() {
    var page = {
      document_html: fs.readFileSync('./minigames/' +  name + '.html').toString(),
      script: fs.readFileSync('./minigames/' +  name + '.client.js').toString()
    };
    broadcastMessage(JSON.stringify(page));  
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
  broadcastMessage("Now playing: " + getAllPlayers());  
};

app.ws('/', on_socket_connection);

app.listen(25565);
