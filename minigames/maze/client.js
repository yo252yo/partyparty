var startTime;
var win = function (){
  alert("You escaped!");
  var duration = (new Date() - startTime);
  console.log("Sending" + duration);
  ClientSocket.send("DurationToClick", duration);
}

// Maze parameters
var maze;
var height = 27;
var width = 27;

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
  var text = '';
  var spot = 0;
  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      if (maze[spot] == '-1')
        text += '#';
      if (maze[spot] == '0')
        text += '&nbsp;';
      if (maze[spot] == '1')
        text += '@';
      if (maze[spot] == '2')
        text += '&lt;';
      spot++;
    }
    text += '<br>'
  }
  document.getElementById("maze").innerHTML = text;
}

// Key presses to move
var x = 1;
var y = 1;
document.addEventListener('keydown', function(e) {
    var ok = false;
    var touche = String.fromCharCode(e.keyCode).toLowerCase();
    var key = e.keyCode;
    if (touche == "k" || key == 38 || key == 104) {
      maze[x*width+y]=0;
      x--;
      if (maze[x*width+y] == 2)
        win();
      if (maze[x*width+y] == -1)
        x++;
      maze[x*width+y]=1;
    }
    if (touche == "h" || key == 37 || key == 100) {
      maze[x*width+y]=0;
      y--;
      if (maze[x*width+y] == 2)
        win();
      if (maze[x*width+y] == -1)
        y++;
      maze[x*width+y]=1;
    }
    if (touche == "l" || key == 39 || key == 102) {
      maze[x*width+y]=0;
      y++;
      if (maze[x*width+y] == 2)
        win();
      if (maze[x*width+y] == -1)
        y--;
      maze[x*width+y]=1;
    }
    if (touche == "j" || key == 40 || key == 98) {
      maze[x*width+y]=0;
      x++;
      if (maze[x*width+y] == 2)
        win();
      if (maze[x*width+y] == -1)
        x--;
      maze[x*width+y]=1;
    }
    updateDisplay();
}, false);


var moduleListener = function(event){ 
  switch(event.data.split("|")[0]) {
    case "Maze":
      maze = event.data.split("|")[1].split(";");
      startTime = new Date();
      updateDisplay();
      break;
    case "VictoryAnnouncement":
      alert(event.data);
      break;
    default:
  }
}

ClientSocket.plugModuleListener(moduleListener);