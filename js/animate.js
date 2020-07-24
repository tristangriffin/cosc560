////////////////// REQUIRED FOR ANIMATION
 
  var objectframestate = [];
  var objectframecount = [];
  var objectspritesheet  = [];
  var objectspritewidth = [];
  var framerate =1;
  objectframecount[0] = 1;
  objectframestate[0] = "running"; // player default
  objectspritesheet[0] = "playerspritesheet"; // change this to whatever your spritesheet Element ID is
  objectspritewidth[0] = "100";
  
  

  
  
  
  ///////////////////////////////////////////////////////////////////////
  ///// ANIMATE PLAYER
  /////
  //////////////////////////////////////////////////////////////////////
  
  
  
function animateobjects() 
{// set defaults
if(document.getElementById(objectspritesheet[0])){  // make sure the sprite sheet exists to prevent program breaking
  objectframestate[0] = "idle";
  //document.getElementById('player').style.backgroundColor = "orange";
 
  // get the player animation
  if(keypress.left || userStatemoveA == "runningLeft" ){
     objectframestate[0] = "running";
     document.getElementById("playerspritesheet").style.top = "-100%"; }
  
  if(keypress.right || userStatemoveA == "runningRight"){
   objectframestate[0] = "running";
   document.getElementById(objectspritesheet[0]).style.top = "0px"; }
 
  // update the sprite sheet
  if( objectframestate[0] == "running") {
    objectframecount[0]++; 
    if( objectframecount[0] > framerate) { 
      document.getElementById(objectspritesheet[0]).style.left = "-" + objectspritewidth[0] + "%";  }
    if( objectframecount[0] > framerate*2){ 
      document.getElementById(objectspritesheet[0]).style.left = "-" + (objectspritewidth[0]*2) + "%";  }
    if( objectframecount[0] > framerate*3){ 
      document.getElementById(objectspritesheet[0]).style.left = "-" + (objectspritewidth[0]*3) + "%";  }
    if( objectframecount[0] > framerate*4){
      document.getElementById(objectspritesheet[0]).style.left = "-" + (objectspritewidth[0]*4) + "%";   }
    if( objectframecount[0] > framerate*5){ 
      document.getElementById(objectspritesheet[0]).style.left = "-" + (objectspritewidth[0]*5) + "%";   }
    if( objectframecount[0] > framerate*6){
      document.getElementById(objectspritesheet[0]).style.left = "-" + (objectspritewidth[0]*6) + "%";   }
    if( objectframecount[0] > framerate*7){ 
      document.getElementById(objectspritesheet[0]).style.left = "-" + (objectspritewidth[0]*7) + "%";   }
    if( objectframecount[0] > framerate*8){ objectframecount[0] = 0;
      document.getElementById(objectspritesheet[0]).style.left = "0px";  }
  }//end running
 }
 
}