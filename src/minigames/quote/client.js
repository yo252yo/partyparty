
ClientSocket.extraListener = function(object) {
  if (object.Quote){
    document.getElementById("quote").innerHTML = object.Quote;
    displayTimer(60);
  }
  dixitModuleListener(object);
}
