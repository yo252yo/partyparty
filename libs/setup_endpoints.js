var Express = require('express');

module.exports = function(APPLICATION) {
   
  APPLICATION.get('/', function(req, res, next){
    res.sendfile('./client.html');
  });
  
  APPLICATION.use("/client", Express.static('client'))

  var on_socket_connection = function(webSocket, request) {
    var ServerSocket = require('./server_socket.js');
    var newSocket = new ServerSocket(webSocket);
  };

  APPLICATION.ws('/', on_socket_connection);
  APPLICATION.listen(25565);
};
