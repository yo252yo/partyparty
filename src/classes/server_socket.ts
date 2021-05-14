import {SocketListener, ExtendedWebSocket} from "../types/io";

import * as WebSocket from 'ws';

import * as GameEngine from '../modules/game_engine.js';
import * as GamesLoader from '../modules/games_loader.js';
import * as Themes from '../modules/themes.js';

// Wrapper around raw websocket where we can inject our logic.

export class ServerSocket {
  webSocket: ExtendedWebSocket;
  static extraListener?: SocketListener;

  tryReceivingCommand(object: any) {
    if (object.ping){
      console.log("[[[socket]]] Received ping");
      this.send({pong: 1});
    }
    if (object.setupMinigame){
      GamesLoader.setupMinigame(object.setupMinigame);
    }
    if (object.setupMaxigame){
      GameEngine.startGame(object.setupMaxigame);
    }
    if (object.setupRandomMinigame){
      GamesLoader.setupRandomMinigame();
    }
    if (object.rerollNameRequest){
      this.fillPlayerData();
    }
    if(object.resetWholeGameRequest){
      GameEngine.startGame();
    }
    if(object.setTheme){
      Themes.pickTheme(object.setTheme);
    }
  }

  tryReceivingSubscription(object: any) {
    if (object.newClient){
      console.log("[[[socket]]] Received new player");
      this.handleNewPlayer();
      return;
    }
  }

  onReceivingObject(object: any) {
    // We want to act on special things in the game BEFORE changing game
    if(ServerSocket.extraListener){
      ServerSocket.extraListener(object, this);
    }

    this.tryReceivingCommand(object);
    this.tryReceivingSubscription(object);
  }

  onSocketMessage(event: WebSocket.MessageEvent) {
    try {
      var object = JSON.parse(event.data.toString());
      this.onReceivingObject(object);
    }
    catch(error) {
      console.log("Error in parsing received message: " + error);
    }
  }

  static resetExtraListeners() {
    ServerSocket.extraListener = undefined;
  }

  constructor(webSocket: WebSocket) {
    //console.log("[socket] New socket");
    var self = this;
    this.webSocket = webSocket;
    this.webSocket.onmessage = function (event: WebSocket.MessageEvent) {
      self.onSocketMessage(event);
    };
  }

  send(object:any) {
    this.webSocket.send(JSON.stringify(object));
  }

  // static so that it can be called in the Socket Manager
  static fillPlayerDataOfSocket(webSocket: ExtendedWebSocket){
    webSocket.player_data = Themes.getNewPlayerData();

    webSocket.send(JSON.stringify({
      introduction_player_id: webSocket.player_data?.player_id,
      introduction_color: webSocket.player_data?.color,
      introduction_theme: Themes.getCurrentTheme()
    }));

    GameEngine.broadcastScores();
  }

  fillPlayerData() {
    ServerSocket.fillPlayerDataOfSocket(this.webSocket);
  }

  handleNewPlayer() {
    this.send(GamesLoader.getMaxigamePage());
    this.fillPlayerData();
  }

  player_data(){
    return this.webSocket.player_data || {
      player_id: "",
      color: ""
    };
  }
}
