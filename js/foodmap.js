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
   // this.p5s.stroke(this.opts.colBgGreen);
   // this.p5s.strokeWeight(8);
   // this.p5s.rectMode(this.p5s.CORNER);

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

    this.tl = topLeftCorner;
    this.br = bottomRightCorner;

    this.opts = opts;
    this.foodMap = foodMap;
    this.p5s = p5s;

    this.pos = this.p5s.createVector(
      topLeftCorner.x + (bottomRightCorner.x - topLeftCorner.x) / 2,
      topLeftCorner.y + 200
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
        this.opts,
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
  }


  // ------------------------------------------------------
  display() {

    // draws actual hive - this may change to just drawing the opening
    this.p5s.applyMatrix();
    this.p5s.rectMode(this.p5s.CENTER);
    this.p5s.noStroke();
    this.p5s.translate(this.pos.x, this.pos.y);
    this.p5s.image(this.opts.hiveImage10, -150, -150, 300, 300);
    this.p5s.resetMatrix();

    this.display_food_sources();
    this.display_bees();
  }

  // ------------------------------------------------------
  addFoodSource() {

    this.foodSources.push(new FoodSource(
      this.p5s.random(this.tl.x, this.br.x),
      this.br.y - 50,
      this.opts,
      this.p5s,
      this.p5s.floor(this.p5s.random(3))
    ));
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
  check_food_collisions(a_bee) {

    // for each bee
    let food_exists = false;

    // for each flower
    for (let i = 0; i < this.foodSources.length; i++) {
      let a_food = this.foodSources[i]

      // if bee is near a flower it smells in
      if (!a_bee.target && this.p5s.dist(a_bee.pos.x, a_bee.pos.y, a_food.head_pos.x, a_food.head_pos.y) < 70) {
        a_bee.setTarget(a_food.head_pos.x, a_food.head_pos.y);
      }

      //checks if bees target flower exists
      if (a_bee.target && a_bee.target.x == a_food.head_pos.x && !a_food.died && !a_food.baby) {
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
  constructor(posX, posY, opts, p5s, flower_type) {
    this.p5s       = p5s;
    this.opts      = opts;
    this.pos       = this.p5s.createVector(posX, posY);
    this.head_pos  = this.p5s.createVector(posX, posY + 300);
    this.age       = 0;
    this.life_span = 300;
    this.baby      = true;
    this.died      = false;
    this.gone      = false;
    this.scale     = 200;
    this.offset    = 10;

    this.type       = flower_type;  // 0 = lavender,1 = yellow, or 2 = pink
    this.image;
    this.pesticide  = 0; // amount of doses

    this.pick_image(this.opts.lav_baby, this.opts.yel_baby, this.opts.pink_baby);
  }


  // ------------------------------------------------------
  update() {

    this.age+=.01;

    if (this.age < this.life_span/3) {
      //nothing for now
    } else if (this.age < this.life_span*2/3) {
      this.baby = false;
      this.offset = this.scale*.2
      this.head_pos.y = this.pos.y - this.scale*.5;
      this.pick_image(this.opts.lav_adult, this.opts.yel_adult, this.opts.pink_adult);

    } else if (this.age < this.life_span){
      this.offset = 10;
      this.died = true;
      this.image = this.opts.flower_dead;

    } else {
      this.gone = true;
    }

  }


  // ------------------------------------------------------
  display() {
    this.p5s.applyMatrix();
    this.p5s.noStroke();
    this.p5s.translate(this.pos.x, this.pos.y);
    this.p5s.image(this.image, this.scale/-2 - this.offset, this.scale/-2 - this.offset, this.scale, this.scale);
    this.p5s.resetMatrix();
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
