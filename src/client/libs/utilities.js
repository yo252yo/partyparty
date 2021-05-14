
function appendToBody(text){
	var node = document.createElement("div");
	var newContent = document.createTextNode(text);
	node.appendChild(newContent);
	document.body.appendChild(node);
}

function createIddDiv(parent, name){
  var div = document.createElement("div");
  div.id = name;
  parent.appendChild(div);
  return div;
}

function updateTimer(seconds){
  if (document.getElementById("timer")){
    document.getElementById("timer").innerHTML = seconds + "s";
  }
}

var timer = 0;
var timerObject;

function tickInterval() {
  timer = timer - 1;
  if (timer <= 0) {
    clearInterval(timerObject);
  } else {
    updateTimer(timer);
  }
}

function displayTimer(seconds) {
  clearInterval(timerObject);
  timer = seconds;
  updateTimer(timer);
  timerObject = setInterval(tickInterval, 1000);

  console.log("Timer set for " + seconds);
}

function clearTimer() {
	if(timerObject){
	  clearInterval();
	}
}

function fireDocumentEvent(name){
  var event = new Event(name);
  document.dispatchEvent(event);
}
