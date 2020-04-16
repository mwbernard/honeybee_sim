// --------------------------------------------------------
// Hive grid code adapted from:
// https://editor.p5js.org/FirstProphet/sketches/SJR6ZKhd7
// --------------------------------------------------------

class InnerHive {

  // ------------------------------------------------------
  constructor(p5s) {
    this.p5s      = p5s;
    this.r        = 40;
    this.s        = this.p5s.sqrt(3 * this.p5s.pow(this.r, 2) / 4);
    this.hexagons = [];
    this.beePop   = 20;
    this.bees     = [];

    this.generateHexGrid();
    this.createBees();
  }

  // ------------------------------------------------------
  display() {
    this.p5s.noFill();

    // display hex grid first
    this.p5s.strokeWeight(1);
    this.hexagons.forEach(h => {
      h.display();
    });
    
    // then update/display bees
    this.bees.forEach(b => {
      b.update();
      b.display();
    });

    // looping again is inefficient so may change this later
    for (let i = 0; i < this.beePop; i++) {
      if (this.bees[i].contains(this.p5s.mouseX, this.p5s.mouseY)) {
        this.bees[i].handleHover();
      }
    }
  }

  // ------------------------------------------------------
  generateHexGrid() {
    let counter = 0;
    for (let y = 0; y < this.p5s.height + this.s; y += 2 * this.s) {
      for (let x = 0; x < this.p5s.width + this.r; x += 3 * this.r) {
        
        this.hexagons.push(new HiveHex(
          this.p5s.createVector(x, y),
          this.r, 
          counter++,
          this.p5s
        ));

        this.hexagons.push(new HiveHex(
          this.p5s.createVector(x + 1.5 * this.r, y + this.s), 
          this.r, 
          counter++,
          this.p5s
        ));
      }
    }
  }

  // ------------------------------------------------------
  createBees() {

    // QUEEN FIRST
    this.bees.push(new InnerBee('QUEEN', this.p5s));

    // Worker bees
    for (let i = 0; i < this.beePop; i++) {
      this.bees.push(new InnerBee('WORKER', this.p5s));
    }

  }


}      





class HiveHex {

  // ------------------------------------------------------
  constructor(pos, r, idx, p5s) {
   
    this.p5s = p5s;
    this.pos = pos;
    this.r   = r;
    this.idx = idx;

    this.fillColorOptions = {
      starting : this.p5s.color(224, 188, 115), // #E0BC73
      half     : this.p5s.color(219, 175, 80),  // #DBAF50
      full     : this.p5s.color(207, 163, 76)   // #CFA34C
    };

  }
  

  // ------------------------------------------------------
  display() {
    this.p5s.stroke(255);
    this.p5s.beginShape();
    for (let a = 0; a < 2 * this.p5s.PI; a += 2 * this.p5s.PI / 6) {
      let x2 = this.p5s.cos(a) * this.r;
      let y2 = this.p5s.sin(a) * this.r;
      this.p5s.vertex(this.pos.x + x2, this.pos.y + y2);
    }
    this.p5s.endShape(this.p5s.CLOSE);
  }

}





// ------------------------------------------------------
class InnerBee {

  constructor(beeType, p5s) {

    this.p5s     = p5s;
    this.beeType = beeType;
    this.rotAmt  = this.p5s.random(this.p5s.PI / 2);
  
    if (this.beeType == 'QUEEN') {
      this.pos = this.p5s.createVector(this.p5s.width / 2, this.p5s.height / 2);
    } else {
      this.pos = this.p5s.createVector(
        this.p5s.random(0, this.p5s.width),
        this.p5s.random(0, this.p5s.height)
      );
    }
  }

  // ------------------------------------------------------
  contains(mx, my) {
    return this.p5s.dist(mx, my, this.pos.x, this.pos.y) < 20;
  }


  // ------------------------------------------------------
  update() {

  }


  // ------------------------------------------------------
  display() {
    this.p5s.push();
    this.p5s.translate(this.pos.x, this.pos.y);
    this.p5s.rotate(this.rotAmt);

    this.p5s.noStroke();
    if (this.beeType == 'QUEEN') {
      this.p5s.fill(0, 255, 255);
      // image(beeImage, 0, 0, 40, 40);
      this.p5s.circle(0, 0, 40);
    } else {
      this.p5s.fill(0, 0, 0);
      // image(beeImage, 0, 0, 40, 40);
      this.p5s.circle(0, 0, 40);
    }
    this.p5s.pop();
  }


  // ------------------------------------------------------
  handleHover() {
    let d = this.p5s.dist(this.p5s.mouseX, this.p5s.mouseY, this.pos.x, this.pos.y);
    if (d < 20) {
      this.p5s.noFill();
      this.p5s.stroke(0, 0, 255);
      this.p5s.strokeWeight(4);
      // this.p5s.fill(0, 255, 195);
      this.p5s.circle(this.pos.x, this.pos.y, 60);
      this.display();
    }
  }
}
