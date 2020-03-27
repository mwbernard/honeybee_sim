let beeImage;
let hiveImage;
let foodImage;

function setup() {

  createCanvas(600,600);
  beePop = 10; // number of bees
  bees = []; // global list of bees
  foodSources = []; // global list of food sources

  hive = new Hive(); // hive

  for (let i = 0; i < beePop; i++) {  // initialize all the bees
    var beeType;
    if (random(10) < 5) { // how many bees are explorers vs drones
      beeType = 1; //explorer
    } else {
      beeType = 0; //drone
    }

    bees.push(new Honeybee(hive.pos.x, hive.pos.y, beeType));
  }
}

function draw() {

  background(0,150,0);

  //draws hive and food
  hive.display();
  drawFoodSources();

  // checks to make sure each bee's target actually exists
  verify_targets(bees,foodSources,hive.knownFood);
  // checks if bees are running into food
  check_food_collisions(bees,foodSources);

  for (let i = 0; i < beePop; i++) {
    let bee = bees[i];

    // update and display each bee
    bee.update();
    bee.display();

    // checks if bees are over the hive
    if (bee.check_hive_collision()) {
      // if the bee is returning with pollen
      if (bee.full) {
        hive.addPollen();
        hive.knownFood.push(bee.foundFoodSource);
        bee.full = false;
        bee.foundFoodSource = null;
      }
      // otherwise give the bee a new target to go to (as if they watched a dance)
      if (hive.knownFood[0]) {
        let rand = int(random(hive.knownFood.length - 1));
        bee.setTarget(hive.knownFood[rand].x, hive.knownFood[rand].y);
      } else {
        bee.clearTarget();
      }
    }
  }
}


// FUNCTIONS --------------------------------------------------------------

function preload() {
  beeImage = loadImage('./icon-bee.png');
  hiveImage = loadImage('./icon-hive.png');
  foodImage = loadImage('./icon-flower.png');
}
// double checks whether each bee's target is real
function verify_targets(bees,foods,hive_food) {
  for (let i = 0; i < bees.length; i++) {
    if(bees[i].target != null) {
      if(findObjectByKey(foods, "id", bees[i].target.x * bees[i].target.y) == null && bees[i].full == false) {
        //print("item cleared");
        hive_food.splice(findObjectByKey(hive_food, "x", bees[i].target.x));
        bees[i].target = null;
      }
    }
  }
}

// checks if each bee is hitting food currently
function check_food_collisions(some_bees, some_food) {

  for (let j = 0; j < some_bees.length; j++) {
    for (let i = 0; i < some_food.length; i++) {

      if (some_bees[j].check_collision(some_food[i].pos.x, some_food[i].pos.y) && some_bees[j].full != true) {
        some_food[i].subPollen();
        some_bees[j].fillUp();
        some_bees[j].foundFoodSource = some_food[i].pos;
      }
      if(some_food[i].pollen == 0) {
        //print("hi");
        some_food.splice(i,1);
      }
    }
  }
}

// adds food on mouse click
function mousePressed() {

  foodSources.push(new FoodSource(mouseX,mouseY));
  print(foodSources);

  return false;
}


function drawFoodSources() {

  for (var i = 0; i < foodSources.length; i++) {
    foodSources[i].display();
  }
}

function findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
}



// CLASSES ------------------------------------------------------------------

class Hive {
  constructor() {
    this.pos = createVector(400,400);
    this.knownFood = [];
    this.pollenLevel = 0;
  }
  display() {
    applyMatrix();
    rectMode(CENTER);
    noStroke();
    translate(this.pos.x, this.pos.y);
    image(hiveImage,-50,-50,100,100);
    fill(218,165,32);
    rect(0,50,this.pollenLevel,10);
    resetMatrix();
  }

  addPollen() {
    this.pollenLevel+=2;
  }
}

class FoodSource {
  constructor(posX,posY) {
    this.pos = createVector(posX,posY);
    this.pollen = 20;
    this.id = posX*posY;
  }

  display() {
    applyMatrix();
    noStroke();
    rectMode(CENTER);
    fill(255,0,0);
    translate(this.pos.x, this.pos.y);
    image(foodImage,-25,-25,50,50);

    if(this.pollen < 20){
      rect(0, 20, this.pollen, 5);
    }
    resetMatrix();
  }

  subPollen() {
    this.pollen-=2;
  }
}

class Honeybee {

  constructor(hiveX,hiveY,mode) {
    this.pos = createVector(random(width),random(height));
    this.vel = createVector(random(2)-1, random(2)-1);
    this.acc = createVector(random(2)-1, random(2)-1);
    this.target;
    this.full = false;
    this.foundFoodSource;
    this.hive = createVector(hiveX,hiveY);
    this.mode = mode; //0 for regular bees, 1 for explorer bees
  }

  update() {

    //GENERAL BEE BEHAVIOR
    if (this.target) {
      this.acc = this.calc_heading(this.target);
    } else if (this.mode == 1) { //if explorer bee
      this.explore();
    } else if (this.distance_from_hive() > 100) {
      this.acc = this.calc_heading(this.hive);
    } else {
      this.explore();
    }

    //PHYSICS
    this.acc.setMag(.2); //change this number to make the bees make tighter turns (higher num = tighter turns)
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vel.setMag(1); //keeps acc from stacking and going too fast


    //EDGE BEHAVIOR
    if(this.pos.x < 0) {
      this.pos.x = width;
    } else if (this.pos.x > width) {
      this.pos.x = 0;
    }
    if(this.pos.y < 0) {
      this.pos.y = height;
    } else if (this.pos.y > height) {
      this.pos.y = 0;
    }
  }

  display() {

    applyMatrix();
    //rectMode(CENTER);
    noStroke();
    fill(255,255,0);
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading() + PI/2);

    //draw bee
    image(beeImage,-10,-10,20,20);

    resetMatrix();
  }

  explore() {

    for (let i = 0; i < foodSources.length; i++) {
      if(dist(this.pos.x, this.pos.y, foodSources[i].pos.x, foodSources[i].pos.y) < 50) {
        this.setTarget(foodSources[i].pos.x, foodSources[i].pos.y);
      }
    }
    this.acc = createVector(random(2)-1, random(2)-1);
  }

  distance_from_hive(){
    return dist(this.pos.x, this.pos.y, this.hive.x, this.hive.y);
  }

  clearTarget() {
    this.target = null;
  }

  setTarget(newTargetx, newTargety) {
    this.target = createVector(newTargetx,newTargety);
    print("new target = " + newTargetx + "," + newTargety);
  }

  fillUp() {
    this.full = true;
    this.target = this.hive;
    print("now I'm full");
  }

  calc_heading(targ) {

    var x_slope = targ.x - this.pos.x;
    var y_slope = targ.y - this.pos.y;

    return createVector(x_slope, y_slope);
  }

  check_collision(foodx, foody) {

    if (abs(foodx - this.pos.x) < 10 && abs(foody - this.pos.y) < 10) {
      return true;
    } else {
      return false;
    }
  }

  check_hive_collision() {

    if (abs(this.hive.x - this.pos.x) < 20 && abs(this.hive.y - this.pos.y) < 20) {
      return true;
    } else {
      return false;
    }
  }
}
