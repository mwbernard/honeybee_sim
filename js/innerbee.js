// ------------------------------------------------------
class InnerBee {

  constructor(bounds, imgs, beeType, p5s) {

    this.p5s     = p5s;
    this.imgs    = imgs;
    this.bounds  = bounds;
    this.beeType = beeType;
    this.rotAmt  = this.p5s.random(this.p5s.PI / 2);
    this.vel     = this.p5s.createVector(this.p5s.random(2)-1, this.p5s.random(2)-1);
    this.acc     = this.p5s.createVector(this.p5s.random(2)-1, this.p5s.random(2)-1);
    
    if (this.beeType == 'QUEEN') {
      this.pos = this.p5s.createVector(this.p5s.width / 2, this.p5s.height / 2);
    } else {
      this.pos = this.p5s.createVector(
        this.p5s.random(this.bounds.xBounds, this.p5s.width - this.bounds.xBounds),
        this.p5s.random(this.bounds.yBounds, this.p5s.height - this.bounds.yBounds)
      );
    }
  }

  // ------------------------------------------------------
  contains(mx, my) {
    return this.p5s.dist(mx, my, this.pos.x, this.pos.y) < 20;
  }


  // ------------------------------------------------------
  update() {

    let rot = this.p5s.random(-0.1, 0.1);

    if (this.beeType == 'QUEEN') {
      this.p5s.push();
      this.p5s.translate(this.pos.x, this.pos.y);
      this.rotAmt += rot;
      this.p5s.pop();
    } else {
      this.explore();
      this.acc.setMag(.5);
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.vel.setMag(0.5);
      this.p5s.push();
      this.p5s.translate(this.pos.x, this.pos.y);
      this.rotAmt += rot;
      this.p5s.pop();
    }
    
  }


  // ------------------------------------------------------
  display() {
    this.p5s.push();
    this.p5s.translate(this.pos.x, this.pos.y);
    this.p5s.rotate(this.rotAmt);
    this.p5s.noStroke();
    this.p5s.imageMode(this.p5s.CENTER);

    if (this.beeType == 'QUEEN') {
      this.p5s.fill(0, 255, 255);
      this.p5s.image(this.imgs.queenImg, 0, 0, 60, 60);
    } else {
      this.p5s.fill(0, 0, 0);
      this.p5s.image(this.imgs.workerClosedImg, 0, 0, 60, 60);
    }
    this.p5s.pop();
  }

  // ------------------------------------------------------
  explore() {
    this.acc = this.p5s.createVector(this.p5s.random(2) - 1, this.p5s.random(2) - 1);
  }


  // ------------------------------------------------------
  showTypeLabel() {
    let d = this.p5s.dist(this.p5s.mouseX, this.p5s.mouseY, this.pos.x, this.pos.y);
    if (d < 20) {
      this.p5s.noFill();
      this.p5s.stroke(0, 0, 255);
      this.p5s.strokeWeight(4);
      this.p5s.circle(this.pos.x, this.pos.y, 60);
      this.display();
    }
  }
}