class AllPlayers {
  // This is not great but I don't want to have to pass expressWs everywhere.
  // It will probably end up transformed into "initializePlayers" anyway.
  static bindExpressWs(expressWs){
    AllPlayers.ExpressWs = expressWs;
  }
  
  static doToAllClients(f){
    AllPlayers.ExpressWs.getWss('/').clients.forEach(function (client) {
      f(client);
    });
  }
 
  static broadcastMessage(prefix, msg) {
    //console.log("BC:" + msg);
    AllPlayers.doToAllClients(function (client) {
      client.send(prefix + "|" + msg);
    });  
  }
  
  static broadcastObject(object) {
    //console.log("BC:" + object);
    AllPlayers.doToAllClients(function (client) {
      client.send(JSON.stringify(object));
    });  
  }
  
  static getAllIps() {
    var result  = [];
    AllPlayers.doToAllClients(function (client) {
      result.push(client._socket.remoteAddress);
    });  
    return result;
  }
}

module.exports = AllPlayers;