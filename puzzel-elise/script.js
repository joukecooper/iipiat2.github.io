var rows = 3;
var columns = 3;

var currentTile;
var otherTile;

var turns;
// var startingImgOrder = ["4", "2", "8", "5", "1", "6", "7", "3", "9"];
var startingImgOrder = ["8", "4", "6", "5", "3", "7", "2", "1", "9"];
const correctImgOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

var highScoreIndex = 0;

window.onload = function () {
  createBoard();

  let resetButton = document.getElementById("reset-button");
  resetButton.addEventListener("click", resetBoard);

  let helpButton = document.getElementById("help-button");
  helpButton.addEventListener("click", helpPopup);

  let giveUpButton = document.getElementById("give-up-button");
  giveUpButton.addEventListener("click", giveUp);

  checkHighscore();
  overlayOff();
};

function createBoard() {
  startingImgOrder = ["8", "4", "6", "5", "3", "7", "2", "1", "9"];

  turns = 0;
  document.getElementById("turns").innerHTML = turns;

  createTiles();
}

function resetBoard() {
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }
  createBoard();
}

function checkIfPuzzleSolved() {
  const tiles = document.querySelectorAll("#board img");
  const currentOrder = Array.from(tiles).map((tile) =>
    tile.src.split("/").pop().replace(".avif", "")
  );

  // if player has won
  if (currentOrder.toString() === correctImgOrder.toString()) {
    updateHighScore();
    overlayOn();
  }
}

function giveUp() {
  var winOrLoseHeader = document.getElementById("win-or-lose-header");
  winOrLoseHeader.innerHTML = "Are you sure you want to give up?";
  overlayOn();
}

function createTiles() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("img");
      tile.id = r.toString() + "-" + c.toString();
      tile.src = "images/" + startingImgOrder.shift() + ".avif";

      // * Desktop
      tile.addEventListener("mousedown", dragStart);
      tile.addEventListener("mouseup", dragDrop);

      // Add mobile touch events
      tile.addEventListener("touchstart", dragStart);
      tile.addEventListener("touchend", dragDrop);

      document.getElementById("board").append(tile);
    }
  }
}

function dragStart(e) {
  e.preventDefault(); // Prevent default behavior for touch events
  if (e.type === "mousedown" || e.type === "touchstart") {
    if (e.type === "touchstart") {
      e = e.touches[0];
    }
    currentTile = this;
  }
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
}

function dragLeave() {}

function dragDrop(e) {
  e.preventDefault(); // Prevent default behavior for touch events
  if (e.type === "mouseup" || e.type === "touchend") {
    if (e.type === "touchend") {
      e = e.changedTouches[0];
    }
    otherTile = document.elementFromPoint(e.clientX, e.clientY);
    dragEnd();
  }
}

function dragEnd() {
  if (!otherTile.src.includes("9.avif")) {
    return;
  }
  let currentCoordsTile = currentTile.id.split("-");
  let currentRowPosX = parseInt(currentCoordsTile[0]);
  let currentColumnPosY = parseInt(currentCoordsTile[1]);

  let otherCoordsTile = otherTile.id.split("-");
  let otherRowPosX = parseInt(otherCoordsTile[0]);
  let otherColumnPosY = parseInt(otherCoordsTile[1]);

  moveTile(currentRowPosX, currentColumnPosY, otherRowPosX, otherColumnPosY);
}

function touchCancel(e) {
  e.preventDefault;
}

function moveTile(
  currentRowPosX,
  currentColumnPosY,
  otherRowPosX,
  otherColumnPosY
) {
  let moveLeft =
    currentRowPosX == otherRowPosX && otherColumnPosY == currentColumnPosY - 1;
  let moveRight =
    currentRowPosX == otherRowPosX && otherColumnPosY == currentColumnPosY + 1;

  let moveUp =
    currentColumnPosY == otherColumnPosY && otherRowPosX == currentRowPosX - 1;
  let moveDown =
    currentColumnPosY == otherColumnPosY && otherRowPosX == currentRowPosX + 1;

  checkAdjacentTiles(moveLeft, moveRight, moveUp, moveDown);
}

function checkAdjacentTiles(moveLeft, moveRight, moveUp, moveDown) {
  let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

  if (isAdjacent) {
    let currentImage = currentTile.src;
    let otherImage = otherTile.src;

    currentTile.src = otherImage;
    otherTile.src = currentImage;

    turns += 1;
    document.getElementById("turns").innerHTML = turns;

    if (turns >= 30) {
      let giveUpButton = document.getElementById("give-up-button");
      giveUpButton.style.display = "block";
    }
  }

  checkIfPuzzleSolved();
}

function checkHighscore() {
  if (!localStorage.getItem("highscore")) {
    localStorage.setItem("highscore", turns);
    document.getElementById("highscore").innerHTML =
      "Your highscore: " + localStorage.getItem("highscore");
  } else {
    document.getElementById("highscore").innerHTML =
      "Your highscore: " + localStorage.getItem("highscore");
  }
}

function updateHighScore() {
  if (turns < localStorage.getItem("highscore")) {
    localStorage.setItem("highscore", turns);
    document.getElementById("highscore").innerHTML =
      "Your highscore: " + localStorage.getItem("highscore");
  } else {
    document.getElementById("highscore").innerHTML =
      "Your highscore: " + localStorage.getItem("highscore");
  }
}

function helpPopup() {
  alert(
    "Drag the tiles until the image is like the original image. The brown / red block should be on the bottom right."
  );
}

function overlayOn() {
  document.getElementById("highscore-container").style.display = "none";
  document.getElementById("puzzle-container").style.display = "none";
  document.getElementById("example-image").style.display = "none";

  var bodyContainer = document.getElementById("body-container");
  bodyContainer.style.gridTemplateColumns = "auto";

  document.getElementById("overlay").style.display = "flex";
  document.getElementsByTagName("body").style.display = "flex";
}

function overlayOff() {
  var bodyContainer = document.getElementById("body-container");

  if (!bodyContainer.style.display == "grid") {
    document.getElementById("highscore-container").style.display = "flex";
    document.getElementById("puzzle-container").style.display = "flex";
    document.getElementById("example-image").style.display = "flex";
  
    bodyContainer.style.gridTemplateColumns = "120px auto 120px";
  
    document.getElementById("overlay").style.display = "none";
  }
}
