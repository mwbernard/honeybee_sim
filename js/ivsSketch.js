let innerViewElem = document.getElementById('inner-view-container');

// ------------------------------------------------------
// Inner view p5 sketch instance
let innerView = new p5 (( ivs ) => {

  ivs.skyColor = "#9FB5DE";
  
  //-------------------------------------------------------
  ivs.setup = () => {
    ivs.createCanvas(window.innerWidth, window.innerHeight);
    // ivs.switchTimeColor();
    ivs.innerHive = new InnerHive(ivs);
  };


  //-------------------------------------------------------
  ivs.draw = () => {
    ivs.background(ivs.skyColor);
    ivs.innerHive.display();

  }


  // ------------------------------------------------------
  ivs.windowResized = () => {
    ivs.resizeCanvas(window.innerWidth, window.innerHeight);
  }


  //-------------------------------------------------------
  ivs.switchTimeColor = () => {
    if (ivs.hour() <= 6) {
      ivs.skyColor = "#52447EA";
    } 
    else if (ivs.hour() < 9) {
      ivs.skyColor = "#9FB5DE";
    } 
    else if (ivs.hour() < 18) {
      ivs.skyColor = "#7F8AC4";
    } 
    else if (ivs.hour() <= 23) {
      skyColor = "#5247EA";
    }
  }
  
}, innerViewElem);
