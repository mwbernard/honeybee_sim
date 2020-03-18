function setup() {
  // put setup code here
  createCanvas(600,600);

  bee = new Honeybee();
}

function draw() {
  // put drawing code here

  background(0,150,0);
  bee.update();
  bee.display();
}




class Honeybee {

  constructor() {
    this.pos = createVector(random(width),random(height));
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
    rectMode(CENTER);
    noStroke();
    fill(255,255,0);
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());

    //draw bee
    ellipse(0, 0, 20,5);

    resetMatrix();

  }

}
