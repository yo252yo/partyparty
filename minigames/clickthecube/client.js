var startTime;

var clickObjective = function (){
  alert("Done!");
  var duration = (new Date() - startTime);
  console.log("Sending" + duration);
  ClientSocket.send("DurationToClick", duration);
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

document.getElementById('div').innerHTML = "";

var moduleListener = function(event){ 
  switch(event.data.split("|")[0]) {
    case "ClickCubeCoordinates":
      var coordinates = event.data.split("|")[1].split("/");
      if (coordinates.length == 2){
        drawSquare(coordinates[0], coordinates[1]);
        startTime = new Date();
      } 
      break;
    case "VictoryAnnouncement":
      alert(event.data);
      break;
    default:
  }
}

ClientSocket.plugModuleListener(moduleListener);
