
function appendToBody(text){
	var node = document.createElement("div");		
	var newContent = document.createTextNode(text); 
	node.appendChild(newContent);
	document.body.appendChild(node);
}


function displayTimer(seconds) {
  clearInterval();
  var timer = seconds;
  
  var updateTimer = function (){    
    if (document.getElementById("timer")){
      document.getElementById("timer").innerHTML = timer + "s";
    }
  }
  updateTimer();
  
  var tickInterval = function () {
    timer = timer - 1;
    updateTimer();
    if (timer <= 0) {
      clearInterval();
    }
  }
  setInterval(tickInterval, 1000);  
  
  console.log("Timer set for " + seconds);
}