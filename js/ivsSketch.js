let innerViewElem = document.getElementById('inner-view-container');

// ------------------------------------------------------
// Inner view p5 sketch instance
let innerView = new p5 (( ivs ) => {
  
  ivs.setup = () => {
    ivs.createCanvas(window.innerWidth, window.innerHeight);
  };
  
  ivs.draw = () => {
    ivs.background(0, 255, 255);
    ivs.fill(255);
  }
  
}, innerViewElem);