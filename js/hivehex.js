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
      full     : this.p5s.color(207, 163, 76),  // #CFA34C
      larvae   : this.p5s.color(159, 181, 222)  // #9FB5DE
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