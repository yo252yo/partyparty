console.log("Minigame TEST loaded");

setTimeout(function(){
  PLAYERS.broadcastMessage(Math.random() + "/" + Math.random());
}, 5000);
