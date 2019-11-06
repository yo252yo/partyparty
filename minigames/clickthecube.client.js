
clickObjective = function (){
  alert("Done!");
  var duration = (new Date() - startTime);
  console.log("Sending" + duration);
  SOCKET.send(duration);
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

drawServerInformation = function(event){ 
  coordinates = event.data.split("/");
  if (coordinates.length == 2){
    drawSquare(coordinates[0], coordinates[1]);
    startTime = new Date();
  } else if (event.data.startsWith("Victory")) {
    alert(event.data);
  }
}
console.log(SOCKET);

document.getElementById('div').innerHTML = "";

SOCKET.plugModuleListener(drawServerInformation);
