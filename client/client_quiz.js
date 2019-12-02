// Define the function on window to make sure it's accessible from the HTML.
window.sendAnswer = function(){
  var proposal = document.getElementById("answer").value;
  ClientSocket.send("ProposeQuizzModuleAnswer", proposal);
  document.getElementById("answer").value = "";
  document.getElementById("answer").focus();
}


var initializeQuizModule = function(color){
	var quizbox = document.createElement("div");
  quizbox.class = "textbox_1";
  quizbox.style="background-color:" + color + ";";
	document.body.appendChild(quizbox);

  var riddle = createIddDiv(quizbox, 'riddle');
  riddle.innerHTML = '>Be patient!';
  createIddDiv(quizbox, 'clue');
  createIddDiv(quizbox, 'timer');

	var form = document.createElement("form");
  form.addEventListener('submit', window.sendAnswer);
  form.action="javascript:void(0);";
  quizbox.appendChild(form);

  var text = document.createElement("input");
  text.type = "text";
  text.id = "answer";
  form.appendChild(text);
  var button = document.createElement("input");
  button.type = "button";
  button.value = "propose";
  form.addEventListener('click', window.sendAnswer);
  form.appendChild(button);

  document.getElementById("answer").focus();
  displayTimer(30);
}

var quizModuleListener = function(event){
  switch(event.data.split("|")[0]) {
    case "QuizzModuleQuestion":
      document.getElementById("riddle").innerHTML = event.data.split("|")[1];
      break;
    case "QuizzModuleClue":
      document.getElementById("clue").innerHTML = event.data.split("|")[1];
      break;
    case "AnswerAnnouncement":
      alert(event.data.split("|")[1]);
      break;
    case "VictoryAnnouncement":
      clearTimer();
      alert(event.data);
      break;
    default:
  }
}
