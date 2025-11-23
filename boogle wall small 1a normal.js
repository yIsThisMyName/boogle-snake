const mapWidth = 10;
const mapHeight = 9;
const gameWidth = 500;
const gameHeight = 500;
const tileWidth = ((gameWidth-20)/Math.max(mapHeight,mapWidth));
let dead = 0;
let inputBuffer = [];
let impossibleWallSpawns = [];
let appleCount = 0;
let tileCount = 0;
let tileTimeInMs = 135;
let walls = [];
let direction = 1;
let no_apples = true;
let game_started = false;
let all_apples = false;
let availableWallSpawns = [];
let snake_body = [
  ["h", 3, 4],
  ["s", 2, 4],
  ["s", 1, 4]
];
let apples = [
  [7, 4]
];

// snake ai variables
let path = [];



const square = document.createElement("div");
square.id = 'green-square';
square.style.width = gameWidth + "px";
square.style.height = gameHeight + "px";
square.style.background = "#174417ff";
square.style.border = "1px solid black";
square.style.position = "fixed";
square.style.top = "50%";
square.style.left = "50%";
square.style.transform = "translate(-50%, -50%)";
document.body.appendChild(square);
const greenSquareText = document.createElement("div");
greenSquareText.style.whiteSpace = "pre";
greenSquareText.textContent = "0 apples                    0.000";
greenSquareText.style.color = "gray";
greenSquareText.style.fontSize = "24px";
greenSquareText.style.fontFamily = "Arial";
greenSquareText.style.position = 'fixed';
greenSquareText.style.left = "10px";
greenSquareText.style.top = "-30px";
square.appendChild(greenSquareText);


function tileX(x){
  return 10+tileWidth*x;
}
function tileY(y){
  return 10+tileWidth*y;
}
function drawMap(){
  for(let j = 0; j < mapHeight; j++){
    for(let i = 0; i < mapWidth; i++){
      if((j+i) % 2 == 0){
        createTile(i,j,"#44c944ff");
      } else {
        createTile(i,j,"#32a232ff");
      }
    }
  }
}

function draw_stuff(){
  document.querySelectorAll('.tile').forEach(element => {
    element.remove();
  });

  drawMap();

  /*for(let i = 0;i<impossibleWallSpawns.length;i++){
    createTile(impossibleWallSpawns[i][0],impossibleWallSpawns[i][1],"#eeff00ff");
  }*/
  for(let i = 0; i<snake_body.length; i++){
    if(snake_body[i][0] == "h"){
      createTile(snake_body[i][1],snake_body[i][2],"#8400ffff");
    } else {
      createTile(snake_body[i][1],snake_body[i][2],"#1900ffff");
    }
  }
  for(let i = 0; i<apples.length; i++){
    createTile(apples[i][0],apples[i][1],"#ff0000ff");
  }
  for(let i = 0; i<walls.length; i++){
    createTile(walls[i][0],walls[i][1],"#174417ff");
  }
}

function snake_move(){
  /*if(appleCount===25){
    clearInterval(a);
    console.log("your 25 time: "+(tileCount*tileTimeInMs/1000).toFixed(3));
  }*/
  if(inputBuffer.length>0){
    if(!((inputBuffer[0]+2)%4===direction)){
      direction = inputBuffer[0];
    }
    inputBuffer.splice(0,1);
  }
  if(direction == 0){
    snake_body.splice(0, 0, ["h", snake_body[0][1], snake_body[0][2]-1]);
    snake_body[1][0] = "s";
    check_for_apples();
    if(no_apples){
      snake_body.splice(snake_body.length-1, 1);
    }
  } else if(direction == 1){
    snake_body.splice(0, 0, ["h", snake_body[0][1]+1, snake_body[0][2]]);
    snake_body[1][0] = "s";
    check_for_apples();
    if(no_apples){
      snake_body.splice(snake_body.length-1, 1);
    }
  } else if(direction == 2){
    snake_body.splice(0, 0, ["h", snake_body[0][1], snake_body[0][2]+1]);
    snake_body[1][0] = "s";
    check_for_apples();
    if(no_apples){
      snake_body.splice(snake_body.length-1, 1);
    }
  } else {
    snake_body.splice(0, 0, ["h", snake_body[0][1]-1, snake_body[0][2]]);
    snake_body[1][0] = "s";
    check_for_apples();
    if(no_apples){
      snake_body.splice(snake_body.length-1, 1);
    }
  }
  draw_stuff();
  if(snake_body[0][1]<0||snake_body[0][1]>mapWidth-1||snake_body[0][2]<0||snake_body[0][2]>mapHeight-1){
    clearInterval(a);
    dead=1;
  }
  for(let i = 1;i<snake_body.length;i++){
    if(snake_body[0][1]===snake_body[i][1]&&snake_body[0][2]===snake_body[i][2]){
      clearInterval(a);
      dead=1;
    }
  }
  for(let i = 0;i<walls.length;i++){
    if(snake_body[0][1]===walls[i][0]&&snake_body[0][2]===walls[i][1]){
      clearInterval(a);
      dead=1;
    }
  }

  if(all_apples){
    clearInterval(a);
    dead=2;
    console.log("ur insane at the game, congrats on getting all in boogle snake!!!");
  }
  tileCount++;
  greenSquareText.textContent = appleCount+" apples                    "+(tileCount*tileTimeInMs/1000).toFixed(3);
}

function check_for_apples(){
  no_apples = true;
  for(let i = 0; i<apples.length; i++){
    if((snake_body[0][1] == apples[i][0]) && (snake_body[0][2] == apples[i][1])){
      appleCount++;
      if(appleCount%2===1){
        spawn_wall();
      }
      no_apples = false;
      let spawn_works = false;
      let no_spawns = true;
      let possible_apple_spawn = [];
      while(!spawn_works){
        possible_apple_spawn = [Math.floor(Math.random()*mapWidth),Math.floor(Math.random()*mapHeight)];
        spawn_works = true;
        for(let j=0; j<snake_body.length; j++){
          if((snake_body[j][1] == possible_apple_spawn[0]) && (snake_body[j][2] == possible_apple_spawn[1])){
            spawn_works = false;
          }
        }
        for(let j=0; j<apples.length; j++){
          if((apples[j][0] == possible_apple_spawn[0]) && (apples[j][1] == possible_apple_spawn[1])){
            spawn_works = false;
          }
        }
        for(let j=0;j<walls.length;j++){
          if(possible_apple_spawn[0]===walls[j][0]&&possible_apple_spawn[1]===walls[j][1]){
            spawn_works = false;
          }
        }

        for(let i = 0; i<mapWidth;i++){
          for(let j = 0; j<mapHeight;j++){
            if(!(
              (walls.some(row=>row[0]===i&&row[1]===j))||
              (apples.some(row=>row[0]===i&&row[1]===j))||
              (snake_body.some(row=>row[1]===i&&row[2]===j))
            )){
              no_spawns = false;
            }
          }
        }
        if(no_spawns){
          break;
        }
      }
      if(no_spawns){
        apples.splice(i,1);
        if(apples.length===0){
          all_apples = true;
        }
      } else {
        apples[i]=possible_apple_spawn;
      }
    }
  }
}

function spawn_wall(){
  availableWallSpawns = []
  for(let i = 0; i<mapWidth;i++){
    for(let j = 0; j<mapHeight;j++){
      availableWallSpawns.push([i,j]);
    }
  }

  impossibleWallSpawns = []

  // snake body and apples
  for(let i = 0;i<snake_body.length;i++){
    impossibleWallSpawns.push([snake_body[i][1],snake_body[i][2]]);
  }
  for(let i = 0;i<apples.length;i++){
    impossibleWallSpawns.push([apples[i][0],apples[i][1]]);
  }
  // spawn radius
  impossibleWallSpawns.push([snake_body[0][1],snake_body[0][2]-3]);
  for(let i = 0;i<3;i++){
    impossibleWallSpawns.push([snake_body[0][1]-1+i,snake_body[0][2]-2]);
  }
  for(let i = 0;i<5;i++){
    impossibleWallSpawns.push([snake_body[0][1]-2+i,snake_body[0][2]-1]);
  }
  for(let i = 0;i<7;i++){
    impossibleWallSpawns.push([snake_body[0][1]-3+i,snake_body[0][2]]);
  }
  for(let i = 0;i<5;i++){
    impossibleWallSpawns.push([snake_body[0][1]-2+i,snake_body[0][2]+1]);
  }
  for(let i = 0;i<3;i++){
    impossibleWallSpawns.push([snake_body[0][1]-1+i,snake_body[0][2]+2]);
  }
  impossibleWallSpawns.push([snake_body[0][1],snake_body[0][2]+3]);

  // wall corner rule
  impossibleWallSpawns.push([0,1]);
  impossibleWallSpawns.push([1,0]);
  impossibleWallSpawns.push([0,mapHeight-2]);
  impossibleWallSpawns.push([1,mapHeight-1]);
  impossibleWallSpawns.push([mapWidth-2,0]);
  impossibleWallSpawns.push([mapWidth-1,1]);
  impossibleWallSpawns.push([mapWidth-1,mapHeight-2]);
  impossibleWallSpawns.push([mapWidth-2,mapHeight-1]);

  // walls next to each other
  // no walls on walls
  // no walls only 1 apart from each other on the wall
  // no walls impossible things in corners
  for(let i=0;i<walls.length;i++){
    for(let k=0;k<3;k++){
      for(let j=0;j<3;j++){
        impossibleWallSpawns.push([walls[i][0]-1+j,walls[i][1]-1+k]);
      }
    }
    if(walls[i][0]===0||walls[i][0]===mapWidth-1){
      impossibleWallSpawns.push([walls[i][0],walls[i][1]-2]);
      impossibleWallSpawns.push([walls[i][0],walls[i][1]+2]);
    }
    if(walls[i][1]===0||walls[i][1]===mapHeight-1){
      impossibleWallSpawns.push([walls[i][0]+2,walls[i][1]]);
      impossibleWallSpawns.push([walls[i][0]-2,walls[i][1]]);
    }
    if(walls[i][0]===0&&walls[i][1]===2){
      impossibleWallSpawns.push([2,0]);
    }
    if(walls[i][0]===2&&walls[i][1]===0){
      impossibleWallSpawns.push([0,2]);
    }
    if(walls[i][0]===0&&walls[i][1]===mapHeight-3){
      impossibleWallSpawns.push([2,mapHeight-1]);
    }
    if(walls[i][0]===2&&walls[i][1]===mapHeight-1){
      impossibleWallSpawns.push([0,mapHeight-3]);
    }
    if(walls[i][0]===mapWidth-3&&walls[i][1]===mapHeight-1){
      impossibleWallSpawns.push([mapWidth-1,mapHeight-3]);
    }
    if(walls[i][0]===mapWidth-1&&walls[i][1]===mapHeight-3){
      impossibleWallSpawns.push([mapWidth-3,mapHeight-1]);
    }
    if(walls[i][0]===mapWidth-3&&walls[i][1]===0){
      impossibleWallSpawns.push([mapWidth-1,2]);
    }
    if(walls[i][0]===mapWidth-1&&walls[i][1]===2){
      impossibleWallSpawns.push([mapWidth-3,0]);
    }
  }

  // remove impossible walls from available wall spawns
  for(let i=0;i<availableWallSpawns.length;i++){
    if(impossibleWallSpawns.some(row=>row[0]===availableWallSpawns[i][0]&&row[1]===availableWallSpawns[i][1])){
      availableWallSpawns.splice(i,1);
      i--;
    }
  }

  // ADDS A WALL!!!
  if(availableWallSpawns.length>0){
    walls.push(availableWallSpawns[Math.floor(Math.random()*availableWallSpawns.length)]);
  }
}

function adjustX(x){
  if(x>mapWidth-1){
    return x-mapWidth;
  }
  if(x<0){
    return x+mapWidth;
  }
  return x;
}

function adjustY(y){
  if(y>mapHeight-1){
    return y-mapHeight;
  }
  if(y<0){
    return y+mapHeight;
  }
  return y;
}

function createTile(x, y, color){
  let tile = document.createElement("div");
  tile.classList.add('tile');
  tile.style.width = tileWidth + 'px';
  tile.style.height = tileWidth + 'px';
  tile.style.background = color;
  tile.style.position = 'fixed';
  tile.style.top = tileY(y)+'px';
  tile.style.left = tileX(x)+'px';
  square.appendChild(tile);
}








// for snake ai

function runSimulation(){
  // reset variables
  dead = 0;
  impossibleWallSpawns = [];
  appleCount = 0;
  tileCount = 0;
  tileTimeInMs = 135;
  walls = [];
  direction = 1;
  no_apples = true;
  game_started = false;
  availableWallSpawns = [];
  path = [];
  snake_body = [
    ["h", 4, 7],
    ["s", 3, 7],
    ["s", 2, 7]
  ];
  apples = [
    [12, 7]
  ];

  let sinePathX = 0;
  let sinePathY = 0;

  // calculate shortest path to apple
  if((apples[0][0]-snake_body[0][1])===0){
    sinePathX = 0;
  }else{
    sinePathX = Math.abs(apples[0][0]-snake_body[0][1])/(apples[0][0]-snake_body[0][1]);
  }
  if((apples[0][1]-snake_body[0][2])===0){
    sinePathY = 0;
  }else{
    sinePathY = Math.abs(apples[0][1]-snake_body[0][2])/(apples[0][1]-snake_body[0][2]);
  }
  for(let i = 0;i<Math.abs(apples[0][0]-snake_body[0][1]);i++){ // add all the movements in the x direction
    path.push([snake_body[0][1]+sinePathX*(i+1),snake_body[0][2]]);
  }
  for(let i = 0;i<Math.abs(apples[0][1]-snake_body[0][2]);i++){ // add all the movements in the y direction
    path.push([snake_body[0][1],snake_body[0][2]+sinePathY*(i+1)]);
  }

  // find thing in the way
  for(let i = 0;i<path.length;i++){
    if(walls.some(row=>row[0]===path[i][0]&&row[1]===path[i][1])||
    snake_body.some(row=>row[0]===path[i][0]&&row[1]===path[i][1])){
      
    }
  }

  // graphs out path for debug
  for(let i = 0;i<path.length;i++){
    createTile(path[i][0],path[i][1],"#eeff00ff");
  }
}




// for snake ai ^^^^^^^










// for manual play
document.addEventListener("keydown", function(a){
  if(a.code === "ArrowLeft"||a.code === "KeyA"){
    if(!(direction===1)){
      game_started = true;
    }
    if(inputBuffer.length<2){
      inputBuffer.push(3);
    }
  }
  if(a.code === "ArrowUp"||a.code === "KeyW"){
    if(!(direction===2)){
      game_started = true;
    }
    if(inputBuffer.length<2){
      inputBuffer.push(0);
    }
  }
  if(a.code === "ArrowRight"||a.code === "KeyD"){
    if(!(direction===3)){
      game_started = true;
    }
    if(inputBuffer.length<2){
      inputBuffer.push(1);
    }
  }
  if(a.code === "ArrowDown"||a.code === "KeyS"){
    if(!(direction===0)){
      game_started = true;
    }
    if(inputBuffer.length<2){
      inputBuffer.push(2);
    }
  }
});

draw_stuff();

let a = setInterval(function(){
  if(game_started){
    snake_move();
  }
}, tileTimeInMs);