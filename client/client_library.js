
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
    if (timer <= 0) {
      clearInterval();
    } else {
      updateTimer(timer);
    }
  }
  setInterval(tickInterval, 1000);  
  
  console.log("Timer set for " + seconds);
}

function fireDocumentEvent(name){
  var event = new Event(name);
  document.dispatchEvent(event);  
}

document.addEventListener('keydown', function(e) {
    var key = event.keyCode;
    var character = String.fromCharCode(event.keyCode).toLowerCase();
    if (character == "w" || key == 38 || key == 104) {
      fireDocumentEvent('press_up');
    }
    if (character == "a" || key == 37 || key == 100) {
      fireDocumentEvent('press_left');
    }
    if (character == "d" || key == 39 || key == 102) {
      fireDocumentEvent('press_right');
    }
    if (character == "s" || key == 40 || key == 98) {
      fireDocumentEvent('press_down');
    }
});

document.addEventListener('click', function(event) {
    var isTopRight = event.clientX > event.clientY;
    var isTopLeft = event.clientX < window.innerHeight - event.clientY;
    
    if (!isTopRight && isTopLeft) {
      fireDocumentEvent('press_left');
    } else if (isTopRight && !isTopLeft) {
      fireDocumentEvent('press_right');
    } else if (isTopRight && isTopLeft) {
      fireDocumentEvent('press_up');
    } else if (!isTopRight && !isTopLeft) {
      fireDocumentEvent('press_down');
    }
});