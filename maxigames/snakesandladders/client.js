var all_players_ids = "";
var player_positions = {};

var refreshPlayerListDivContent = function(){
  document.getElementById('player_id_div').innerHTML = ClientSocket.getPlayerId();
  document.getElementById('player_id_div').style['color'] = ClientSocket.getPlayerColor();
  document.getElementById('player_id_div').style['background-color'] = invertColor(ClientSocket.getPlayerColor());
  if (! all_players_ids) {all_players_ids = ClientSocket.getPlayerId()};
  document.getElementById('all_players_div').innerHTML = all_players_ids;
}

var board;
var array_columns = 15;


var drawArraySkeleton = function() {
  var array_rows = Math.ceil(board.length / array_columns) *2;
  var table = "<table style='table-layout:fixed;width:" + (30 * array_columns ) + "'>";
  for (var r=0; r < array_rows; r++) {
    table += "<tr>";
    for (var c=0; c < array_columns; c++) {
      table += "<td style='width:30px;height:30px;color:grey;font-size:6pt;vertical-align:top;overflow:hidden;' id='squarer" + r + "c" + c + "'></td>";
    }
    table += "</tr>";
  }
  table += "</table>";
  document.getElementById('board').innerHTML = table;
}

var drawBoard = function() {
  var r = 0;
  var c = 0;

  for (var i in board) {
    var cell = document.getElementById("squarer" + r + "c" + c);
    cell.style['border'] = "1px solid black";
    cell.innerHTML = i + " ";
    if(board[i].backward){
      cell.style['background-color'] = "#ff94b2";
      cell.innerHTML += "[<b>-" + board[i].backward + "</b>]";
    }
    if(board[i].forward){
      cell.style['background-color'] = "#acffab";
      cell.innerHTML += "[<b>+" + board[i].forward + "</b>]";
    }
    if(board[i].tp){
      cell.style['background-color'] = "#f7f6a3";
      cell.innerHTML += "[<b>>" + board[i].tp + "</b>]";
    }

    cell.innerHTML += "<div id='squarecontent" + i + "' style='font-size:8pt;'></div>";

    if (c == 0){  // We're in the first column
      if ( r % 4 == 0){ // we're starting again to move right
        c ++;
      } else { // Progress vertically
        r ++;
      }
    } else if (c == array_columns - 1) {  // We're in the last column
      if ( r % 4 == 2){ // we're starting again to move left
        c --;
      } else { // Progress vertically
        r ++;
      }
    } else { // Middle of a row
      // Progress horizontally
      if ( r % 4 == 0){
        c ++;
      } else {
        c --;
      }
    }
  }
}

var movePlayer = function(player_id, color, to) {
  try {
    document.getElementById("playerdiv_" + player_id).remove();
  } catch (error) {} // did not exist

  var div = document.createElement("div");
  div.id = "playerdiv_" + player_id;
  div.style['background-color'] = invertColor(color);
  div.style['color'] = color;
  div.style['width'] = "10px";
  div.style['display'] = "inline-block";
  div.innerHTML = "@";
  document.getElementById("squarecontent" + to).appendChild(div);

  player_positions[player_id] = to;
}

var refreshPlayerPositions = function(new_positions){
  for (var i in new_positions){
    var player = new_positions[i];
    if (player.pp_data.player_id in player_positions && player_positions[player.pp_data.player_id] == player.score) {
      continue; }
    movePlayer(player.pp_data.player_id, player.pp_data.color, player.score);
  }
}



var listener = function(event){
  try { // only expects objects
    var object = JSON.parse(event.data); // switch object.messageKey
    switch(object.messageKey) {
      case "CurrentPlayerList":
        all_players_ids = getPlayerListStringFromSocketObject(object);
        refreshPlayerListDivContent();
        break;
      case "SnakesLaddEveryonePosition":
        refreshPlayerPositions(object.players);
        break;
      case "SnakesLaddBoard":
        if (board) { return; }
        board = object.SnakesLaddBoard;
        drawArraySkeleton();
        drawBoard();
        break;
      default:
    }
  }
  catch(error) {  // For strings
      switch(event.data.split("|")[0]) {
        case "SnakesLaddDiceRollResult":
          alert(event.data.split("|")[1]);
          break;
        default:
      }
  }
}

ClientSocket.plugModuleListener(listener);
