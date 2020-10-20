
function appendToBody(text){
	var node = document.createElement("div");
	var newContent = document.createTextNode(text);
	node.appendChild(newContent);
	document.body.appendChild(node);
}

function createIddDiv(parent, name){
  var div = document.createElement("div");
  div.id = name;
  parent.appendChild(div);
  return div;
}

function updateTimer(seconds){
  if (document.getElementById("timer")){
    document.getElementById("timer").innerHTML = seconds + "s";
  }
}

var timer = 0;
var timerObject;

function tickInterval() {
  timer = timer - 1;
  if (timer <= 0) {
    clearInterval(timerObject);
  } else {
    updateTimer(timer);
  }
}

function displayTimer(seconds) {
  clearInterval(timerObject);
  timer = seconds;
  updateTimer(timer);
  timerObject = setInterval(tickInterval, 1000);

  console.log("Timer set for " + seconds);
}

function clearTimer() {
  clearInterval(timerObject);
}

function fireDocumentEvent(name){
  var event = new Event(name);
  document.dispatchEvent(event);
}

function invertColorChar(char){
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

function invertColor(string){
	return string.split('').map(invertColorChar).join('');
}

function getPlayerListStringFromSocketObject(object){
	console.log(object);
	var all_players_ids = "";
	for (var i in object.players) {
		var player = object.players[i];
    all_players_ids += "<div style='margin:5px;width:200px;height:320px;padding:5px;display:inline-block;overflow:hidden;color:" + player.pp_data.color;
    all_players_ids += "; background-color:" + invertColor(player.pp_data.color);
    if (player.pp_data.player_id == ClientSocket.getPlayerId()) {
			 all_players_ids += "; font-weight:bold;"
		 };
    all_players_ids += "'>";
    all_players_ids += player.score + "-" +  player.pp_data.player_id + "<br /><div style='position:relative;'>";
		var id = player.pp_data.player_id.replace(/([A-Z])/g, ' $1').split(" ");
	  all_players_ids += "<img src='client/assets/avatars/modifiers/" + id[1] + "_above.png' style='z-index:4;position:absolute;width:190px;height:300px;' />";
	  all_players_ids += "<img src='client/assets/avatars/nouns/" + ClientSocket.getTheme() + "/" + id[2] + ".png' style='z-index:3;position:absolute;width:80px;height:80px;left:55px;top:50px' />";
	  all_players_ids += "<img src='client/assets/avatars/modifiers/" + id[1] + "_below.png' style='z-index:2;position:absolute;width:190px;height:300px;' />";

    all_players_ids += "</div></div>";
	}
	return all_players_ids;
}

function server_reset(g){
	ClientSocket.send('ResetWholeGame|' + g);
}

function server_change_game(g){
	ClientSocket.send('ChangeMaxiGame|' + g);
}

function server_change_theme(){
	ClientSocket.send('ChangeTheme|');
}
