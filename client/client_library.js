
function appendToBody(text){
	var node = document.createElement("div");		
	var newContent = document.createTextNode(text); 
	node.appendChild(newContent);
	document.body.appendChild(node);
}

function updateTimer(seconds){    
  if (document.getElementById("timer")){
    document.getElementById("timer").innerHTML = seconds + "s";
  }
}

function displayTimer(seconds) {
  clearInterval();
  var timer = seconds;
  
  updateTimer(timer);
  
  var tickInterval = function () {
    timer = timer - 1;
    updateTimer(timer);
    if (timer <= 0) {
      clearInterval();
    }
  }
  setInterval(tickInterval, 1000);  
  
  console.log("Timer set for " + seconds);
}