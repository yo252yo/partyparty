module.exports = function(APPLICATION) {
   
  APPLICATION.get('/', function(req, res, next){
    res.sendfile('./client.html');
  });

  APPLICATION.get('/client/client_library.js', function(req, res, next){
    res.sendfile('./client/client_library.js');
  });
  
  APPLICATION.get('/client/client_socket.js', function(req, res, next){
    res.sendfile('./client/client_socket.js');
  });

  var on_socket_connection = function(webSocket, request) {
    var ServerSocket = require('./server_socket.js');
    var newSocket = new ServerSocket(webSocket);
  };

  APPLICATION.ws('/', on_socket_connection);
  APPLICATION.listen(25565);
};
