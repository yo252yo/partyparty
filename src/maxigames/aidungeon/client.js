
ClientSocket.extraListener = function(object) {
  if(object.aidungeonLeader){
    console.log("Leader:" + object.aidungeonLeader);
    if(object.aidungeonLeader==ClientSocket.getPlayerId()){
        document.getElementById("dungeonblocker").style.display= "none";
    }
  }
};

var url = window.location.search.substr(1);
var dungeon = document.getElementById("dungeon_id").value;
if (url){
  dungeon = url;
}

// i believe this will fail 90% of the time, the site doesnt want to be iframed
document.getElementById("dungeonframe").src = "https://play.aidungeon.io/play/" + dungeon;
