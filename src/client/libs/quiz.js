
// Define the function on window to make sure it's accessible from the HTML.
window.sendAnswer = function(){
  var proposal = document.getElementById("answer").value;
  ClientSocket.send({ProposeQuizzModuleAnswer: proposal});
  document.getElementById("answer").value = "";
  document.getElementById("answer").focus();
}

window.sendVote = function(){
  var vote = document.forms.voting.elements.vote.value;
  if (vote) {
    ClientSocket.send({ProposeQuizzModuleVote: vote});
  }
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
  form.addEventListener('submit', function(){window.sendAnswer()});
  form.action="javascript:void(0);";
  quizbox.appendChild(form);

  var text = document.createElement("input");
  text.type = "text";
  text.id = "answer";
  form.appendChild(text);
  var button = document.createElement("input");
  button.type = "button";
  button.value = "propose";
  form.addEventListener('click', function(){window.sendAnswer()});
  form.appendChild(button);

  document.getElementById("answer").focus();
}

var quizModuleListener = function(object) {
  if (object.QuizzModuleQuestion){
    document.getElementById("riddle").innerHTML = object.QuizzModuleQuestion;
    displayTimer(30);
  }
  if (object.QuizzModuleClue){
    document.getElementById("clue").innerHTML = object.QuizzModuleClue;
  }
  if (object.QuizzModuleAnswerAnnouncement){
    alert("The answer is: " + object.QuizzModuleAnswerAnnouncement);
  }
}

var makeVotingScreen = function(proposals){
  var html = "Pick your favorite answer:";
  html += "<form name='voting'>";
  for(var id in proposals) {
    for (var i in proposals[id]){
      if (id == ClientSocket.getPlayerId()) { html += "<i>"; }
      else { html += "<input type='radio' name='vote' value='" + id + "'>"; }
      html += proposals[id][i] + "<br />";
      if (id == ClientSocket.getPlayerId()) { html += "</i>"; }
    }
  }
  html += "</form>";
  document.getElementById("board").innerHTML = html;
  setTimeout(window.sendVote, 30000);
}

var dixitModuleListener = function(object){
  if (object.DixitLikeProposals){
    makeVotingScreen(object.DixitLikeProposals);
    displayTimer(30);
  }
}
