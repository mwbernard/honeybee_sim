class Honeybee {

  constructor(topLeftCorner, bottomRightCorner, hiveX, hiveY, mode, foodMap, beeImage, p5s) {
    this.foodMap = foodMap;
    this.beeImage = beeImage;
    this.p5s = p5s;

    this.topLeftCorner = topLeftCorner;
    this.bottomRightCorner = bottomRightCorner;

    this.pos = this.p5s.createVector(
      this.p5s.random(topLeftCorner.x, bottomRightCorner.x),
      this.p5s.random(topLeftCorner.y, bottomRightCorner.y)
    );

    this.vel = this.p5s.createVector(this.p5s.random(2)-1, this.p5s.random(2)-1);
    this.acc = this.p5s.createVector(this.p5s.random(2)-1, this.p5s.random(2)-1);
    this.target;
    this.full = false;
    this.foundFoodSource;
    this.hive = this.p5s.createVector(hiveX,hiveY);
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


    let buffer = 30; // the distance from the edge that the bees will turn around at
    // EDGE BEHAVIOR
    if (this.pos.x < this.topLeftCorner.x + buffer) {
      this.acc = this.p5s.createVector(1, 0);
    } else if (this.pos.x > this.bottomRightCorner.x - buffer) {
      this.acc = this.p5s.createVector(-1, 0);
    }

    if (this.pos.y < this.topLeftCorner.y + buffer) {
      this.acc = this.p5s.createVector(0, 1);
    } else if (this.pos.y > this.bottomRightCorner.y - buffer) {
      this.acc = this.p5s.createVector(0, -1);
    }


    // PHYSICS
    this.acc.setMag(.2); // change this number to make the bees make tighter turns (higher num = tighter turns)
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vel.setMag(1); // keeps acc from stacking and going too fast

  }


  // ------------------------------------------------------
  display() {

    this.p5s.applyMatrix();
    // this.p5s.rectMode(this.p5s.CENTER);
    this.p5s.noStroke();
    this.p5s.fill(255, 255, 0);
    this.p5s.translate(this.pos.x, this.pos.y);
    this.p5s.rotate(this.vel.heading() + this.p5s.PI / 2);

    // draw bee
    this.p5s.image(this.beeImage, 0, 0, 10, 10);

    this.p5s.resetMatrix();
  }


  // ------------------------------------------------------
  explore() {

    for (let i = 0; i < this.foodMap.hive.foodSources.length; i++) {
      if (this.p5s.dist(
        this.pos.x, this.pos.y, this.foodMap.hive.foodSources[i].pos.x, this.foodMap.hive.foodSources[i].pos.y) < 70) {
        this.setTarget(this.foodMap.hive.foodSources[i].pos.x, this.foodMap.hive.foodSources[i].pos.y);
      }
    }
    this.acc = this.p5s.createVector(this.p5s.random(2) - 1, this.p5s.random(2) - 1);
  }


  // ------------------------------------------------------
  distance_from_hive() {
    return this.p5s.dist(this.pos.x, this.pos.y, this.hive.x, this.hive.y);
  }


  // ------------------------------------------------------
  clearTarget() {
    this.target = null;
  }


  // ------------------------------------------------------
  setTarget(newTargetx, newTargety) {
    this.target = this.p5s.createVector(newTargetx, newTargety);
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

    return this.p5s.createVector(x_slope, y_slope);
  }


  // ------------------------------------------------------
  check_collision(foodx, foody) {

    if (this.p5s.abs(foodx - this.pos.x) < 10 && this.p5s.abs(foody - this.pos.y) < 10) {
      return true;
    } else {
      return false;
    }
  }


  // ------------------------------------------------------
  check_hive_collision() {

    if (this.p5s.abs(this.hive.x - this.pos.x) < 20 && this.p5s.abs(this.hive.y - this.pos.y) < 20) {
      return true;
    } else {
      return false;
    }
  }
}
