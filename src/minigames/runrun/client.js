
var avatarSize = 20;

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
var intervalBroadcast = setInterval(broadcastPosition, 400 + Math.floor(Math.random() * 100));

var step = function(from, to){
  var maxstep = 0.01;
  var diff = to - from;
  if (Math.abs(diff) > maxstep){
    diff = Math.sign(diff) * maxstep;
  }
  return diff;
}

var computePosition = function(){
  x = x + step(x, target_x);
  y = y + step(y, target_y);
  placePlayer(ClientSocket.webSocket.player_data.player_id, ClientSocket.webSocket.player_data.color, x, y);
};
var intervalPosition = setInterval(computePosition, 50);






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
    v.id = "div_" + player_id;
    area.appendChild(v);

    // TODO: make avatar
  }
  return v;
}

var placePlayer = function(player_id, player_color, pos_x, pos_y){
  var area = document.getElementById('area');
  var v = getOrMakeDiv(player_id, player_color);
  v.style.left = pos_x * area.getBoundingClientRect().width;
  v.style.top = pos_y * area.getBoundingClientRect().height;
}

ClientSocket.extraListener = function(object) {
  if (object.PlayerPosition){
    if (object.PlayerPosition.player_id == ClientSocket.webSocket.player_data.player_id){
      return;
    }
    placePlayer(object.PlayerPosition.player_id, object.PlayerPosition.player_color, object.PlayerPosition.x, object.PlayerPosition.y);

  }
  if (object.winnerAnnouncement) {
    document.removeEventListener('click', onClick);
    clearInterval(intervalBroadcast);
    clearInterval(intervalPosition);
  }
}
