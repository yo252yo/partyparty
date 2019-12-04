var startTime;
var win = function (){
  alert("You escaped!");
  var duration = (new Date() - startTime);
  console.log("Sending" + duration);
  ClientSocket.send("MazeEscapeDuration", duration);
}

// Maze parameters
var maze;
var height = 27;
var width = 27;
var exit = '&lt;';
var wall = '#';
var player = '@';
var enemy = 'o';
var enemies = [];
var enemies_coindex = {};

// Maze display function
/*var updateDisplay = function() {
  var text = '<table>';
  for (var i = 0; i < height; i++) {
    text += '<tr>';
    for (var j = 0; j < width; j++){
      text += '<td>';
      if (maze[i*width+j] == '-1')
        text += '#';
      if (maze[i*width+j] == '1')
        text += '@';
      if (maze[i*width+j] == '2')
        text += '&lt;';
      text += '</td>'
    }
    text += '</tr>'
  }
  text += '</table>'
  document.getElementById("maze").innerHTML = text;
}*/
var updateDisplay = function() {
  console.log(enemies);
  var text = '';
  var spot = 0;
  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      if (maze[spot] == '-1') {
        text += wall;
      } else if (maze[spot] == '0') {
        if (enemies[spot]) {
          text += '<b style="color:';
          text += enemies[spot];
          text += ';background-color:';
          text += invertColor(enemies[spot]);
          text += ';opacity:0.3;">' + enemy + '</b>';
        } else {
          text += '&nbsp;';
        }
      } else if (maze[spot] == '1') {
          text += '<b style="color:';
          text += ClientSocket.webSocket.pp_data.color;
          text += ';background-color:';
          text += invertColor(ClientSocket.webSocket.pp_data.color);
          text += ';">' + player + '</b>';
      } else if (maze[spot] == '2'){
        text += exit;
      }
      spot++;
    }
    text += '<br>'
  }
  document.getElementById("maze").innerHTML = text;
}

// Key presses to move
var x = 1;
var y = 1;

var broadcastPosition = function(){
  ClientSocket.send("MazeMyPosition",  (x*width+y).toString() + "/" + ClientSocket.webSocket.pp_data.color);
}
var interval = setInterval(broadcastPosition, 1500 + Math.floor(Math.random() * 1000));

var goUp = function(e) {
  maze[x*width+y]=0;
  x--;
  if (maze[x*width+y] == 2)
    win();
  if (maze[x*width+y] == -1)
    x++;
  maze[x*width+y]=1;
  updateDisplay();
}

var goLeft = function(e) {
  maze[x*width+y]=0;
  y--;
  if (maze[x*width+y] == 2)
    win();
  if (maze[x*width+y] == -1)
    y++;
  maze[x*width+y]=1;

  updateDisplay();
}

var goRight = function(e) {
  maze[x*width+y]=0;
  y++;
  if (maze[x*width+y] == 2)
    win();
  if (maze[x*width+y] == -1)
    y--;
  maze[x*width+y]=1;
  updateDisplay();
}

var goDown = function(e) {
  maze[x*width+y]=0;
  x++;
  if (maze[x*width+y] == 2)
    win();
  if (maze[x*width+y] == -1)
    x--;
  maze[x*width+y]=1;
  updateDisplay();
}


document.addEventListener('press_up', goUp);
document.addEventListener('press_left', goLeft);
document.addEventListener('press_right', goRight);
document.addEventListener('press_down', goDown);

var moduleListener = function(event){
  switch(event.data.split("|")[0]) {
    case "Maze":
      maze = event.data.split("|")[1].split(";");
      startTime = new Date();
      updateDisplay();
      break;
    case "MazePlayerPosition":
      var split = event.data.split("|")[1].split("/");
      var pos = split[0];
      var color = split[1];
      if (maze[pos] != 1 && color != ClientSocket.webSocket.pp_data.color){
        if (enemies_coindex[color]){
          delete  enemies[enemies_coindex[color]];
        }

        enemies[pos] = color;
        enemies_coindex[color] = pos;
      }
      break;
    case "VictoryAnnouncement":
      document.removeEventListener('press_up', goUp);
      document.removeEventListener('press_left', goLeft);
      document.removeEventListener('press_right', goRight);
      document.removeEventListener('press_down', goDown);
      clearInterval(interval);
      alert(event.data);
      break;
    default:
  }
}

ClientSocket.plugModuleListener(moduleListener);
