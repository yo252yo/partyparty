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


var drawCorrection = function(){
  console.log("Drawing correction at " + coordinates);
  var imageRect = document.getElementById("pickerMap").getBoundingClientRect();
//  var Ypercent = -1 * ((parseFloat(coordinates.split(",")[0]) + 90)/180 - 1);
  var Ypercent = 1-(parseFloat(coordinates.split(",")[0])+90)/180;
  var Xpercent = (parseFloat(coordinates.split(",")[1])+180)/360;
  var correctionX = window.scrollX + imageRect.x + imageRect.width * Xpercent;
  var correctionY = window.scrollY + imageRect.y + imageRect.height * Ypercent;
  console.log("> " + correctionX + "/" + correctionY);
  document.getElementById("correctionDiv").style.visibility = "visible";
  document.getElementById("correctionDiv").style.top = correctionY - 3;
  document.getElementById("correctionDiv").style.left = correctionX - 3;
}


var moduleListener = function(event){ 
  console.log("Received" + event.data);
  switch(event.data.split("|")[0]) {
    case "GeoguessCoords":
      coordinates = event.data.split("|")[1];
      document.getElementById("geoframe").src="https://www.gps-coordinates.net/street-view/@" + coordinates + ",h134,p8,z1";
      break;
    case "VictoryAnnouncement":
      drawCorrection();
      alert(event.data);
      break;
    default:
  }
}

ClientSocket.plugModuleListener(moduleListener);
