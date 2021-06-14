
var avatarSize = 40;
var enemies = [];
var otherPlayers = {};

var collisiondistance = 0.03;
var tick = 50;
var maxstep = 0.015;

var x = 0;
var y = 0;
var target_x = 0;
var target_y = 0;

var onClick = function(e){
  var area = document.getElementById('area');
  target_x = (e.pageX - area.getBoundingClientRect().x - avatarSize/2) / area.getBoundingClientRect().width;
  target_y = (e.pageY - area.getBoundingClientRect().y - avatarSize/2) / area.getBoundingClientRect().height;
}
document.addEventListener('click', onClick);

var broadcastPosition = function(){
  ClientSocket.send({
    MyPosition:  {
      x: x,
      y: y,
      player_color: ClientSocket.webSocket.player_data.color,
      player_id: ClientSocket.webSocket.player_data.player_id,
    }
  });
};
//var intervalBroadcast = setInterval(broadcastPosition, 400 + Math.floor(Math.random() * 100));

var step = function(from, to){
  var diff = to - from;
  if (Math.abs(diff) > maxstep){
    diff = Math.sign(diff) * maxstep;
  }
  return diff;
}

var updateEnemies = function() {
  for (var i in enemies){
//    console.log(1);
    var e = enemies[i];
    if (e.x > 0.95 && e.dx > 0){
      e.dx = - e.dx;
    }
    if (e.x < 0.05 && e.dx < 0){
      e.dx = - e.dx;
    }

    if (e.y > 0.95 && e.dy > 0){
      e.dy = - e.dy;
    }
    if (e.y < 0.05 && e.dy < 0){
      e.dy = - e.dy;
    }

    e.x += e.dx;
    e.y += e.dy;

    placePlayer("enemy_" + i, "#FF0000", e.x, e.y);

    if (Math.abs(e.x-x) < collisiondistance && Math.abs(e.y-y) < collisiondistance){
      x = 0;
      y = 0;
      target_x = 0;
      target_y = 0;
      return true;
    }
  }
}

var collisionPlayer = function(x, y){
  for(var ai in otherPlayers){
    var a = otherPlayers[ai];
    if (Math.abs(a.x-x) < collisiondistance && Math.abs(a.y-y) < collisiondistance){
      return true;
    }
  }
  return false;
}

var computePosition = function(){
  var has_tp = updateEnemies();

  dx = step(x, target_x);
  dy = step(y, target_y);
  if (dx == 0 && dy == 0 && !has_tp){ return; }
  if( x > 0.1 && y>0.1 && collisionPlayer(x+dx, y+dy)){ return; }

  x = x + dx;
  y = y + dy;
  placePlayer(ClientSocket.webSocket.player_data.player_id, ClientSocket.webSocket.player_data.color, x, y);
  broadcastPosition();
};
var intervalPosition = setInterval(computePosition, tick);






var getOrMakeDiv = function(player_id, player_color){
  var area = document.getElementById('area');
  var v = document.getElementById("div_" + player_id);
  if (!v){
    var v = document.createElement("div");
    v.style.background = ClientHTMLTemplates.invertColor(player_color);
    v.style.border = "thick solid " + player_color;
    v.style.width = avatarSize + "px";
    v.style.height = avatarSize + "px";
    v.style.position = "absolute";
    v.unselectable = "on";
    v.class="unselectable";
    v.id = "div_" + player_id;
    if(!player_id.startsWith("enemy_")){
      v.innerHTML = ClientHTMLTemplates.makeOnePlayerDiv({player_id: player_id, color: player_color}, avatarSize-1);
    } else{
      v.innerHTML = `<img src='client/assets/games/runner.png' style="width:${avatarSize-1}px;height:${avatarSize-1}px;" />`;
    }
    area.appendChild(v);
  }
  return v;
}

var placePlayer = function(player_id, player_color, pos_x, pos_y){
  var area = document.getElementById('area');
  var v = getOrMakeDiv(player_id, player_color);
  v.style.left = pos_x * area.getBoundingClientRect().width;
  v.style.top = pos_y * area.getBoundingClientRect().height;
}


var makeEnemy = function (index, enemy) {
  placePlayer("enemy_" + index, "#FF0000", enemy.x, enemy.y);
  enemies[index] = enemy;
}

ClientSocket.extraListener = function(object) {
  if (object.PlayerPosition){
    if (object.PlayerPosition.player_id == ClientSocket.webSocket.player_data.player_id){
      return;
    }
    otherPlayers[object.PlayerPosition.player_id] = object.PlayerPosition;
    placePlayer(object.PlayerPosition.player_id, object.PlayerPosition.player_color, object.PlayerPosition.x, object.PlayerPosition.y);
  }
  if (object.Enemies){
    for(var i in object.Enemies){
      makeEnemy(i, object.Enemies[i]);
    }
  }
  if (object.winnerAnnouncement) {
    document.removeEventListener('click', onClick);
    //clearInterval(intervalBroadcast);
    clearInterval(intervalPosition);
  }
}

placePlayer(ClientSocket.webSocket.player_data.player_id, ClientSocket.webSocket.player_data.color, x, y);
