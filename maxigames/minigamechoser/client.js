var all_players_ids = "";

var invertColorChar = function(char){
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
}

var refreshDivContent = function(){
  document.getElementById('player_id_div').innerHTML = ClientSocket.getPlayerId();
  document.getElementById('player_id_div').style['color'] = ClientSocket.getPlayerColor();
  document.getElementById('player_id_div').style['background-color'] = ClientSocket.getPlayerColor().split('').map(invertColorChar).join('');
  if (! all_players_ids) {all_players_ids = ClientSocket.getPlayerId()};
  document.getElementById('all_players_div').innerHTML = all_players_ids;

}

var listener = function(event){
  if (event.data.split("|")[0] == "CurrentPlayerList"){
    var all_players_ids_raw = event.data.split("|")[1].split(",");
    var players_with_scores = [];
    for (var i in all_players_ids_raw) {
      players_with_scores.push(all_players_ids_raw[i].split(":"));
    }

    players_with_scores.sort(function(a,b) {
        return parseInt(a[1])<parseInt(b[1])?1:(parseInt(a[1])>parseInt(b[1])?-1:0);
    });

    all_players_ids = "";
    for (var i in players_with_scores) {
      var id =  players_with_scores[i][0].split("/")[0];
      var color =  players_with_scores[i][0].split("/")[1];

      all_players_ids += "<span style='color:" + color;
      all_players_ids += "; background-color:" + color.split('').map(invertColorChar).join('');
      if (id == ClientSocket.getPlayerId()) {  all_players_ids += "; font-weight:bold;"};
      all_players_ids += "'>" + players_with_scores[i][1] + " - " +  id + "</span><br />";
    }
  }

  refreshDivContent();
}

ClientSocket.plugModuleListener(listener);
