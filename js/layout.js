let colBgGreen; // #EDFFF7
let colSection;
let bgBeehiveImg;

// ------------------------------------------------------
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  // colors
  colBgGreen = color(237, 255, 247);
  colSection = color(207, 246, 229);

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
  noStroke();
  fill(colSection);
  rect(15, height - 415, 995, 400);
}

// ------------------------------------------------------
function drawDanceInfo() {
  noStroke();
  fill(colSection);
  rect(1025, height - 415, 400, 400);
}

// ------------------------------------------------------
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}