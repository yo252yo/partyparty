var coordinates = "";

var getPositionOfClick = function(event){
  var imageRect = document.getElementById("pickerMap").getBoundingClientRect();
  var clickXpercent = (event.clientX - imageRect.x) / imageRect.width;
  var clickYpercent = (event.clientY - imageRect.y) / imageRect.height;

  var lat = (1-clickYpercent) * 180 - 90;
  var lng = clickXpercent * 360 - 180;
  console.log("Submitting " + lat + "," + lng);
  ClientSocket.send("GeoguessAnswerProposal", lat + "," + lng);
}
document.getElementById("pickerMap").addEventListener("click", getPositionOfClick);

var makeCorrectionDiv = function(id, color){
  var div = document.createElement("div");
  div.id = id;
  div.style['background-color'] = invertColor(color);
  div.style['color'] = color;
  div.style['opcaity'] = "0.5";
  div.style['width'] = "10px";
  div.style['height'] = "10px";
  div.style['position'] = "absolute";
  div.style['font-size'] = "6pt";
  div.style['visibility'] = "hidden";
  div.style['display'] = "inline-block";
  div.innerHTML = "@";
  document.body.appendChild(div);
}

var drawCorrection = function(id, coordinates){
  var imageRect = document.getElementById("pickerMap").getBoundingClientRect();
  var Ypercent = 1-(parseFloat(coordinates.split(",")[0])+90)/180;
  var Xpercent = (parseFloat(coordinates.split(",")[1])+180)/360;
  var correctionX = window.scrollX + imageRect.x + imageRect.width * Xpercent;
  var correctionY = window.scrollY + imageRect.y + imageRect.height * Ypercent;
  document.getElementById(id).style.visibility = "visible";
  document.getElementById(id).style.top = correctionY - document.getElementById(id).getBoundingClientRect().height/2;
  document.getElementById(id).style.left = correctionX - document.getElementById(id).getBoundingClientRect().width/2;
}


var moduleListener = function(event){
  try { // only expects objects
    var object = JSON.parse(event.data); // switch object.messageKey
    if (object.messageKey != "GeoguessPlayerResults"){ return ""; }
    for(var i in object.players){
      var player = object.players[i];
      var div_id = "correction_" + player.pp_data.player_id;
      makeCorrectionDiv(div_id, player.pp_data.color);
      drawCorrection(div_id, player.score);
    }
  }
  catch(error) {  // For strings
    switch(event.data.split("|")[0]) {
      case "GeoguessCoords":
        coordinates = event.data.split("|")[1];
        var lat = Math.round(coordinates.split(",")[0]*1e6).toString(36);
        var long = Math.round(coordinates.split(",")[1]*1e6).toString(36);
        console.log("http://randomstreetview.com/#" + lat + "_" + long + "_u_e_5");
        document.getElementById("geoframe").src="http://randomstreetview.com/#" + lat + "_" + long + "_u_e_5";
        //document.getElementById("geoframe").src="https://www.gps-coordinates.net/street-view/@" + coordinates + ",h134,p8,z1";
        //window.open("https://www.instantstreetview.com/@" + coordinates + ",h134,p8,z1");
        break;
      case "VictoryAnnouncement":
        console.log("Drawing correction at " + coordinates);
        drawCorrection("correctionDiv", coordinates);
        alert(event.data);
        break;
      default:
    }
  }
}

ClientSocket.plugModuleListener(moduleListener);
