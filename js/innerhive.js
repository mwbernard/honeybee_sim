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

    this.generateHexGrid();
  }

  // ------------------------------------------------------
  display() {
    this.p5s.noFill();
    this.hexagons.forEach(h => {
      h.display();
    });
  }

  // ------------------------------------------------------
  generateHexGrid() {
    let counter = 0;
    for (let y = 145; y < this.p5s.height - 160 + this.s; y += 2 * this.s) {
      for (let x = 145; x < this.p5s.width - 160 + this.r; x += 3 * this.r) {
        
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
}      





class HiveHex {

  // ------------------------------------------------------
  constructor(pos, r, idx, p5s) {
    this.p5s = p5s;
    this.pos = pos;
    this.r   = r;
    this.idx = idx;
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
