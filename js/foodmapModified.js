class FoodMap {

  // ------------------------------------------------------
  constructor(boundingWidth, boundingHeight, opts, p5s) {
    this.opts = opts;
    this.p5s = p5s;

    this.width = boundingWidth;
    this.height = boundingHeight;

    this.hive = new Hive(
      this.p5s.createVector(0, this.p5s.height - (this.height)),
      this.p5s.createVector(this.width, this.p5s.height),
      this.opts,
      this.p5s,
      this
    );

    this.temp;
    this.gravity;
    this.time;
  }


  // ------------------------------------------------------
  update() {
    // update time, temp, gravity stuff here
    this.hive.update();
  }


  // ------------------------------------------------------
  display() {

    // draw map rect
    this.p5s.rectMode(this.p5s.CORNER);
    this.p5s.rect(0, this.p5s.height - (this.height), this.width, this.height);
    this.p5s.rectMode(this.p5s.CENTER);

    // draws hive and food
    this.hive.display();

    // draw border to make edge clean
    this.p5s.noFill();
    this.p5s.stroke(this.opts.colBgGreen);
    this.p5s.strokeWeight(8);
    this.p5s.rectMode(this.p5s.CORNER);

    this.p5s.rect(
      0, 
      this.p5s.height - this.height, 
      this.width, 
      this.height
    );

    this.p5s.rectMode(this.p5s.CENTER);
  }
}











// ------------------------------------------------------
class Hive {

  constructor(topLeftCorner, bottomRightCorner, opts, p5s, foodMap) {
    this.opts = opts;
    this.foodMap = foodMap;
    this.p5s = p5s;

    this.pos = this.p5s.createVector(
      topLeftCorner.x + (bottomRightCorner.x - topLeftCorner.x) / 2,
      topLeftCorner.y + 50
    );

    this.knownFood   = [];
    this.foodSources = [];
    this.pollenLevel = 0;
    this.bees        = [];
    this.beePop      = 20;

    // Instantiate new bee(s)
    // Constrain bee position and movement inside of FoodMap bounding box

    for (let i = 0; i < this.beePop; i++) {  // initialize all the bees
      var beeType;
      if (this.p5s.random(10) < 6) { // how many bees are workers vs drones
        beeType = 1; // worker
      } else {
        beeType = 0; // drone
      }

      this.bees.push(new Honeybee(
        topLeftCorner,
        bottomRightCorner,
        this.pos.x,
        this.pos.y,
        beeType,
        this.foodMap,
        this.opts.beeImage,
        this.p5s
      ));
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
    // checks if bees are on food sources
    this.check_food_collisions();
  }


  // ------------------------------------------------------
  display() {

    // draws actual hive - this may change to just drawing the opening
    this.p5s.applyMatrix();
    this.p5s.rectMode(this.p5s.CENTER);
    this.p5s.noStroke();
    this.p5s.translate(this.pos.x, this.pos.y);
    this.p5s.image(this.opts.hiveImage, 0, 0, 100, 100);
    this.p5s.fill(218, 165, 32);
    this.p5s.rect(0, 50, this.pollenLevel, 10);
    this.p5s.resetMatrix();

    this.display_food_sources();
    this.display_bees();
  }


  // ------------------------------------------------------
  addPollen() {
    this.pollenLevel += 2;
  }


  // ------------------------------------------------------
  verify_targets() {
    if (this.knownFood[0]) {
      for (let i = 0; i < this.knownFood.length; i++) {
        if (this.p5s.findObjectByKey(this.foodSources, "x", this.knownFood.x) == null) {
          this.knownFood.splice(i);
        }
      }
    }
  }


  // --------------------------------------------------------
  check_food_collisions() {

    // for each bee
    for (let j = 0; j < this.bees.length; j++) {
      let a_bee = this.bees[j];
      let food_exists = false;

      // for each flower
      for (let i = 0; i < this.foodSources.length; i++) {
        let a_food = this.foodSources[i]

        // checks if bees target flower exists
        if (a_bee.target && a_bee.target.x == a_food.pos.x) {
          food_exists = true;
        }

        // if bee is on the flower
        if (a_bee.check_collision(a_food.pos.x, a_food.pos.y) && a_bee.full != true) {
          a_bee.fillUp();
          a_bee.foundFoodSource = a_food.pos;
        }
      }
      // if the bees target (which is a flower) does not exist anymore
      if (a_bee.target && a_bee.target.x != this.pos.x && food_exists == false) {
        //print('hi');
        a_bee.clearTarget();
      }
    }
  }


  // --------------------------------------------------------
  update_food_sources() {
    for (var i = 0; i < this.foodSources.length; i++) {
      this.foodSources[i].update();
      if (this.foodSources[i].died) {
        this.foodSources.splice(i, 1);
      }
    }
  }

  // ------------------------------------------------------
  update_bees() {
    for (let i = 0; i < this.beePop; i++) {
      let bee = this.bees[i];
      // update each bee
      bee.update();

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
          let rand = this.p5s.int(this.p5s.random(this.knownFood.length - 1));
          bee.setTarget(this.knownFood[rand].x, this.knownFood[rand].y);
        } else {
          bee.clearTarget();
        }
      }
    }
  }


  // ------------------------------------------------------
  display_food_sources() {
    for (var i = 0; i < this.foodSources.length; i++) {
      this.foodSources[i].display();
    }
  }

  // ------------------------------------------------------
  display_bees() {
    for (let i = 0; i < this.beePop; i++) {
      this.bees[i].display();
    }
  }
}




// ------------------------------------------------------
class FoodSource {
  constructor(posX, posY, foodImage, p5s) {
    this.foodImage = foodImage;
    this.p5s       = p5s;
    this.pos       = this.p5s.createVector(posX, posY);
    this.id        = posX * posY;
    this.age       = 0;
    this.died      = false;
    this.color_val = 100;
    this.stem_len  = 20;
    this.life_span = 300;
  }


  // ------------------------------------------------------
  update() {
    this.age += .1;

    if (this.age < 60) {
      this.pos.y -= .05;
      this.stem_len += .05;
    } else if (this.age < this.life_span) {
      this.pos.y += .01;
      this.stem_len -= .01;
      this.color_val += 1;
    } else {
      this.died = true;
    }

  }


  // ------------------------------------------------------
  display() {
    this.p5s.applyMatrix();
    this.p5s.noStroke();
    this.p5s.fill(0, 100, 0);
    this.p5s.translate(this.pos.x, this.pos.y);
    this.p5s.rect(0, this.stem_len / 2, 5, this.stem_len);
    this.p5s.imageMode(this.p5s.CENTER);
    this.p5s.image(this.foodImage, 0, 0, 50, 50);
    this.p5s.resetMatrix();
  }

}
