let isCurrentViewInside = true;
let pageHeight          = window.innerHeight;
let entranceExitElem    = document.getElementById('entrance-exit-circle');

// GLOBAL
var colonyHealthElem = document.getElementById('colony-health-label');
var currentTimeElem  = document.getElementById('time-label');


setInterval(updateCurrentTime, 1000);



// ------------------------------------------------------------------
// UPDATE COLONY HEALTH
// Debug only - prob will update colony health from ovsSketch directly
function updateColonyHealth(amt) {
  let label = amt * 100;
  colonyHealthElem.innerHTML = `Colony Health: ${ label }`;
}



// ------------------------------------------------------------------
// UPDATE TIME
function updateCurrentTime() {
  // Get the current time
  let date        = new Date();
  let currentTime = "";
  let hours       = date.getHours();
  let minutes     = date.getMinutes();
  let ampm        = hours >= 12 ? 'PM' : 'AM';

  hours       = hours % 12;
  hours       = hours ? hours : 12;
  minutes     = minutes < 10 ? '0' + minutes : minutes;
  currentTime = hours + ':' + minutes + ' ' + ampm;

  currentTimeElem.innerHTML = currentTime;
}



//-------------------------------------------------------
// SCROLL BEHAVIOR
// always make sure we start at inside view,
// even on refresh
document.documentElement.scrollTop = 0;

entranceExitElem.addEventListener('click', ()=> {
  if (isCurrentViewInside) {
    // if inside view, scroll to outside view
    window.scrollBy(0, pageHeight);
  } else {
    // if outside view, scroll to inside view
    document.documentElement.scrollTop = 0;
  }

  isCurrentViewInside = !isCurrentViewInside;
});
