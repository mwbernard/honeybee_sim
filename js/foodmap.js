class FoodMap {

  // ------------------------------------------------------
  constructor(boundingWidth, boundingHeight) {
    this.width = boundingWidth;
    this.height = boundingHeight;

    this.hive = new Hive(
      createVector(margin, height - (this.height + margin)),
      createVector(this.width + margin, height - margin)
    );

    this.temp;
    this.gravity;
    this.time;
  }

  update() {
    // update time, temp, gravity stuff here
    this.hive.update();
  }

  // ------------------------------------------------------
  display() {

    //draw map rect
    rectMode(CORNER);
    rect(margin, height - (this.height + margin), this.width, this.height);
    rectMode(CENTER);

    // draws hive and food
    this.hive.display();

    //draw border to make edge clean
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
      topLeftCorner.x + (bottomRightCorner.x - topLeftCorner.x)/2,
      topLeftCorner.y + 50);
    this.knownFood = [];
    this.foodSources = [];
    this.pollenLevel = 0;
    this.bees = [];
    this.beePop = 20;

    // Instantiate new bee(s)
    // Constrain bee position and movement inside of FoodMap bounding box

    for (let i = 0; i < this.beePop; i++) {  // initialize all the bees
      var beeType;
      if (random(10) < 6) { // how many bees are workers vs drones
        beeType = 1; // worker
      } else {
        beeType = 0; // drone
      }

      this.bees.push(new Honeybee(
        topLeftCorner,
        bottomRightCorner,
        this.pos.x,
        this.pos.y,
        beeType)
      );
    }
  }

  // ------------------------------------------------------
  update() {
    // updates bees
    this.update_bees();
    // updates food
    this.update_food_sources();
    // makes sure hives known food sources actually exist
    this.verify_targets();
  }

  display() {

    // draws actual hive - this may change to just drawing the opening
    applyMatrix();
    rectMode(CENTER);
    noStroke();
    translate(this.pos.x, this.pos.y);
    image(hiveImage,0,0,100,100);
    fill(218,165,32);
    rect(0,50,this.pollenLevel,10);
    resetMatrix();

    this.display_food_sources();
    this.display_bees();
  }

  // ------------------------------------------------------
  addPollen() {
    this.pollenLevel += 2;
  }

  verify_targets() {

    if (this.knownFood[0]){
      for (let i = 0; i < this.knownFood.length; i++) {
        if (findObjectByKey(this.foodSources, "x", this.knownFood.x) == null) {
          this.knownFood.splice(i,1);
        }
      }
    }
  }

  // --------------------------------------------------------
  //
  check_food_collisions(a_bee) {

    // for each bee
    let food_exists = false;

    // for each flower
    for (let i = 0; i < this.foodSources.length; i++) {
      let a_food = this.foodSources[i]

      //
      if (!a_bee.target && dist(a_bee.pos.x, a_bee.pos.y, a_food.head_pos.x, a_food.head_pos.y) < 70) {
        a_bee.setTarget(a_food.head_pos.x, a_food.head_pos.y);
      }

      //checks if bees target flower exists
      if (a_bee.target && a_bee.target.x == a_food.head_pos.x && !a_food.died) {
        food_exists = true;
      }

      //if bee is on the flower
      if (a_bee.check_collision(a_food.head_pos.x, a_food.head_pos.y) && a_bee.full != true) {
        a_bee.fillUp();
        a_bee.foundFoodSource = a_food.head_pos;
      }
    }
    //if the bees target (which is a flower) does not exist anymore
    if (a_bee.target && a_bee.target.x != this.pos.x && food_exists == false) {
      a_bee.clearTarget();
    }

  }

  // --------------------------------------------------------
  update_food_sources() {
    for (var i = 0; i < this.foodSources.length; i++) {
      this.foodSources[i].update();
      if (this.foodSources[i].gone) {
        this.foodSources.splice(i,1);
      }
    }
  }

  update_bees() {
    for (let i = 0; i < this.beePop; i++) {
      let bee = this.bees[i];
      // update each bee
      bee.update();

      this.check_food_collisions(bee);

      // checks if bees are over the hive
      if (bee.check_hive_collision()) {
        // if the bee is returning with pollen
        if (bee.full) {
          this.addPollen();
          this.knownFood.push(bee.foundFoodSource);
          bee.full = false;
          bee.foundFoodSource = null;
        }

        // otherwise give the bee a new target to go to (as if they watched a dance)
        if (this.knownFood[0]) {
          let rand = int(random(this.knownFood.length - 1));
          bee.setTarget(this.knownFood[rand].x, this.knownFood[rand].y);
        } else {
          bee.clearTarget();
        }
      }
    }
  }

  display_food_sources() {
    for (var i = 0; i < this.foodSources.length; i++) {
      this.foodSources[i].display();
    }
  }

  display_bees() {
    for (let i = 0; i < this.beePop; i++) {
      this.bees[i].display();
    }
  }
}


// ------------------------------------------------------
class FoodSource {
  constructor(posX, posY, flower_type) {
    this.pos        = createVector(posX, posY);
    this.head_pos   = createVector(posX, posY - 60);
    this.age        = 0;
    this.life_span  = 300;
    this.died       = false;
    this.gone       = false;
    this.scale      = 150
    this.offset     = 40;


    this.type       = flower_type;  // 0 = lavender,1 = yellow, or 2 = pink
    this.image;
    this.pesticide  = 0; // amount of doses


    this.pick_image(lav_baby, yel_baby, pink_baby);

  }

  update() {

    this.age+=.1;

    if (this.age < this.life_span/3) {
      this.head_pos.y = this.pos.y - this.scale*.4;

    } else if (this.age < this.life_span*2/3) {
      this.offset = this.scale*.4
      this.head_pos.y = this.pos.y - this.scale*.7;
      this.pick_image(lav_adult, yel_adult, pink_adult);

    } else if (this.age < this.life_span){
      this.offset = this.scale*.2;
      this.died = true;
      this.image = flower_dead;

    } else {
      this.gone = true;
    }

  }

  display() {
    applyMatrix();
    noStroke();
    translate(this.pos.x, this.pos.y - this.offset);

    image(this.image, 0, 0, this.scale, this.scale);

    resetMatrix();
  }

  pick_image(image1, image2, image3) {
    switch(this.type) {
      case 0:
        this.image = image1;
        break;
      case 1:
        this.image = image2;
        break;
      case 2:
        this.image = image3;
        break;
    }
  }

  add_pesticide() {
    this.pesticide++;
    this.life_span+=50;
  }

}
