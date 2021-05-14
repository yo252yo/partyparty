var startTime;
document.getElementById('div').innerHTML = "";

var clickObjective = function () {
  alert("Done!");
  var duration = (new Date() - startTime);
  console.log("Sending" + duration);
  ClientSocket.send({DurationToClick: duration});
}

var drawSquare = function(x,y){
	var node = document.createElement("div");
  node.style.backgroundColor = "blue";
  node.style.width = "30px";
  node.style.height = "30px";
  node.style.position = "absolute";
  node.style.top = x * 100 + "%";
  node.style.left = y * 100 + "%";
  node.onclick = clickObjective;

	var newContent = document.createTextNode("");
	node.appendChild(newContent);
	document.body.appendChild(node);
}

ClientSocket.extraListener = function(object) {
  if (object.ClickCubeCoordinates){
    drawSquare(object.ClickCubeCoordinates.x, object.ClickCubeCoordinates.y);
    startTime = new Date();
  }
}
