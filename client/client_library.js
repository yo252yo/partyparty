
function appendToBody(text){
	var node = document.createElement("div");
	var newContent = document.createTextNode(text);
	node.appendChild(newContent);
	document.body.appendChild(node);
}

function updateTimer(seconds){
  if (document.getElementById("timer")){
    document.getElementById("timer").innerHTML = seconds + "s";
  }
}

function displayTimer(seconds) {
  clearInterval();
  var timer = seconds;

  updateTimer(timer);

  var tickInterval = function () {
    timer = timer - 1;
    if (timer <= 0) {
      clearInterval();
    } else {
      updateTimer(timer);
    }
  }
  setInterval(tickInterval, 1000);

  console.log("Timer set for " + seconds);
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
    all_players_ids += "<span style='color:" + player.pp_data.color;
    all_players_ids += "; background-color:" + invertColor(player.pp_data.color);
    if (player.pp_data.player_id == ClientSocket.getPlayerId()) {
			 all_players_ids += "; font-weight:bold;"
		 };
    all_players_ids += "'>" + player.score + " - " +  player.pp_data.player_id + "</span><br />";
	}
	return all_players_ids;
}

document.addEventListener('keydown', function(e) {
    var key = event.keyCode;
    var character = String.fromCharCode(event.keyCode).toLowerCase();
    if (character == "w" || key == 38 || key == 104) {
      fireDocumentEvent('press_up');
    }
    if (character == "a" || key == 37 || key == 100) {
      fireDocumentEvent('press_left');
    }
    if (character == "d" || key == 39 || key == 102) {
      fireDocumentEvent('press_right');
    }
    if (character == "s" || key == 40 || key == 98) {
      fireDocumentEvent('press_down');
    }
});

document.addEventListener('click', function(event) {
    var isTopRight = event.clientX > event.clientY;
    var isTopLeft = event.clientX < window.innerHeight - event.clientY;

    if (!isTopRight && isTopLeft) {
      fireDocumentEvent('press_left');
    } else if (isTopRight && !isTopLeft) {
      fireDocumentEvent('press_right');
    } else if (isTopRight && isTopLeft) {
      fireDocumentEvent('press_up');
    } else if (!isTopRight && !isTopLeft) {
      fireDocumentEvent('press_down');
    }
});
