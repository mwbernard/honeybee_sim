let colBgGreen; // #EDFFF7
let colSection;
let bgBeehiveImg;
let foodMap;
let margin;

// ------------------------------------------------------
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  // colors
  colBgGreen = color(237, 255, 247);
  colSection = color(207, 246, 229);
  
  margin = 15;

  bgBeehiveImg = loadImage('../assets/bg-hive.svg');
  foodMap = new FoodMap(995, 400);
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
  foodMap.display();
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






// ------------------------------------------------------
class FoodMap {

  constructor(boundingWidth, boundingHeight) {
    this.width = boundingWidth;
    this.height = boundingHeight;

    // Instantiate new bee(s)
    // Constrain bee position and movement inside of FoodMap bounding box
    this.bee = new Honeybee(
      createVector(margin, height - (this.height + margin)),
      createVector(this.width + margin, height - margin)
    );
  }

  display() {
    rect(margin, height - (this.height + margin), this.width, this.height);
    this.bee.update();
    this.bee.display();
  }
}




// ------------------------------------------------------
class Honeybee {

  constructor(topLeftCorner, bottomRightCorner) {
    this.topLeftCorner = topLeftCorner;
    this.bottomRightCorner = bottomRightCorner;

    this.pos = createVector(
      random(topLeftCorner.x, bottomRightCorner.x),
      random(topLeftCorner.y, bottomRightCorner.y)
    );
    
    this.vel = createVector(random(2)-1, random(2)-1);
    this.acc = createVector(random(2)-1, random(2)-1);
    this.target;
    this.foodSource;
    this.mode;
  }

  update() {
    this.acc = createVector(random(2)-1, random(2)-1);
    this.acc.setMag(.1);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vel.setMag(1);

    if (this.pos.x < this.topLeftCorner.x) {
      this.pos.x = this.bottomRightCorner.x;
    } else if (this.pos.x > this.bottomRightCorner.x) {
      this.pos.x = this.topLeftCorner.x;
    }

    if (this.pos.y < this.topLeftCorner.y) {
      this.pos.y = this.bottomRightCorner.y;
    } else if (this.pos.y > this.bottomRightCorner.y) {
      this.pos.y = this.topLeftCorner.y;
    }
  }

  display() {
    push();

    rectMode(CENTER);
    noStroke();
    fill(20, 20, 20);
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());

    // draw bee
    ellipse(0, 0, 20, 5);
   
    pop();
  }
}