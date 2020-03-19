let colBgGreen; // #EDFFF7
let bgBeehiveImg;

// ------------------------------------------------------
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  colBgGreen = color(237, 255, 247);
  bgBeehiveImg = loadImage('../assets/bg-hive.svg');
}

// ------------------------------------------------------
function draw() {
  background(colBgGreen);
  drawCentralBeehive();
  drawFoodMap();
  drawDanceInfo();
}

// ------------------------------------------------------
function drawCentralBeehive() {
  imageMode(CENTER);
  image(bgBeehiveImg, width/2, bgBeehiveImg.height/2 + 40);
  
  // Bounding rectangle for beehive map
  // rectMode(CENTER);
  // noFill();
  // rect(width/2, bgBeehiveImg.height/2 + 40, bgBeehiveImg.width, bgBeehiveImg.height);
}

// ------------------------------------------------------
function drawFoodMap() {

}

// ------------------------------------------------------
function drawDanceInfo() {

}

// ------------------------------------------------------
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}