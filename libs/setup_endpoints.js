module.exports = function(APPLICATION) {
   
  APPLICATION.get('/', function(req, res, next){
    res.sendfile('client.html');
  });

  APPLICATION.get('/client_library.js', function(req, res, next){
    res.sendfile('client_library.js');
  });

  var on_socket_connection = function(webSocket, request) {
    var ServerSocket = require('./server_socket.js');
    ServerSocket.assignWebsocket(webSocket);
    
    var AllPlayers = require('./all_players.js');    
    AllPlayers.broadcastMessage("Now playing: " + PLAYERS.getAllIps()/toString());  
  };

  APPLICATION.ws('/', on_socket_connection);
  APPLICATION.listen(25565);
};
