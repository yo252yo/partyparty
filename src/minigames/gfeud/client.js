
ClientSocket.extraListener = function(object) {
  if (object.GFeudPrompt){
    document.getElementById("prompt").innerHTML = object.GFeudPrompt;
  }
}

displayTimer(90);
