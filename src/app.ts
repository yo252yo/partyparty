import * as WebSocket from 'ws';
import express from 'express';
import expressWs from 'express-ws';
import path from "path";
import * as SocketManager from './modules/server_socket_manager.js';
import * as GameEngine from './modules/game_engine.js';
import * as Router from "./router";
import { ServerSocket } from './classes/server_socket.js';

const port = 25565;

const appBase = express();
const wsInstance = expressWs(appBase);
const app = wsInstance.app;

require('./environment.js');

// Post
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Router
app.use('/client', express.static(path.join(__dirname, '../src/client'))); // this is run from compiled/
app.use('/', Router.router);

// WebSocket
app.ws('/', function(ws: WebSocket, req: express.Request){
  var newSocket = new ServerSocket(ws);
});
SocketManager.plugInstance(wsInstance);

// Activate
app.listen( port, () => {
  console.log(`[[[app]]] server started at http://localhost:${ port }` );
} );

GameEngine.startGame();
