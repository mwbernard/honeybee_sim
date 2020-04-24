let innerViewElem = document.getElementById('inner-view-container');

// ------------------------------------------------------
// Inner view p5 sketch instance
let innerView = new p5 (( ivs ) => {

  ivs.backgroundCols = {
    morning : ivs.color(159, 181, 222), // #9FB5DE
    midday  : ivs.color(127, 138, 196), // #7F8AC4
    night   : ivs.color(87, 90, 167)    // #575AA7
  }

  
  //-------------------------------------------------------
  ivs.preload = () => {
    ivs.honeyCursor     = ivs.loadImage('../assets/honey-cursor.png');
    ivs.queenImg        = ivs.loadImage('../assets/queen.png');
    ivs.larvaeImg       = ivs.loadImage('../assets/larvae.png');
    ivs.workerClosedImg = ivs.loadImage('../assets/worker-closed.png');
    ivs.workerOpenImg   = ivs.loadImage('../assets/worker-open.png');
    ivs.font            = ivs.loadFont('../assets/fonts/Nunito-Light.ttf');
  }


  //-------------------------------------------------------
  ivs.setup = () => {
    ivs.createCanvas(window.innerWidth, window.innerHeight);
    ivs.switchTimeColor();
    ivs.textFont(ivs.font);

    let imgOpts = {
      queenImg        : ivs.queenImg,
      larvaeImg       : ivs.larvaeImg,
      workerClosedImg : ivs.workerClosedImg,
      workerOpenImg   : ivs.workerOpenImg
    };

    ivs.innerHive = new InnerHive(imgOpts, ivs);
  };


  //-------------------------------------------------------
  ivs.draw = () => {
    ivs.background(ivs.skyColor);
    ivs.innerHive.display();
    ivs.image(ivs.honeyCursor, ivs.mouseX - 60, ivs.mouseY - 60, 120, 120);
  }


  // ------------------------------------------------------
  ivs.windowResized = () => {
    ivs.resizeCanvas(window.innerWidth, window.innerHeight);
  }


  //-------------------------------------------------------
  ivs.switchTimeColor = () => {
    if (ivs.hour() <= 6) {
      ivs.skyColor = ivs.backgroundCols.night;
    } 
    else if (ivs.hour() < 9) {
      ivs.skyColor = ivs.backgroundCols.morning;
    } 
    else if (ivs.hour() < 18) {
      ivs.skyColor = ivs.backgroundCols.midday;
    } 
    else if (ivs.hour() <= 23) {
      ivs.skyColor = ivs.backgroundCols.night;
    }
  }
  
}, innerViewElem);
