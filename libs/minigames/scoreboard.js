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

  broadcastScores(messageKey){
    if(! messageKey) { messageKey = "BroadcastScores";}
    var message = "";
    var all_data = AllPlayers.getAllPpData();
    for (var i in all_data){
      var player = all_data[i];
      var name = player.player_id;
      var score = this.getScore(name);
      // Maybe this should be an object??
      message += player.player_id + "/" + player.color + ":" + score + ",";
    }
    console.log("BroadcastScores(" + messageKey + "):" + message)
    AllPlayers.broadcastMessage(messageKey, message);
  }

}

module.exports = Scoreboard;
