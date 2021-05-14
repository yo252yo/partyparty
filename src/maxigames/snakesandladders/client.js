
var player_positions = {};
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
    if(board[i].bonus){
      cell.style['background-color'] = "#e2a3f7";
      cell.innerHTML += "[<b>";
      for (var j = 0; j < board[i].bonus; j ++){
        cell.innerHTML += "*";
      }
      cell.innerHTML += "</b>]";
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
  div.style['background-color'] = ClientHTMLTemplates.invertColor(color);
  div.style['color'] = color;
  div.style['width'] = "10px";
  div.style['display'] = "inline-block";
  div.innerHTML = "@";
  document.getElementById("squarecontent" + to).appendChild(div);

  player_positions[player_id] = to;
}

var refreshPlayerPositions = function(object){
  for (var i in object.playerList){
    var player = object.playerList[i];
    var position = object.SnakesLaddEveryonePosition[player.player_id];
    if (player_positions[player.player_id] != position){
      movePlayer(player.player_id, player.color, position);
    }
    player_positions[player.player_id] = position;
  }
}

ClientSocket.extraListener = function(object) {
  if(object.SnakesLaddDiceRollResult){
    alert(object.SnakesLaddDiceRollResult);
  }
  if(object.SnakesLaddEveryonePosition){
    refreshPlayerPositions(object);
  }
  if(object.SnakesLaddBoard){
    if (board) { return; }
    board = object.SnakesLaddBoard;
    drawArraySkeleton();
    drawBoard();
  }
};
