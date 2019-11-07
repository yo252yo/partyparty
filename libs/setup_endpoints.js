module.exports = function(APPLICATION) {
   
  APPLICATION.get('/', function(req, res, next){
    res.sendfile('client.html');
  });

  APPLICATION.get('/client/client_library.js', function(req, res, next){
    res.sendfile('client/client_library.js');
  });
  
  APPLICATION.get('/client/client_socket.js', function(req, res, next){
    res.sendfile('client/client_socket.js');
  });

  var on_socket_connection = function(webSocket, request) {
    var ServerSocket = require('./server_socket.js');
    ServerSocket.assignWebsocket(webSocket);
    
    var AllPlayers = require('./all_players.js');    
    AllPlayers.broadcastMessage("CurrentPlayerList", PLAYERS.getAllIps().toString());  
  };

  APPLICATION.ws('/', on_socket_connection);
  APPLICATION.listen(25565);
};
