class HiveHex {

  // ------------------------------------------------------
  constructor(pos, r, idx, larvaeImg, p5s) {
    this.p5s       = p5s;
    this.pos       = pos;
    this.r         = r;
    this.idx       = idx;
    this.larvaeImg = larvaeImg;
    this.hasLarvae = false;

    this.fillColorOptions = {
      starting : this.p5s.color(224, 188, 115), // #E0BC73
      half     : this.p5s.color(219, 175, 80),  // #DBAF50
      full     : this.p5s.color(207, 163, 76),  // #CFA34C
      larvae   : this.p5s.color(159, 181, 222)  // #9FB5DE
    };

  }
  

  // ------------------------------------------------------
  display() { 

    // Set fill color
    if (this.hasLarvae) {
      this.p5s.fill(this.fillColorOptions.larvae);
    } else {
      this.p5s.noFill();
    }
    
    // Create the shape
    this.p5s.stroke(255);
    this.p5s.beginShape();
    for (let a = 0; a < 2 * this.p5s.PI; a += 2 * this.p5s.PI / 6) {
      let x2 = this.p5s.cos(a) * this.r;
      let y2 = this.p5s.sin(a) * this.r;
      this.p5s.vertex(this.pos.x + x2, this.pos.y + y2);
    }
    this.p5s.endShape(this.p5s.CLOSE);

    // If there is larvae, draw it
    if (this.hasLarvae) {
      this.p5s.push();
      this.p5s.translate(this.pos.x, this.pos.y);
      this.p5s.imageMode(this.p5s.CENTER);
      this.p5s.image(this.larvaeImg, 0, 0, 30, 30);
      this.p5s.pop();
    }
  }


  // ------------------------------------------------------
  layLarvae() {
    this.hasLarvae = true;
  }

}