
ClientSocket.extraListener = function(object) {
  if (object.DeslettresLettres){
    document.getElementById("letters").innerHTML = object.DeslettresLettres.join();
    if (object.DeslettresLettres.length == 13) {
      document.getElementById("askbuttons").style.display = "none";
    }
  }
  if (object.DeslettresYourword){
    document.getElementById("yourword").innerHTML = object.DeslettresYourword;
  }
  if (object.DeslettresWord){
    document.getElementById("answers").innerHTML = object.DeslettresWord + "<br />" + document.getElementById("answers").innerHTML;
  }
}

displayTimer(75);
