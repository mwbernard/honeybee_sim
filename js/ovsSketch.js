let outerViewElem = document.getElementById('outer-view-container');

// ------------------------------------------------------
// Outer view p5 sketch instance
let outerView = new p5 (( ovs ) => {

  // ------------------------------------------------------
  ovs.preload = () => {
    ovs.beeImage         = ovs.loadImage('../assets/bee.png');
    ovs.beeDead          = ovs.loadImage('../assets/dead_bee.png')
    ovs.hiveImage8       = ovs.loadImage('../assets/hive8.png');
    ovs.hiveImage9       = ovs.loadImage('../assets/hive9.png');
    ovs.hiveImage10      = ovs.loadImage('../assets/hive10.png');
    ovs.lav_baby         = ovs.loadImage('../assets/lavender_baby.png');
    ovs.lav_adult        = ovs.loadImage('../assets/lavender_adult.png');
    ovs.pink_baby        = ovs.loadImage('../assets/pink_baby.png');
    ovs.pink_adult       = ovs.loadImage('../assets/pink_adult.png');
    ovs.yel_baby         = ovs.loadImage('../assets/yellow_baby.png');
    ovs.yel_adult        = ovs.loadImage('../assets/yellow_adult.png');
    ovs.flower_dead      = ovs.loadImage('../assets/flower_dead.png');
  }


  // ------------------------------------------------------
  ovs.setup = () => {
    ovs.createCanvas(window.innerWidth, window.innerHeight);

    // colors
    ovs.colBgGreen = ovs.color(237, 255, 247);
    ovs.colSection = ovs.color(207, 246, 229);
    ovs.colBlue    = ovs.color(58, 25, 255);

    let ovsOpts = {
      beeImage   : ovs.beeImage,
      beeDead    : ovs.beeDead,
      hiveImage8  : ovs.hiveImage8,
      hiveImage9  : ovs.hiveImage9,
      hiveImage10 : ovs.hiveImage10,
      lav_baby    : ovs.lav_baby,
      lav_adult   : ovs.lav_adult,
      pink_baby   : ovs.pink_baby,
      pink_adult  : ovs.pink_adult,
      yel_baby    : ovs.yel_baby,
      yel_adult   : ovs.yel_adult,
      flower_dead : ovs.flower_dead,

      colBgGreen : ovs.colBgGreen,
      colSection : ovs.colSection,
      colBlue    : ovs.colBlue
    }

    ovs.foodMap = new FoodMap(window.innerWidth, window.innerHeight, ovsOpts, ovs);
  };


  // ------------------------------------------------------
  ovs.draw = () => {
    ovs.background(255, 255, 0);
    ovs.drawFoodMap();
  }


  // ------------------------------------------------------
  ovs.drawCentralBeehive = () => {
    ovs.centralBeehive.display();
  }


  // ------------------------------------------------------
  ovs.drawFoodMap = () => {
    ovs.noStroke();
    ovs.fill(ovs.color(58, 25, 255));
    ovs.foodMap.update();
    ovs.foodMap.display();
  }


  // ------------------------------------------------------
  // adds food on mouse click
  ovs.mousePressed = () => {
  if (
    (ovs.mouseX > 0 && ovs.mouseX < ovs.width) &&
    (ovs.mouseY > 0 && ovs.mouseY < ovs.height)
    ) {
      ovs.foodMap.hive.addFoodSource();
    }
  }


  // ------------------------------------------------------
  ovs.findObjectByKey = (array, key, value) => {

    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
    return null;
  }


  // ------------------------------------------------------
  ovs.windowResized = () => {
    ovs.resizeCanvas(window.innerWidth, window.innerHeight);
  }

}, outerViewElem);
