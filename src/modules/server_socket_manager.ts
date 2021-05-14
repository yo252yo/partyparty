import { SocketPlayerData, ExtendedWebSocket, FunctionOnAServerSocket } from "../types/io";

import express from 'express';
import expressWs from 'express-ws';
import * as WebSocket from 'ws';

import * as Themes from '../modules/themes.js';

import { ServerSocket } from '../classes/server_socket.js';


// Parameters
var expressInstance: expressWs.Instance;

// Functions
export function plugInstance (instance_:  expressWs.Instance){
  expressInstance = instance_;
}

function doToAllSockets(f: FunctionOnAServerSocket){
  // It seems that getWss.clients doesnt give us the right type :(
  expressInstance.getWss().clients.forEach(function (socket: unknown) {
    f(<ExtendedWebSocket>socket);
  });
}

export function broadcast(object: any) {
  console.log("[[[socket_manager]]] Broadcasting: " + Object.keys(object));

  var msg = JSON.stringify(object);
  doToAllSockets(function (socket: ExtendedWebSocket) {
    socket.send(msg);
  });
}

export function getAllClientData() {
  var result : SocketPlayerData[]  = [];
  doToAllSockets(function (client: ExtendedWebSocket) {
    if (client.player_data){
      // If needed, ip is: client._socket.remoteAddress
      result.push(client.player_data);
    }
  });
  return result;
}

export function getAllIds() {
  var result: string[]  = [];
  var all_data = getAllClientData();
  for (var i in all_data){
    result.push(all_data[i].player_id || "");
  }
  return result;
}

export function renameExistingPlayers() {
  doToAllSockets(function (client: ExtendedWebSocket) {
    ServerSocket.fillPlayerDataOfSocket(client);
  });
}
