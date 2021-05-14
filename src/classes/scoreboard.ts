import * as SocketManager from '../modules/server_socket_manager.js';
import * as Themes from '../modules/themes.js';

type numberDictionary = { [key: string]: number };

export class Scoreboard {
  scores : numberDictionary = {};
  players : string[] = [];

  static getDefaultWinner(){
    return undefined;
  }

  getMinScore() {
    var min;
    var argMin : string|undefined = Scoreboard.getDefaultWinner();

    if (this.scores.length == 0){
      return argMin;
    }

    for (var id in this.scores){
      if (!min || this.scores[id] < min){
        min = this.scores[id];
        argMin = id;
      }
    }

    return argMin;
  }

  getMaxScore() {
    var max;
    var argMax : string|undefined = Scoreboard.getDefaultWinner();

    if (this.scores.length == 0){
      return argMax;
    }

    for (var id in this.scores){
      if (!max || this.scores[id] > max){
        max = this.scores[id];
        argMax = id;
      }
    }

    return argMax;
  }

  incrementScore(player: string, value?: number) {
    if (! this.scores[player]) { this.scores[player] = 0; }
    if (!value) {value = 1;}
    this.scores[player] += value;
    console.log(player + " got " + this.scores[player]);
  }

  setScore(player: string, score: number) {
    this.scores[player] = score;
    console.log(player + " got " + score);
  }

  getScore(player: string) {
    if (this.scores[player]){
      return this.scores[player];
    } else {
      return 0;
    }
  }

  isFull() {
    this.players = SocketManager.getAllIds();
    return Object.keys(this.scores).length == this.players.length;
  }

  makeExplicitZeros() {
    this.players = SocketManager.getAllIds();
    for(var i in this.players){
      this.setScore(this.players[i], 0);
    }
  }

  broadcastScores(key?: string){
    var playersData = SocketManager.getAllClientData();
    var scores : numberDictionary = {};
    if(!key){
      key = "scores";
    }

    for (var i in playersData){
      var player = playersData[i].player_id;
      if(player){
        scores[player] = this.getScore(player);
      }
    }
    var object : { [key: string]: any } = {
      playerList : playersData,
      theme: Themes.getCurrentTheme()
    };
    object[key] = scores;
    SocketManager.broadcast(object);
  }
}
