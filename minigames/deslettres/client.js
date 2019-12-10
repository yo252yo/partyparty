document.getElementById("answer").focus();
displayTimer(60);

window.sendAnswer = function(prefix){
  var proposal = document.getElementById("answer").value;
  ClientSocket.send(prefix, proposal);
  document.getElementById("answer").value = "";
  document.getElementById("answer").focus();
}

var moduleListener = function(event){
  console.log(event);
  switch(event.data.split("|")[0]) {
    case "DeslettresLettres":
      var letters = event.data.split("|")[1];
      document.getElementById("letters").innerHTML = letters;
      if (letters.split(",").length == 10) {
        document.getElementById("askbuttons").style.display = "none";
      }
      break;
    case "DeslettresYourword":
      var letters = event.data.split("|")[1];
      document.getElementById("yourword").innerHTML = letters;
      break;
    case "VictoryAnnouncement":
      alert(event.data);
      break;
    default:
  }
}

ClientSocket.plugModuleListener(moduleListener);
