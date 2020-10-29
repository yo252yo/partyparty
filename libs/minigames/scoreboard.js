var AllPlayers = require('../all_players.js');

class Scoreboard {

  static getDefaultWinner(){
    return "Noone";
  }

  constructor() {
    this.scores = {};
  }

  getMinScore() {
    var min;
    var argMin = Scoreboard.getDefaultWinner();

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
    var argMax = Scoreboard.getDefaultWinner();

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

  incrementScore(player, value) {
    if (! this.scores[player]) { this.scores[player] = 0; }
    if (!value) {value = 1;}
    this.scores[player] += value;
    console.log(player + " got " + this.scores[player]);
  }

  setScore(player, score) {
    this.scores[player] = score;
    console.log(player + " got " + score);
  }

  getScore(player) {
    if (this.scores[player]){
      return this.scores[player];
    } else {
      return 0;
    }
  }

  isFull() {
    this.players = AllPlayers.getAllIds();
    return Object.keys(this.scores).length == this.players.length;
  }

  makeExplicitZeros() {
    this.players = AllPlayers.getAllIds();
    for(var i in this.players){
      this.setScore(this.players[i], 0);
    }
  }

  broadcastScores(messageKey, theme){
    var object = {};
    object.messageKey = messageKey;
    if(! messageKey) { messageKey = "BroadcastScores";}

    object.players = [];
    if(theme){
      object.theme = theme;
    }
    var all_data = AllPlayers.getAllPpData();
    for (var i in all_data){
      var pp_data = all_data[i];
      var player = {};
      player.pp_data = pp_data;
      player.score = this.getScore(pp_data.player_id);
      object.players.push(player);
    }
    AllPlayers.broadcastObject(object);
  }

}

module.exports = Scoreboard;
