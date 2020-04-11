let innerViewElem = document.getElementById('inner-view-container');

// ------------------------------------------------------
// Inner view p5 sketch instance
let innerView = new p5 (( ivs ) => {

  this.skyColor = "#9FB5DE";
  
  ivs.setup = () => {
    ivs.createCanvas(window.innerWidth, window.innerHeight);
    ivs.switchTimeColor();
  };

  ivs.draw = () => {
    ivs.background(this.skyColor);
    ivs.fill(255);
  }



//-------------------------------------------------------
ivs. switchTimeColor = () => {
  if(ivs.hour() >= 0 && ivs.hour() <=6){
    skyColor ="#52447EA";
  }
  if(ivs.hour() > 6 && ivs.hour() <9){
    skyColor = "#9FB5DE";
  }
  if(ivs.hour() >= 9 && ivs.hour() <18){
    skyColor = "#7F8AC4";
  }
  if(ivs.hour() > 18 && ivs.hour() <=23){
    skyColor = "#5247EA";
  }
}
  
}, innerViewElem);
