const ClientHTMLTemplates = {
  invertColorChar: function(char) {
    switch (char) {
      case "0": return "F";
      case "1": return "F";
      case "2": return "E";
      case "3": return "E";
      case "4": return "D";
      case "5": return "D";
      case "6": return "C";
      case "7": return "C";
      case "8": return "3";
      case "9": return "3";
      case "A": return "2";
      case "B": return "2";
      case "C": return "1";
      case "D": return "1";
      case "E": return "0";
      case "F": return "0";
      default: return "#";
    }
  },

  invertColor: function(string) {
    if(!string){return;}
  	return string.split('').map(ClientHTMLTemplates.invertColorChar).join('');
  },

  fillPlayerIdDiv: function() {
    var potentialHtmlElement = document.getElementById('player_id_div');
    if(potentialHtmlElement){
      potentialHtmlElement.innerHTML = ClientSocket.getPlayerId();
      potentialHtmlElement.style['color'] = ClientSocket.getPlayerColor();
      potentialHtmlElement.style['background-color'] = ClientHTMLTemplates.invertColor(ClientSocket.getPlayerColor());
    }
  },

  paintBackground: function() {
    document.body.style.backgroundImage = "url('client/assets/themes/" + ClientSocket.getTheme() + ".png')";
  },

  makeOnePlayerDiv: function(player, h, score){
    var player_div = "<div style='margin:1%;padding:1%;display:inline-block;overflow:hidden;color:" + player.color;
    player_div += "; background-color:" + ClientHTMLTemplates.invertColor(player.color);
    if (player.player_id == ClientSocket.getPlayerId()) {
       player_div += "; font-weight:bold;"
    };
    player_div += "'>";
    if(typeof(score) != "undefined"){
      player_div += score + "-" +  player.player_id + "<br />";
    }

    var id = player.player_id.replace(/([A-Z])/g, ' $1').split(" ");
    var w = Math.floor(h*190/300);

    player_div += `<div style='position:relative;width:${w}px;height:${h}px;'>`;
    player_div += "<img src='client/assets/avatars/modifiers/" + id[1] + "_above.png' style='z-index:4;position:absolute;width:100%;height:100%;' />";
    player_div += "<img src='client/assets/avatars/nouns/" + ClientSocket.getTheme() + "/" + id[2] + ".png' style='z-index:3;position:absolute;width:50%;height:30%;left:25%;top:15%' />";
    player_div += "<img src='client/assets/avatars/modifiers/" + id[1] + "_below.png' style='z-index:2;position:absolute;width:100%;height:100%;' />";
    player_div += "</div></div>";
    return player_div;
  },

  makeAllPlayersDiv: function(received_object) {
    var all_players_ids = "";
    for (var i in received_object.playerList) {
      var player = received_object.playerList[i];
      var score = 0;
      if (received_object.scores[player.player_id]){
        score = received_object.scores[player.player_id];
      }

      all_players_ids += ClientHTMLTemplates.makeOnePlayerDiv(player, 300, score);
    }

    var potentialHtmlElement = document.getElementById('all_players_div');
    if (potentialHtmlElement) {
      potentialHtmlElement.innerHTML = all_players_ids;
    }
  },
}
