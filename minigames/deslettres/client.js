document.getElementById("answer").focus();
displayTimer(75);

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
      if (letters.split(",").length == 13) {
        document.getElementById("askbuttons").style.display = "none";
      }
      break;
    case "DeslettresYourword":
      var letters = event.data.split("|")[1];
      document.getElementById("yourword").innerHTML = letters;
      break;
    case "DeslettresWord":
      var letters = event.data.split("|")[1];
      document.getElementById("answers").innerHTML = letters + "<br />" + document.getElementById("answers").innerHTML;
      break;
    case "VictoryAnnouncement":
      alert(event.data);
      break;
    default:
  }
}

ClientSocket.plugModuleListener(moduleListener);
