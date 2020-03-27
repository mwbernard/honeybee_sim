let colBgGreen;
let colSection;

let foodMap;
let centralBeehive;
let margin;

let bgBeehiveImg;
let beeImage;
let hiveImage;
let foodImage;


// ------------------------------------------------------
function preload() {
  beeImage     = loadImage('../assets/icon-bee.png');
  hiveImage    = loadImage('../assets/icon-hive.png');
  foodImage    = loadImage('../assets/icon-flower.png');
  bgBeehiveImg = loadImage('../assets/bg-hive.svg');
}

// ------------------------------------------------------
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
  foodMap.display();
}


// ------------------------------------------------------
function drawDanceInfo() {
  noStroke();
  fill(colSection);
  rectMode(CORNER);
  rect(1025, height - 415, 400, 400);
  rectMode(CENTER);
}


// ------------------------------------------------------
// double checks whether each bee's target is real
function verify_targets(bees, foods, hive_food) {
  for (let i = 0; i < bees.length; i++) {
    if (bees[i].target != null) {
      if (findObjectByKey(foods, "id", bees[i].target.x * bees[i].target.y) == null && bees[i].full == false) {
        // print("item cleared");
        hive_food.splice(findObjectByKey(hive_food, "x", bees[i].target.x));
        bees[i].target = null;
      }
    }
  }
}


// ------------------------------------------------------
// checks if each bee is hitting food currently
function check_food_collisions(some_bees, some_food) {

  for (let j = 0; j < some_bees.length; j++) {
    for (let i = 0; i < some_food.length; i++) {

      if (some_bees[j].check_collision(some_food[i].pos.x, some_food[i].pos.y) && some_bees[j].full != true) {
        some_food[i].subPollen();
        some_bees[j].fillUp();
        some_bees[j].foundFoodSource = some_food[i].pos;
      }
      if (some_food[i].pollen == 0) {
        // print("hi");
        some_food.splice(i,1);
      }
    }
  }
}


// ------------------------------------------------------
// adds food on mouse click
function mousePressed() {
  // rect(margin, height - (this.height + margin), this.width, this.height);
  if (mouseX > margin + 20 && mouseX < 990 && mouseY > height - 400 && mouseY < height - margin - 20) {
    foodMap.foodSources.push(new FoodSource(mouseX,mouseY));
  // print(foodMap.foodSources);
  }
}


// ------------------------------------------------------
function drawFoodSources() {
  for (var i = 0; i < foodMap.foodSources.length; i++) {
    foodMap.foodSources[i].display();
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
  
    // Bounding rectangle for beehive map
    // rectMode(CENTER);
    // noFill();
    // stroke(0);
    // rect(width/2, this.bgImg.height/2 + 40, this.bgImg.width, this.bgImg.height);
    // rectMode(CORNER);
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
      stroke(0);
      strokeWeight(1);
      circle(this.pos.x, this.pos.y, 40);
    }
  }

}



// ------------------------------------------------------
class FoodMap {

  // ------------------------------------------------------
  constructor(boundingWidth, boundingHeight) {
    this.width = boundingWidth;
    this.height = boundingHeight;
    this.bees = [];
    this.beePop = 10;
    this.foodSources = [];
    
    this.hive = new Hive(
      createVector(margin, height - (this.height + margin)),
      createVector(this.width + margin, height - margin)
    );

    // Instantiate new bee(s)
    // Constrain bee position and movement inside of FoodMap bounding box

    for (let i = 0; i < this.beePop; i++) {  // initialize all the bees
      var beeType;
      if (random(10) < 4) { // how many bees are explorers vs drones
        beeType = 1; // explorer
      } else {
        beeType = 0; // drone
      }

      this.bees.push(new Honeybee(
        createVector(margin, height - (this.height + margin)),
        createVector(this.width + margin, height - margin),
        this.hive.pos.x,
        this.hive.pos.y,
        beeType)
      );
    }
  }

  // ------------------------------------------------------
  display() {

    rectMode(CORNER);
    rect(margin, height - (this.height + margin), this.width, this.height);
    rectMode(CENTER);

    // draws hive and food
    this.hive.display();
    drawFoodSources();

    // checks to make sure each bee's target actually exists
    verify_targets(this.bees,this.foodSources,this.hive.knownFood);
    // checks if bees are running into food
    check_food_collisions(this.bees,this.foodSources);

    for (let i = 0; i < this.beePop; i++) {
      let bee = this.bees[i];

      // update and display each bee
      bee.update();
      bee.display();

      // checks if bees are over the hive
      if (bee.check_hive_collision()) {
        // if the bee is returning with pollen
        if (bee.full) {
          this.hive.addPollen();
          this.hive.knownFood.push(bee.foundFoodSource);
          bee.full = false;
          bee.foundFoodSource = null;
        }

        // otherwise give the bee a new target to go to (as if they watched a dance)
        if (this.hive.knownFood[0]) {
          let rand = int(random(this.hive.knownFood.length - 1));
          bee.setTarget(this.hive.knownFood[rand].x, this.hive.knownFood[rand].y);
        } else {
          bee.clearTarget();
        }
      }
    }

    noFill();
    stroke(colBgGreen);
    strokeWeight(8);
    rectMode(CORNER);
    rect(margin - 2, height - (this.height + margin) - 2, this.width + 4, this.height + 4);
    rectMode(CENTER);
  }
}



// ------------------------------------------------------
class Hive {

  constructor(topLeftCorner, bottomRightCorner) {
    this.pos = createVector(
      random(topLeftCorner.x + 50, bottomRightCorner.x - 50),
      random(topLeftCorner.y + 50, bottomRightCorner.y - 50)
    );
    this.knownFood = [];
    this.pollenLevel = 0;
  }

  // ------------------------------------------------------
  display() {
    applyMatrix();
    rectMode(CENTER);
    noStroke();
    translate(this.pos.x, this.pos.y);
    image(hiveImage,0,0,100,100);
    fill(218,165,32);
    rect(0,50,this.pollenLevel,10);
    resetMatrix();
  }

  // ------------------------------------------------------
  addPollen() {
    this.pollenLevel += 2;
  }
}


// ------------------------------------------------------
class FoodSource {
  constructor(posX, posY) {
    this.pos    = createVector(posX,posY);
    this.pollen = 20;
    this.id     = posX*posY;
  }

  display() {
    applyMatrix();
    noStroke();
    rectMode(CENTER);
    fill(255,0,0);
    translate(this.pos.x, this.pos.y);
    image(foodImage, 0, 0, 50, 50);

    if (this.pollen < 20){
      rect(0, 20, this.pollen, 5);
    }
    resetMatrix();
  }

  subPollen() {
    this.pollen -= 2;
  }
}


// ------------------------------------------------------
class Honeybee {

  constructor(topLeftCorner, bottomRightCorner, hiveX, hiveY, mode) {
    this.topLeftCorner = topLeftCorner;
    this.bottomRightCorner = bottomRightCorner;

    this.pos = createVector(
      random(topLeftCorner.x, bottomRightCorner.x),
      random(topLeftCorner.y, bottomRightCorner.y)
    );
    this.vel = createVector(random(2)-1, random(2)-1);
    this.acc = createVector(random(2)-1, random(2)-1);
    this.target;
    this.full = false;
    this.foundFoodSource;
    this.hive = createVector(hiveX,hiveY);
    this.mode = mode; // 0 for regular bees, 1 for explorer bees
  }

  // ------------------------------------------------------
  update() {

    // GENERAL BEE BEHAVIOR
    if (this.target) {
      this.acc = this.calc_heading(this.target);
    } else if (this.mode == 1) { //if explorer bee
      this.explore();
    } else if (this.distance_from_hive() > 100) {
      this.acc = this.calc_heading(this.hive);
    } else {
      this.explore();
    }

    // PHYSICS
    this.acc.setMag(.2); // change this number to make the bees make tighter turns (higher num = tighter turns)
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vel.setMag(1); // keeps acc from stacking and going too fast


    // EDGE BEHAVIOR
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

  // ------------------------------------------------------
  display() {

    applyMatrix();
    // rectMode(CENTER);
    noStroke();
    fill(255,255,0);
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading() + PI/2);

    // draw bee
    image(beeImage, 0, 0, 20, 20);

    resetMatrix();
  }

  // ------------------------------------------------------
  explore() {

    for (let i = 0; i < foodMap.foodSources.length; i++) {
      if (dist(this.pos.x, this.pos.y, foodMap.foodSources[i].pos.x, foodMap.foodSources[i].pos.y) < 50) {
        this.setTarget(foodMap.foodSources[i].pos.x, foodMap.foodSources[i].pos.y);
      }
    }
    this.acc = createVector(random(2)-1, random(2)-1);
  }

  // ------------------------------------------------------
  distance_from_hive() {
    return dist(this.pos.x, this.pos.y, this.hive.x, this.hive.y);
  }

  // ------------------------------------------------------
  clearTarget() {
    this.target = null;
  }

  // ------------------------------------------------------
  setTarget(newTargetx, newTargety) {
    this.target = createVector(newTargetx,newTargety);
    // print("new target = " + newTargetx + "," + newTargety);
  }

  // ------------------------------------------------------
  fillUp() {
    this.full = true;
    this.target = this.hive;
    // print("now I'm full");
  }

  // ------------------------------------------------------
  calc_heading(targ) {

    var x_slope = targ.x - this.pos.x;
    var y_slope = targ.y - this.pos.y;

    return createVector(x_slope, y_slope);
  }

  // ------------------------------------------------------
  check_collision(foodx, foody) {

    if (abs(foodx - this.pos.x) < 10 && abs(foody - this.pos.y) < 10) {
      return true;
    } else {
      return false;
    }
  }

  // ------------------------------------------------------
  check_hive_collision() {

    if (abs(this.hive.x - this.pos.x) < 20 && abs(this.hive.y - this.pos.y) < 20) {
      return true;
    } else {
      return false;
    }
  }
}
