// --------------------------------------------------------
// Hive grid code adapted from:
// https://editor.p5js.org/FirstProphet/sketches/SJR6ZKhd7
// --------------------------------------------------------

class InnerHive {

  // ------------------------------------------------------
  constructor(imgs, p5s) {
    this.p5s              = p5s;
    this.imgs             = imgs;

    this.hexagons         = [];
    this.beePop           = 20;
    this.bees             = [];
    this.counter          = 0;
    this.beeCounter       = 1;
    this.numLarvae        = Math.round(this.p5s.random(1, 5));
    this.numHoneyClusters = Math.round(this.p5s.random(1, 5));

    this.r                = 40;
    this.s                = this.p5s.sqrt(3 * this.p5s.pow(this.r, 2) / 4);
    this.margin           = 175;
    this.xBounds          = 1260;
    this.yBounds          = 540;

    this.generateHexGrid();
    this.spawnLarvae();
    this.createBees();
    this.generateHoneyClusters();
  }

  // ------------------------------------------------------
  display() {
    this.p5s.noFill();
    this.p5s.push();
    this.p5s.translate(this.p5s.width/2 - this.xBounds/2, this.margin);

    // display hex grid first
    this.hexagons.forEach(h => {
      h.display();
    });
    
    // then update/display bees
    this.bees.forEach(b => {
      b.update();
      b.display();
      
      if (b.contains(this.p5s.mouseX - (this.p5s.width/2 - this.xBounds/2), this.p5s.mouseY - this.margin)) {
        b.showTypeLabel();
      }
    });

    this.p5s.pop(); 
  }


  // ------------------------------------------------------
  generateHexGrid() {

    for (let y = 0; y < this.yBounds; y += 2 * this.s) {
      for (let x = 0; x < this.xBounds; x += 3 * this.r) {
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
  generateHoneyClusters() {
    for (let i = 0; i < this.numHoneyClusters; i++) {
      let idx = Math.round(this.p5s.random(this.counter));
      // console.log('idx chosen for honey cluster: ' + idx);
      this.generateHoneyCluster(idx);
    }
  }


  // ------------------------------------------------------
  // Note - neighbor logic depends on generateHexGrid()
  generateHoneyCluster(idx) {
    let allNeighbors = [];

    // neighbors start from top, going clockwise
    // if index is even
    if (idx % 2 === 0) {
      allNeighbors = [
        idx - 18,
        idx - 17,
        idx + 1,
        idx + 18,
        idx - 1,
        idx - 19,
      ];
    } 
    
    // if index is odd
    else {
      allNeighbors = [
        idx - 18,
        idx + 1,
        idx + 19,
        idx + 18,
        idx + 17,
        idx - 1
      ];
    }

    // filter for any that are less than 0 (edge cells, can be OOB)
    let validNeighbors = allNeighbors.filter(n => {
      return n >= 0 && n <= this.counter;
    });

    // pick random amount from valid neighbors to fill with honey
    let chosenNeighborAmt = Math.round(this.p5s.random(0, validNeighbors.length-1));

    // fill chosen amount from set of neighbors
    // let neighborsToFill = []; // DEBUG ONLY

    // Fill the selected one first
    // BANDAID FIX sometimes undefined...
    if (this.hexagons[idx]) {
      this.hexagons[idx].fillHoney();
    } else {
      console.log('undefined idx? ' + idx);
    }

    // Then fill some chosen neighbors
    for (let i = 0; i < chosenNeighborAmt; i++) {
      const randInx = Math.round(this.p5s.random(0, validNeighbors.length-1));
      // neighborsToFill.push(validNeighbors[randInx]);
      // console.log('randInx is: ' + randInx);
      
      // BANDAID FIX for now 
      if (this.hexagons[validNeighbors[randInx]]) {
        this.hexagons[validNeighbors[randInx]].fillHoney();
      }

      if (randInx > -1) {
        validNeighbors.splice(randInx, 1);
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

      // BANDAID FIX for now
      if (this.hexagons[idx]) {
        this.hexagons[idx].layLarvae();
      }
    }
  }


  // ------------------------------------------------------
  createBees() {

    let bounds = {
      xBounds: this.xBounds,
      yBounds: this.yBounds,
      margin: this.margin
    }

    // QUEEN FIRST
    this.bees.push(new InnerBee(bounds, 0, this.imgs, 'Queen', this.p5s));

    // Worker bees
    for (let i = 0; i < this.beePop; i++) {
      this.bees.push(new InnerBee(bounds, this.beeCounter++, this.imgs, 'Worker', this.p5s));
    }
  }

}