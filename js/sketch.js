let colBgGreen;
let colBlue;
let colSection;

let foodMap;
let centralBeehive;
let margin;

let bgBeehiveImg;
let beeImage;
let hiveImage;

let lav_baby;
let lav_adult;
let pink_baby;
let pink_adult;
let yel_baby;
let yel_adult;
let flower_dead;


let skyColor = "#9FB5DE";
let morningImg, dayImg, nightImg;
let lowerImg;


// ------------------------------------------------------
function preload() {
  beeImage         = loadImage('../assets/icon-bee.png');
  hiveImage        = loadImage('../assets/icon-hive.png');

  bgBeehiveImg     = loadImage('../assets/bg-hive.svg');


  lav_baby        = loadImage('../assets/lavender_baby.png');
  lav_adult       = loadImage('../assets/lavender_adult.png');
  pink_baby       = loadImage('../assets/pink_baby.png');
  pink_adult      = loadImage('../assets/pink_adult.png');
  yel_baby        = loadImage('../assets/yellow_baby.png');
  yel_adult       = loadImage('../assets/yellow_adult.png');
  flower_dead     = loadImage('../assets/flower_dead.png');
}

// ------------------------------------------------------
function setup() {

  createCanvas(window.innerWidth, window.innerHeight);
  figureEightImageElem = document.getElementById('figure-8');
  console.log(figureEightImageElem);

  // font
  textFont(inconsolata);

  // colors
  colBgGreen = color(237, 255, 247);
  colSection = color(207, 246, 229);
  colBlue = color(58, 25, 255);

  margin = 15;
  foodMap = new FoodMap(width - 2*margin, 400);
  centralBeehive = new CentralBeehive(20, bgBeehiveImg);
  centralBeehive.setupBees();
}


// ------------------------------------------------------
function draw() {
  background(skyColor);
  drawCentralBeehive();
  drawFoodMap();

  // Maybe this can move into the CentralBeehive class? Not sure
  for (let i = 0; i < centralBeehive.centralHoneybees.length; i++) {
    if (centralBeehive.centralHoneybees[i].contains(mouseX, mouseY)) {
      centralBeehive.centralHoneybees[i].handleHover();
    }
  }
}


// ------------------------------------------------------
function drawCentralBeehive() {
  centralBeehive.display();
}


// ------------------------------------------------------
function drawFoodMap() {
  noStroke();
  fill(colSection);
  foodMap.update();
  foodMap.display();
}

// ------------------------------------------------------
// adds food on mouse click
function mousePressed() {
  // rect(margin, height - (this.height + margin), this.width, this.height);
  if (mouseX > margin + 20 && mouseX < width - 35 && mouseY > height - 400 && mouseY < height - margin - 20) {
    foodMap.hive.foodSources.push(new FoodSource(mouseX,height - margin,0));
  // print(foodMap.foodSources);
  }
}


// ------------------------------------------------------
function findObjectByKey(array, key, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i][key] === value) {
      return array[i];
    }
  }
  return null;
}


// ------------------------------------------------------
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


// ------------------------------------------------------
// CLASSES
// ------------------------------------------------------
class CentralBeehive {
  constructor(numBees, bgBeehiveImg) {
    this.numBees = numBees;
    this.bgImg = bgBeehiveImg;
    this.centralHoneybees = [];
  }

  setupBees() {
    for (let i = 0; i < this.numBees; i++) {
      this.centralHoneybees.push(new CentralHoneybee(this.bgImg.width/2, this.bgImg.height/2));
    }
  }

  drawBees() {
    for (let i = 0; i < this.centralHoneybees.length; i++) {
      this.centralHoneybees[i].display();
    }
  }

  display() {

    imageMode(CENTER);
    image(this.bgImg, width/2, this.bgImg.height/2 + 40);
    this.drawBees();

  
  }
}



// ------------------------------------------------------
class CentralHoneybee {

  constructor(boundingLeftRight, boundingTopBottom) {
    this.pos = createVector(
      random((width/2 - boundingLeftRight) + 60, width/2 + (boundingLeftRight - 60)),
      random(60, (boundingTopBottom * 2) - 60)
    );
    this.rotAmt = random(PI/2);
    this.distanceFromFood = random(0, 5).toFixed(1);
    this.randomAngleFromSun = random(0, 180).toFixed(0);
  }

  // ------------------------------------------------------
  contains(mx, my) {
    return dist(mx, my, this.pos.x, this.pos.y) < 20;
  }

  // ------------------------------------------------------
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rotAmt);
    image(beeImage, 0, 0, 40, 40);
    pop();
  }

  // ------------------------------------------------------
  handleHover() {
    let d = dist(mouseX, mouseY, this.pos.x, this.pos.y);
    if (d < 20) {
      noFill();
      stroke(colBlue);
      strokeWeight(4);
      fill(0, 255, 195);
      circle(this.pos.x, this.pos.y, 45);
      this.display();
    }
  }


}
