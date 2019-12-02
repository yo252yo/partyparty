
document.addEventListener('keydown', function(e) {
    var key = event.keyCode;
    var character = String.fromCharCode(event.keyCode).toLowerCase();
    if (character == "w" || key == 38 || key == 104) {
      fireDocumentEvent('press_up');
    }
    if (character == "a" || key == 37 || key == 100) {
      fireDocumentEvent('press_left');
    }
    if (character == "d" || key == 39 || key == 102) {
      fireDocumentEvent('press_right');
    }
    if (character == "s" || key == 40 || key == 98) {
      fireDocumentEvent('press_down');
    }
});

document.addEventListener('click', function(event) {
	var grid_x = Math.floor(3* event.clientX / window.innerWidth);
	var grid_y = Math.floor(3* event.clientY / window.innerHeight);

  if (grid_x == 0) {
    fireDocumentEvent('press_left');
  } else if (grid_x == 2) {
    fireDocumentEvent('press_right');
  }

	if (grid_y == 0) {
    fireDocumentEvent('press_up');
  } else if (grid_y == 2) {
    fireDocumentEvent('press_down');
  }
});
