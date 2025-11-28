window.replayMod = {};
window.replayMod.runCodeBefore = function() {
  // for logging the game's time
  window.gameNow = 0;
  window.gameStartTime = 0;
  window.gameInputs = [];
  window.direction = "NONE";
  window.setDirection = "NONE";
  window.endRecording = 1;
  window.playBackActive = 0;


  // list of apple spawns
  window.appleSpawnNum = -1;
  window.appleSpawnList = [];




}
window.replayMod.alterSnakeCode = function(code) {

  /*
  //makes the speed really speedy
  code = code.replaceAll('.66','.002')
  */

  
  //makes the speed really slow
  code = code.replaceAll('1.33','10')
  

  /*
  code = code.assertReplace(
    /([$a-zA-Z0-9_]{0,8}\?)([$a-zA-Z0-9_]{0,8}\.[$a-zA-Z0-9_]{0,8}\.play\(\))(:[$a-zA-Z0-9_]{0,8}\(this\.settings,2\)\?)([$a-zA-Z0-9_]{0,8}\.[$a-zA-Z0-9_]{0,8}\.play\(\))/, 
    '$1 $4 $3 $2'
  ); // have to load both modes before sounds work
  */

  /*
  // the oh object has the wall spawn coords
  code = assertReplace(
    code,
    /rVD\(this\.Da,this\.qc\(null,5\)\);/,
    "rVD(this.Da,this.qc(null,5));if(oh){window.wallCoords=oh;oh.x=1;oh.y=window.monumentIsCool;window.monumentIsCool++;}"
  );
  */

  
  // c and d are the apple spawn x and y coords when an apples is eaten
  code = assertReplace(
    code,
    /return\s*new\s*_\.\s*Bl\s*\(\s*c\s*,\s*d\s*\)\s*;/,
    "{if(window.endRecording===0){window.appleSpawnList.push([c,d])}if(window.playBackActive===1){window.appleSpawnNum++;return new _.Bl(window.appleSpawnList[window.appleSpawnNum][0],window.appleSpawnList[window.appleSpawnNum][1]);}else{return new _.Bl(c,d);}}"
  );

  // this.hb is the game's "Date.now()" and is used to set the pace of the whole game
  // sets snake direction and gets snake direction
  code = assertReplace(
    code,
    /return b}tick\(\){/,
    "window.gameNow=a-window.gameStartTime;return b}tick(){if(!(window.setDirection===\"NONE\")){this.Aa.direction=window.setDirection;window.setDirection=\"NONE\";}if(!(this.Aa.direction===window.direction)){console.log(this.Aa.direction);window.direction=this.Aa.direction}"
  );

  // gets the start time of the game
  code = assertReplace(
    code,
    /if\s*\(\s*this\.Aa\.direction\s*!==\s*"NONE"\s*\|\|\s*CUD\s*\(\s*this\.Aa\s*\)\s*\)\s*for\s*\(\s*;\s*a\s*-\s*this\.hb\s*>=\s*this\.Bb\s*;\s*\)\s*this\.hb\s*\+=\s*this\.Bb\s*,\s*this\.ticks\+\+\s*,\s*this\.tick\s*\(\s*\)\s*,\s*b\s*=\s*!0\s*;\s*else\s*this\.hb\s*=\s*a\s*,\s*b\s*=\s*!0\s*;/,
    "if(this.Aa.direction!==\"NONE\"||CUD(this.Aa)){if((Math.abs(window.gameStartTime-a)>1000)&&this.ticks<1){window.gameStartTime=this.hb;}for(;a-this.hb>=this.Bb;)this.hb+=this.Bb,this.ticks++,this.tick(),b=!0;}else{this.hb=a,b=!0;}"
  );

  /*
  // c and d are the apple spawn x and y coords when an apples is eaten
  code = assertReplace(
    code,
    /return\s*new\s*_\.\s*Bl\s*\(\s*c\s*,\s*d\s*\)\s*;/,
    "{window.appleSpawnNum++;window.appleSpawnDebug=[c,d];if(window.appleSpawnNum>=window.appleSpawnList.length||!(!a.has(window.appleSpawnList[window.appleSpawnNum][0]<<16|window.appleSpawnList[window.appleSpawnNum][1]))){return new _.Bl(c,d);}else{return new _.Bl(window.appleSpawnList[window.appleSpawnNum][0],window.appleSpawnList[window.appleSpawnNum][1]);}}"
  );
  */
  /*
  code = assertReplace(
    code,
    /if\s*\(\s*!a\.has\s*\(\s*c\s*<<\s*16\s*\|\s*d\s*\)\s*&&\s*e\+\+\s*===\s*b\s*\)\s*\{/,

  );
  */

  //code = code.replace('P6(this.settings,1)&&Fh','P6(this.settings,1)&&Fh && false'); // removes walls from spawning

  return code;
}
window.replayMod.runCodeAfter = function() {
  
  //Key simulating functions
  function simulateKeyPress(keyCode) {
      // Create keydown event
      const keydownEvent = new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          keyCode: keyCode,
          which: keyCode,
          key: getKeyFromCode(keyCode),
          code: getCodeFromKeyCode(keyCode)
      });

      // Create keyup event
      const keyupEvent = new KeyboardEvent('keyup', {
          bubbles: true,
          cancelable: true,
          keyCode: keyCode,
          which: keyCode,
          key: getKeyFromCode(keyCode),
          code: getCodeFromKeyCode(keyCode)
      });

      // Dispatch events to the document
      document.dispatchEvent(keydownEvent);
      document.dispatchEvent(keyupEvent);
  }

  // Helper function to get key name from key code
  function getKeyFromCode(keyCode) {
      switch(keyCode) {
          case 37: return 'ArrowLeft';
          case 38: return 'ArrowUp';
          case 39: return 'ArrowRight';
          case 40: return 'ArrowDown';
          case 32: return ' ';
          case 27: return 'Escape';
          default: return '';
      }
  }

  // Helper function to get code from key code
  function getCodeFromKeyCode(keyCode) {
      switch(keyCode) {
          case 37: return 'ArrowLeft';
          case 38: return 'ArrowUp';
          case 39: return 'ArrowRight';
          case 40: return 'ArrowDown';
          case 32: return ' ';
          case 27: return 'Escape';
          default: return '';
      }
  }

  // Key codes for arrow keys
  const KEYS = {
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,
      SPACE: 32,
      ESC: 27
  };

  // Example functions to control the snake
  function moveLeft() {
      simulateKeyPress(KEYS.LEFT);
  }

  function moveUp() {
      simulateKeyPress(KEYS.UP);
  }

  function moveRight() {
      simulateKeyPress(KEYS.RIGHT);
  }

  function moveDown() {
      simulateKeyPress(KEYS.DOWN);
  }
  //key simulating functions












  window.startRecording= function(){
    window.endRecording = 0;
    window.gameInputs = [];
    let a = setInterval(()=>{
      if(window.direction!="NONE"){
        window.gameInputs.push([directionMapper[window.direction]]);
      }
      if(window.endRecording === 1){
        clearInterval(a);
      }
    }, 135);
  }

  window.playBack = function(){
    window.playBackActive = 1;
    let i = 0;
    setTimeout(()=>{
      doMovement(window.gameInputs[0]);
    }, 100)
    let abc = setInterval(()=>{
      if(window.gameInputs.length === i){
        clearInterval(abc);
        window.playBackActive = 0;
      }
      doMovement(window.gameInputs[i]);
      i++;
    },135);
  }















  let movements = [
    1,
    1,
    1
  ];

  let macroOn = false;
  let macroLoop;

  function doMovement(a){
    if(a == 0){
      moveUp();
    }
    if(a == 1){
      moveRight();
    }
    if(a == 2){
      moveDown();
    }
    if(a == 3){
      moveLeft();
    }
  }

  let directionMapper = {
    "RIGHT":1,
    "UP":0,
    "DOWN":2,
    "LEFT":3
  }

  function keydownHandler(e){
    if(e.code === "KeyQ"){
      startRecording();
    }
    if(e.code === "Digit1"){
      window.endRecording = 1;
    }
    if(e.code === "Digit2"){
      playBack();
    }
  }

  document.addEventListener('keydown', keydownHandler);
}