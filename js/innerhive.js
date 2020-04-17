// --------------------------------------------------------
// Hive grid code adapted from:
// https://editor.p5js.org/FirstProphet/sketches/SJR6ZKhd7
// --------------------------------------------------------

class InnerHive {

  // ------------------------------------------------------
  constructor(imgs, p5s) {
    this.p5s              = p5s;
    this.imgs             = imgs;
    this.r                = 40;
    this.s                = this.p5s.sqrt(3 * this.p5s.pow(this.r, 2) / 4);
    this.hexagons         = [];
    this.beePop           = 20;
    this.bees             = [];
    this.numLarvae        = Math.round(this.p5s.random(1, 5));
    this.numHoneyClusters = Math.round(this.p5s.random(1, 5));
    this.numCols          = 15;
    this.numRows          = 6
    this.margin           = 175;
    this.counter          = 0;
    this.beeCounter       = 1;

    this.generateHexGrid();
    this.spawnLarvae();
    this.createBees();
    this.generateHoneyClusters();
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
  
    // These are unfortunately arbitrary right now, just
    // estimating on a roughly 1400 x 900 window size
    // will figure this out later, but note that neighbor logic
    // depends on this being static

    let yBounds = 580;
    let xBounds = 1255;

    // for (let y = 0; y < yBounds; y += 2 * this.s) {
    //   for (let x = this.margin; x < xBounds; x += 3 * this.r) {

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

    // console.log('numHexagons: ', this.hexagons.length);
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
  // This function takes an index, each neighbor (if currently empty) 
  // gets filled with honey with a 30% or something
  // then you recurse on the cells that do get filled in
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
    this.hexagons[idx].fillHoney();

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
      xBounds: (this.p5s.width + this.r) - this.margin - (this.r * 2),
      yBounds:  this.p5s.height + this.s - this.margin,
    }

    // QUEEN FIRST
    this.bees.push(new InnerBee(bounds, 0, this.imgs, 'Queen', this.p5s));

    // Worker bees
    for (let i = 0; i < this.beePop; i++) {
      this.bees.push(new InnerBee(bounds, this.beeCounter++, this.imgs, 'Worker', this.p5s));
    }
  }

}