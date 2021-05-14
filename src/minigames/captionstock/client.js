
ClientSocket.extraListener = function(object) {
  if (object.CaptionStockImg){
    document.getElementById("cs_img").src = object.CaptionStockImg;
    displayTimer(60);
  }
  dixitModuleListener(object);
}
