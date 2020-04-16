// --------------------------------------------------------
// Hive grid code adapted from:
// https://editor.p5js.org/FirstProphet/sketches/SJR6ZKhd7
// --------------------------------------------------------

class InnerHive {

  // ------------------------------------------------------
  constructor(imgs, p5s) {
    this.p5s       = p5s;
    this.imgs      = imgs;
    this.r         = 40;
    this.s         = this.p5s.sqrt(3 * this.p5s.pow(this.r, 2) / 4);
    this.hexagons  = [];
    this.beePop    = 40;
    this.bees      = [];
    this.numLarvae = this.p5s.random(0, 4);
    this.margin    = 175;
    this.counter   = 0;

    this.generateHexGrid();
    this.spawnLarvae();
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
        this.bees[i].showTypeLabel();
      }
    }
  }

  // ------------------------------------------------------
  generateHexGrid() {
    
    let yBounds = this.p5s.height + this.s - this.margin;
    let xBounds = (this.p5s.width + this.r) - this.margin - 87.5;

    for (let y = this.margin; y < yBounds; y += 2 * this.s) {
      for (let x = this.margin; x < xBounds; x += 3 * this.r) {
        
        this.hexagons.push(new HiveHex(
          this.p5s.createVector(x, y),
          this.r, 
          this.counter++,
          this.imgs.larvaeImg,
          this.p5s
        ));

        this.hexagons.push(new HiveHex(
          this.p5s.createVector(x + 1.5 * this.r, y + this.s), 
          this.r, 
          this.counter++,
          this.imgs.larvaeImg,
          this.p5s
        ));
      }
    }
  }


  // ------------------------------------------------------
  // Pick some random hex cells to fill with larvae
  spawnLarvae() {

    // p5 random actually accepts arrays but it still 
    // feels intuitive to do it this way 
    for (let i = 0; i < this.numLarvae; i++) {
      let idx = Math.round(this.p5s.random(this.counter));
      this.hexagons[idx].layLarvae();
    }

  }


  // ------------------------------------------------------
  createBees() {

    let bounds = {
      xBounds: (this.p5s.width + this.r) - this.margin - 87.5,
      yBounds:  this.p5s.height + this.s - this.margin,
    }

    // QUEEN FIRST
    this.bees.push(new InnerBee(bounds, this.imgs, 'QUEEN', this.p5s));

    // Worker bees
    for (let i = 0; i < this.beePop; i++) {
      this.bees.push(new InnerBee(bounds, this.imgs, 'WORKER', this.p5s));
    }
  }

}