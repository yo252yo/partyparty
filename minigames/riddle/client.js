window.sendAnswer = function(){
  var proposal = document.getElementById("answer").value;
  ClientSocket.send("ProposeRiddleAnswer", proposal);  
  document.getElementById("answer").value = "";
  document.getElementById("answer").focus();
}

document.getElementById("answer").focus();

var getServerInformation = function(event){ 
  console.log("Received" + event.data);
  if (event.data.split("|")[0] == "RiddleQuestion"){
    document.getElementById("riddle").innerHTML = event.data.split("|")[1];
  } 
  if (event.data.split("|")[0] == "RiddleClue"){
    document.getElementById("clue").innerHTML = event.data.split("|")[1];
  } 
  if (event.data.split("|")[0] == "VictoryAnnouncement"){
    alert(event.data);
  }
  if (event.data.split("|")[0] == "AnswerAnnouncement"){
    alert(event.data.split("|")[1]);
  }
}
ClientSocket.plugModuleListener(getServerInformation);
