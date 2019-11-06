appendToBody('!!' + Date.now() + ' - ' + text);

function appendToBody(text){
	var node = document.createElement("div");		
	var newContent = document.createTextNode(text); 
	node.appendChild(newContent);
	document.body.appendChild(node);
}

appendToBody('!!' + Date.now() + ' - ' + "papapi");

console.log("Aaa");
console.log(ws);

SOCKET.send("tatata");




function sendVal(value){
	appendToBody(">>>>" + Date.now() + " - " + document.getElementById('field').value); 	
	
	ws.send(document.getElementById('field').value);
	document.getElementById('field').value="";
};*/


function appendToBody(text){
	var node = document.createElement("div");		
	var newContent = document.createTextNode(text); 
	node.appendChild(newContent);
	document.body.appendChild(node);
}