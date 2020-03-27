let colBgGreen; // #EDFFF7
let colSection;
let bgBeehiveImg;
let centralBeehive;
let foodMap;
let margin;


// ------------------------------------------------------
function preload() {
  bgBeehiveImg = loadImage('../assets/bg-hive.svg');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  // colors
  colBgGreen = color(237, 255, 247);
  colSection = color(207, 246, 229);
  
  margin = 15;
  
  foodMap = new FoodMap(995, 400);
  centralBeehive = new CentralBeehive(3, bgBeehiveImg);
  centralBeehive.setupBees();
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
  centralBeehive.display();
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
class CentralBeehive {
  constructor(numBees, bgBeehiveImg) {
    this.numBees = numBees;
    this.bgImg = bgBeehiveImg;
    this.centralHoneybees = [];
  }

  setupBees() {
    for (let i = 0; i < this.numBees; i++) {
      console.log(this.bgImg.height);
      let centralBee = new CentralHoneybee(this.bgImg.width/2, this.bgImg.height/2);
      this.centralHoneybees.push(centralBee);
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
  
    // Bounding rectangle for beehive map
    rectMode(CENTER);
    noFill();
    stroke(0);
    rect(width/2, this.bgImg.height/2 + 40, this.bgImg.width, this.bgImg.height);
    rectMode(CORNER);
  }
}


//  ------------------------------------------------------
class CentralHoneybee {
  constructor(boundingLeftRight, boundingTopBottom) {
    
    this.pos = createVector(
      random((width/2 - boundingLeftRight) + 60, width/2 + (boundingLeftRight - 60)),
      random(60, (boundingTopBottom * 2) - 60)
    );

    console.log(this.pos);
  }

  display() {
    fill(0);
    circle(this.pos.x, this.pos.y, 20);
  }
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