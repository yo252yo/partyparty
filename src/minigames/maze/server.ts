import { LeastScoreWinner } from '../../classes/minigame_template.js';
import * as SocketManager from '../../modules/server_socket_manager.js';

var game = new LeastScoreWinner();

game.listener = function(object, socket){
  if (object.MazeEscapeDuration){
    game.scores.setScore(socket.player_data().player_id, object.MazeEscapeDuration);
    if(game.scores.isFull()){
      game.end();
    }
  }
  if (object.MazeMyPosition){
    SocketManager.broadcast({MazePlayerPosition: object.MazeMyPosition});
  }
}

// Game logic

// Maze parameters
var width = 27;
var height = 27;
var size = width*height;
var inwidth = (width-1)/2;
var inheight = (height-1)/2;
var insize = inwidth * inheight;
var twowidth = 2*width;


function change(l: number[], o:number, n:number){
  for (var k = 0; k < l.length; k++)
    if (l[k] == o)
      l[k] = n;
}

var makeMaze = function(){
  var maze = Array(size);
  var cell = Array(size);
  // Filling the maze with walls and setting up ids for each connected component
  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      if (i%2 && j%2) {
        maze[i*width+j] = 0;
        cell[i*width+j] = i*width+j;
      }
      else
        maze[i*width+j] = -1;
    }
  }

  // Shuffling walls
  var walls = [];
  for (var i = 0; i < inheight; i++) {
    for (var j = 0; j < inwidth - 1; j++) {
      walls.push([Math.random(),i*twowidth+j*2+width+2,1]);
      walls.push([Math.random(),j*twowidth+i*2+twowidth+1,width]);
    }
  }
  walls.sort();

  // Removing walls
  var count = 0;
  var index = 0;
  var current;
  var delta;
  while (count < insize-1) {
    current = walls[index][1];
    delta = walls[index][2];
    if (cell[current+delta] != cell[current-delta]) {
      change(cell,cell[current+delta],cell[current-delta]);
      maze[current] = 0;
      count++;
    }
    index++;
  }

/*  var count = 0;
  var spot;
  var o;
  var n;
  while (count < (height-1)/2*(width-1)/2-1) {
    if (Math.random() < 0.5) {
      i = Math.floor(Math.random()*6);
      j = Math.floor(Math.random()*5);
      spot = 2*i*width+2*j+width+1;
      if (maze[spot] != maze[spot+2]) {
        maze[spot+1] = 0;
        if (maze[spot] < maze[spot+2]){
          n = maze[spot];
          o = maze[spot+2];
        }
        if (maze[spot] > maze[spot+2]){
          n = maze[spot+2];
          o = maze[spot];
        }
        change(maze,o,n);
        count++;
      }
    }
    else {
      i = Math.floor(Math.random()*5);
      j = Math.floor(Math.random()*6);
      spot = 2*i*width+2*j+width+1;
      if (maze[spot] != maze[spot+2*width]) {
        maze[spot+width] = 0;
        if (maze[spot] < maze[spot+2*width]){
          n = maze[spot];
          o = maze[spot+2*width];
        }
        if (maze[spot] > maze[spot+2*width]){
          n = maze[spot+2*width];
          o = maze[spot];
        }
        change(maze,o,n);
        count++;
      }
    }
  }*/
  maze[width+1] = 1
  maze[height*width-width-2] = 2
  SocketManager.broadcast({Maze: maze});
};

setTimeout(makeMaze, 5000);


game.startWithDeadline(60000);
