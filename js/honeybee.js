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
    this.mode = mode; // 0 for done bees, 1 for worker bees
  }

  // ------------------------------------------------------
  update() {

    // GENERAL BEE BEHAVIOR
    if (this.target && this.mode == 1) {
      this.acc = this.calc_heading(this.target);
    } else if (this.mode == 1) { //if explorer bee
      this.explore();
    } else if (this.distance_from_hive() > 100) {
      this.acc = this.calc_heading(this.hive);
    } else {
      this.explore();
    }


    let buffer = 30;// the distance from the edge that the bees will turn around at
    // EDGE BEHAVIOR
    if (this.pos.x < this.topLeftCorner.x + buffer) {
      this.acc = createVector(1,0);
    } else if (this.pos.x > this.bottomRightCorner.x - buffer) {
      this.acc = createVector(-1,0);
    }

    if (this.pos.y < this.topLeftCorner.y + buffer) {
      this.acc = createVector(0,1);
    } else if (this.pos.y > this.bottomRightCorner.y - buffer) {
      this.acc = createVector(0,-1);
    }


    // PHYSICS
    this.acc.setMag(.2); // change this number to make the bees make tighter turns (higher num = tighter turns)
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vel.setMag(1); // keeps acc from stacking and going too fast

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
    image(beeImage, 0, 0, 10, 10);

    resetMatrix();
  }

  // ------------------------------------------------------
  explore() {

    for (let i = 0; i < foodMap.hive.foodSources.length; i++) {
      if (dist(this.pos.x, this.pos.y, foodMap.hive.foodSources[i].pos.x, foodMap.hive.foodSources[i].pos.y) < 70) {
        this.setTarget(foodMap.hive.foodSources[i].pos.x, foodMap.hive.foodSources[i].pos.y);
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
  }

  // ------------------------------------------------------
  fillUp() {
    this.full = true;
    this.target = this.hive;
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
