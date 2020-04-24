let outerViewElem = document.getElementById('outer-view-container');

// ------------------------------------------------------
// Outer view p5 sketch instance
let outerView = new p5 (( ovs ) => {

  // ------------------------------------------------------
  ovs.preload = () => {
    ovs.beeImage         = ovs.loadImage('../assets/bee.png');
    ovs.beeDead          = ovs.loadImage('../assets/dead_bee.png')
    ovs.hiveImage        = ovs.loadImage('../assets/hive.png');
    ovs.lav_baby         = ovs.loadImage('../assets/lavender_baby.png');
    ovs.lav_adult        = ovs.loadImage('../assets/lavender_adult.png');
    ovs.pink_baby        = ovs.loadImage('../assets/pink_baby.png');
    ovs.pink_adult       = ovs.loadImage('../assets/pink_adult.png');
    ovs.yel_baby         = ovs.loadImage('../assets/yellow_baby.png');
    ovs.yel_adult        = ovs.loadImage('../assets/yellow_adult.png');
    ovs.flower_dead      = ovs.loadImage('../assets/flower_dead.png');

    ovs.hive             = ovs.loadImage('../assets/hivetransparent.gif');
    ovs.honey1           = ovs.loadImage('../assets/honey_small.png');
    ovs.honey2           = ovs.loadImage('../assets/honey_medium.png');
    ovs.honey3           = ovs.loadImage('../assets/honey_large.png');
    ovs.morningImg       = ovs.loadImage("../assets/morning.webp");
    ovs.dayImg           = ovs.loadImage("../assets/evening.webp");
    ovs.nightImg         = ovs.loadImage("../assets/night.webp");
    ovs.lowerImg         = ovs.morningImg;
    ovs.honeywand        = ovs.loadImage('../assets/honey_wand_outside.png')

    ovs.font            = ovs.loadFont('../assets/fonts/Nunito-Light.ttf');
  }


  // ------------------------------------------------------
  ovs.setup = () => {
    ovs.createCanvas(window.innerWidth, window.innerHeight);

    // colors
    ovs.colBgGreen = ovs.color(237, 255, 247);
    ovs.colSection = ovs.color(207, 246, 229);
    ovs.colBlue    = ovs.color(58, 25, 255);
    ovs.textFont(ovs.font);

    let ovsOpts = {
      beeImage   : ovs.beeImage,
      beeDead    : ovs.beeDead,
      hiveImage  : ovs.hiveImage,
      lav_baby    : ovs.lav_baby,
      lav_adult   : ovs.lav_adult,
      pink_baby   : ovs.pink_baby,
      pink_adult  : ovs.pink_adult,
      yel_baby    : ovs.yel_baby,
      yel_adult   : ovs.yel_adult,
      flower_dead : ovs.flower_dead,
      hive        : ovs.hive,
      honey1      : ovs.honey1,
      honey2      : ovs.honey2,
      honey3      : ovs.honey3,
      honeywand   : ovs.honeywand,

      colBgGreen : ovs.colBgGreen,
      colSection : ovs.colSection,
      colBlue    : ovs.colBlue
    }

    ovs.foodMap = new FoodMap(window.innerWidth, window.innerHeight, ovsOpts, ovs);
    ovs.switchTimeColor();
  };


  // ------------------------------------------------------
  ovs.draw = () => {
    ovs.background(ovs.lowerImg);
    ovs.drawFoodMap();
    ovs.updateColonyHealth();

    ovs.image(ovs.honeywand,ovs.mouseX - 50, ovs.mouseY - 50, 120,120);
  }


  // ------------------------------------------------------
  ovs.drawCentralBeehive = () => {
    ovs.centralBeehive.display();
  }


  // ------------------------------------------------------
  ovs.drawFoodMap = () => {
    ovs.noStroke();
  //  ovs.fill(ovs.color(58, 25, 255));
    ovs.foodMap.update();
    ovs.foodMap.display();
  }



  // ------------------------------------------------------
  // adds food on mouse click
  ovs.mousePressed = () => {
    if (ovs.dist(ovs.mouseX, ovs.mouseY, ovs.foodMap.button1pos.x, ovs.foodMap.button1pos.y)  <= 30) {
      ovs.foodMap.pressButton1();
    } else if (ovs.dist(ovs.mouseX, ovs.mouseY, ovs.foodMap.button2pos.x, ovs.foodMap.button2pos.y)  <= 30) {
      ovs.foodMap.pressButton2();
    } else if(ovs.abs(ovs.mouseX - ovs.foodMap.sliderButtonPos.x)  <= 20 &&
              ovs.mouseY > ovs.foodMap.sliderpos.y - 100 &&
              ovs.mouseY < ovs.foodMap.sliderpos.y + 100) {
      ovs.foodMap.sliderButtonPos.y = ovs.mouseY;
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


  //------------------------------------------------------
  //-------------------------------------------------------
  ovs.switchTimeColor = () => {
    if(ovs.hour() <=6) {
      ovs.lowerImg = ovs.nightImg;
    }
    else if(ovs.hour() <9) {
      ovs.lowerImg = ovs.morningImg;
    }
    else if(ovs.hour() <18) {
      ovs.lowerImg = ovs.dayImg;
    }
    else {
      ovs.lowerImg = ovs.nightImg;
    }
  }

  ovs.updateColonyHealth = () => {
    let label = ovs.int(ovs.foodMap.hive.hive_health);
    colonyHealthElem.innerHTML = `Colony Health: ${ label }`;
  }

}, outerViewElem);
