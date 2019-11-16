var Fs = require('fs');

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

  static getAllPpData() {
    var result  = [];
    AllPlayers.doToAllClients(function (client) {
      if (client.pp_data){
        result.push(client.pp_data);
      }
    });
    return result;
  }

  static getAllIds() {
    var result  = [];

    var all_data = AllPlayers.getAllPpData();
    for (var i in all_data){
      result.push(all_data[i].player_id);
    }

    return result;
  }
}

module.exports = AllPlayers;
