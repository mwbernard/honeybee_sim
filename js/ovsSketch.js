let outerViewElem = document.getElementById('outer-view-container');

// ------------------------------------------------------
// Outer view p5 sketch instance
let outerView = new p5 (( ovs ) => {
  
  // ------------------------------------------------------
  ovs.preload = () => {
    ovs.beeImage         = ovs.loadImage('../assets/icon-bee.png');
    ovs.hiveImage        = ovs.loadImage('../assets/icon-hive.png');
    ovs.foodImage        = ovs.loadImage('../assets/icon-flower.png');
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
      foodImage  : ovs.foodImage,
      hiveImage  : ovs.hiveImage,
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
    ovs.fill(ovs.colSection);
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
      ovs.foodMap.hive.foodSources.push(new FoodSource(
        ovs.mouseX, 
        ovs.height, 
        ovs.foodImage,
        ovs
      ));
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