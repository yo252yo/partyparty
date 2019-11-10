document.getElementById("answer").focus();
displayTimer(30);

// Define the function on window to make sure it's accessible from the HTML.
window.sendAnswer = function(){
  var proposal = document.getElementById("answer").value;
  ClientSocket.send("ProposeRiddleAnswer", proposal);  
  document.getElementById("answer").value = "";
  document.getElementById("answer").focus();
}

var moduleListener = function(event){ 
  switch(event.data.split("|")[0]) {
    case "RiddleQuestion":
      document.getElementById("riddle").innerHTML = event.data.split("|")[1];
      break;
    case "RiddleClue":
      document.getElementById("clue").innerHTML = event.data.split("|")[1];
      break;
    case "AnswerAnnouncement":
      alert(event.data.split("|")[1]);
      break;
    case "VictoryAnnouncement":
      alert(event.data);
      break;
    default:
  }
}

ClientSocket.plugModuleListener(moduleListener);
