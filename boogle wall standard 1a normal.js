// pathing library
(function(definition) {
  /* global module, define */
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = definition();
  } else if (typeof define === 'function' && define.amd) {
    define([], definition);
  } else {
    var exports = definition();
    window.astar = exports.astar;
    window.Graph = exports.Graph;
  }
})(function() {

function pathTo(node) {
  var curr = node;
  var path = [];
  while (curr.parent) {
    path.unshift(curr);
    curr = curr.parent;
  }
  return path;
}

function getHeap() {
  return new BinaryHeap(function(node) {
    return node.f;
  });
}

var astar = {
  /**
  * Perform an A* Search on a graph given a start and end node.
  * @param {Graph} graph
  * @param {GridNode} start
  * @param {GridNode} end
  * @param {Object} [options]
  * @param {bool} [options.closest] Specifies whether to return the
             path to the closest node if the target is unreachable.
  * @param {Function} [options.heuristic] Heuristic function (see
  *          astar.heuristics).
  */
  search: function(graph, start, end, options) {
    graph.cleanDirty();
    options = options || {};
    var heuristic = options.heuristic || astar.heuristics.manhattan;
    var closest = options.closest || false;

    var openHeap = getHeap();
    var closestNode = start; // set the start node to be the closest if required

    start.h = heuristic(start, end);
    graph.markDirty(start);

    openHeap.push(start);

    while (openHeap.size() > 0) {

      // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
      var currentNode = openHeap.pop();

      // End case -- result has been found, return the traced path.
      if (currentNode === end) {
        return pathTo(currentNode);
      }

      // Normal case -- move currentNode from open to closed, process each of its neighbors.
      currentNode.closed = true;

      // Find all neighbors for the current node.
      var neighbors = graph.neighbors(currentNode);

      for (var i = 0, il = neighbors.length; i < il; ++i) {
        var neighbor = neighbors[i];

        if (neighbor.closed || neighbor.isWall()) {
          // Not a valid node to process, skip to next neighbor.
          continue;
        }

        // The g score is the shortest distance from start to current node.
        // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
        var gScore = currentNode.g + neighbor.getCost(currentNode);
        var beenVisited = neighbor.visited;

        if (!beenVisited || gScore < neighbor.g) {

          // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
          neighbor.visited = true;
          neighbor.parent = currentNode;
          neighbor.h = neighbor.h || heuristic(neighbor, end);
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;
          graph.markDirty(neighbor);
          if (closest) {
            // If the neighbour is closer than the current closestNode or if it's equally close but has
            // a cheaper path than the current closest node then it becomes the closest node
            if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
              closestNode = neighbor;
            }
          }

          if (!beenVisited) {
            // Pushing to heap will put it in proper place based on the 'f' value.
            openHeap.push(neighbor);
          } else {
            // Already seen the node, but since it has been rescored we need to reorder it in the heap
            openHeap.rescoreElement(neighbor);
          }
        }
      }
    }

    if (closest) {
      return pathTo(closestNode);
    }

    // No result was found - empty array signifies failure to find path.
    return [];
  },
  // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
  heuristics: {
    manhattan: function(pos0, pos1) {
      var d1 = Math.abs(pos1.x - pos0.x);
      var d2 = Math.abs(pos1.y - pos0.y);
      return d1 + d2;
    },
    diagonal: function(pos0, pos1) {
      var D = 1;
      var D2 = Math.sqrt(2);
      var d1 = Math.abs(pos1.x - pos0.x);
      var d2 = Math.abs(pos1.y - pos0.y);
      return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
    }
  },
  cleanNode: function(node) {
    node.f = 0;
    node.g = 0;
    node.h = 0;
    node.visited = false;
    node.closed = false;
    node.parent = null;
  }
};

/**
 * A graph memory structure
 * @param {Array} gridIn 2D array of input weights
 * @param {Object} [options]
 * @param {bool} [options.diagonal] Specifies whether diagonal moves are allowed
 */
function Graph(gridIn, options) {
  options = options || {};
  this.nodes = [];
  this.diagonal = !!options.diagonal;
  this.grid = [];
  for (var x = 0; x < gridIn.length; x++) {
    this.grid[x] = [];

    for (var y = 0, row = gridIn[x]; y < row.length; y++) {
      var node = new GridNode(x, y, row[y]);
      this.grid[x][y] = node;
      this.nodes.push(node);
    }
  }
  this.init();
}

Graph.prototype.init = function() {
  this.dirtyNodes = [];
  for (var i = 0; i < this.nodes.length; i++) {
    astar.cleanNode(this.nodes[i]);
  }
};

Graph.prototype.cleanDirty = function() {
  for (var i = 0; i < this.dirtyNodes.length; i++) {
    astar.cleanNode(this.dirtyNodes[i]);
  }
  this.dirtyNodes = [];
};

Graph.prototype.markDirty = function(node) {
  this.dirtyNodes.push(node);
};

Graph.prototype.neighbors = function(node) {
  var ret = [];
  var x = node.x;
  var y = node.y;
  var grid = this.grid;

  // West
  if (grid[x - 1] && grid[x - 1][y]) {
    ret.push(grid[x - 1][y]);
  }

  // East
  if (grid[x + 1] && grid[x + 1][y]) {
    ret.push(grid[x + 1][y]);
  }

  // South
  if (grid[x] && grid[x][y - 1]) {
    ret.push(grid[x][y - 1]);
  }

  // North
  if (grid[x] && grid[x][y + 1]) {
    ret.push(grid[x][y + 1]);
  }

  if (this.diagonal) {
    // Southwest
    if (grid[x - 1] && grid[x - 1][y - 1]) {
      ret.push(grid[x - 1][y - 1]);
    }

    // Southeast
    if (grid[x + 1] && grid[x + 1][y - 1]) {
      ret.push(grid[x + 1][y - 1]);
    }

    // Northwest
    if (grid[x - 1] && grid[x - 1][y + 1]) {
      ret.push(grid[x - 1][y + 1]);
    }

    // Northeast
    if (grid[x + 1] && grid[x + 1][y + 1]) {
      ret.push(grid[x + 1][y + 1]);
    }
  }

  return ret;
};

Graph.prototype.toString = function() {
  var graphString = [];
  var nodes = this.grid;
  for (var x = 0; x < nodes.length; x++) {
    var rowDebug = [];
    var row = nodes[x];
    for (var y = 0; y < row.length; y++) {
      rowDebug.push(row[y].weight);
    }
    graphString.push(rowDebug.join(" "));
  }
  return graphString.join("\n");
};

function GridNode(x, y, weight) {
  this.x = x;
  this.y = y;
  this.weight = weight;
}

GridNode.prototype.toString = function() {
  return "[" + this.x + " " + this.y + "]";
};

GridNode.prototype.getCost = function(fromNeighbor) {
  // Take diagonal weight into consideration.
  if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
    return this.weight * 1.41421;
  }
  return this.weight;
};

GridNode.prototype.isWall = function() {
  return this.weight === 0;
};

function BinaryHeap(scoreFunction) {
  this.content = [];
  this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
  push: function(element) {
    // Add the new element to the end of the array.
    this.content.push(element);

    // Allow it to sink down.
    this.sinkDown(this.content.length - 1);
  },
  pop: function() {
    // Store the first element so we can return it later.
    var result = this.content[0];
    // Get the element at the end of the array.
    var end = this.content.pop();
    // If there are any elements left, put the end element at the
    // start, and let it bubble up.
    if (this.content.length > 0) {
      this.content[0] = end;
      this.bubbleUp(0);
    }
    return result;
  },
  remove: function(node) {
    var i = this.content.indexOf(node);

    // When it is found, the process seen in 'pop' is repeated
    // to fill up the hole.
    var end = this.content.pop();

    if (i !== this.content.length - 1) {
      this.content[i] = end;

      if (this.scoreFunction(end) < this.scoreFunction(node)) {
        this.sinkDown(i);
      } else {
        this.bubbleUp(i);
      }
    }
  },
  size: function() {
    return this.content.length;
  },
  rescoreElement: function(node) {
    this.sinkDown(this.content.indexOf(node));
  },
  sinkDown: function(n) {
    // Fetch the element that has to be sunk.
    var element = this.content[n];

    // When at 0, an element can not sink any further.
    while (n > 0) {

      // Compute the parent element's index, and fetch it.
      var parentN = ((n + 1) >> 1) - 1;
      var parent = this.content[parentN];
      // Swap the elements if the parent is greater.
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element;
        this.content[n] = parent;
        // Update 'n' to continue at the new position.
        n = parentN;
      }
      // Found a parent that is less, no need to sink any further.
      else {
        break;
      }
    }
  },
  bubbleUp: function(n) {
    // Look up the target element and its score.
    var length = this.content.length;
    var element = this.content[n];
    var elemScore = this.scoreFunction(element);

    while (true) {
      // Compute the indices of the child elements.
      var child2N = (n + 1) << 1;
      var child1N = child2N - 1;
      // This is used to store the new position of the element, if any.
      var swap = null;
      var child1Score;
      // If the first child exists (is inside the array)...
      if (child1N < length) {
        // Look it up and compute its score.
        var child1 = this.content[child1N];
        child1Score = this.scoreFunction(child1);

        // If the score is less than our element's, we need to swap.
        if (child1Score < elemScore) {
          swap = child1N;
        }
      }

      // Do the same checks for the other child.
      if (child2N < length) {
        var child2 = this.content[child2N];
        var child2Score = this.scoreFunction(child2);
        if (child2Score < (swap === null ? elemScore : child1Score)) {
          swap = child2N;
        }
      }

      // If the element needs to be moved, swap it, and continue.
      if (swap !== null) {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      }
      // Otherwise, we are done.
      else {
        break;
      }
    }
  }
};

return {
  astar: astar,
  Graph: Graph
};

});

// A* library ^^^^^



const mapWidth = 17;
const mapHeight = 15;
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
let simulationOn = false;
let availableWallSpawns = [];
let snake_body = [
  ["h", 4, 7],
  ["s", 3, 7],
  ["s", 2, 7]
];
let apples = [
  [12, 7]
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
  if(simulationOn){
    let nextTile = path[(path.findIndex(row => row.x===snake_body[0][1]&&row.y===snake_body[0][2]))+1];
    if(nextTile.x-snake_body[0][1]===1){
      direction = 1;
    } else if(nextTile.x-snake_body[0][1]===-1){
      direction = 3;
    } else if(nextTile.y-snake_body[0][2]===1){
      direction = 2;
    } else if(nextTile.y-snake_body[0][2]===-1){
      direction = 0;
    } else{
      console.error("could not find direction");
    }
    path.splice((path.findIndex(row => row.x===snake_body[0][1]&&row.y===snake_body[0][2]))+1,1);
  }else{
    if(inputBuffer.length>0){
      if(!((inputBuffer[0]+2)%4===direction)){
        direction = inputBuffer[0];
      }
      inputBuffer.splice(0,1);
    }
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
  renderPath();

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
        calculatePath();
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

function calculatePath(){
  // reset variables
  let gameGraph = [];
  let currentRow = [];
  for(let i = 0; i<mapWidth; i++){
    currentRow = [];
    for(let j = 0; j<mapHeight; j++){
      if(walls.some(row=>row[0]===i&&row[1]===j)||snake_body.some(row=>row[1]===i&&row[2]===j)){
        currentRow.push(0);
      } else {
        currentRow.push(1);
      }
    }
    gameGraph.push(currentRow);
  }
  gameGraph = new Graph(gameGraph);
  let start = gameGraph.grid[snake_body[0][1]][snake_body[0][2]];
  let end = gameGraph.grid[apples[0][0]][apples[0][1]];
  path = astar.search(gameGraph, start, end);
}

function renderPath(){
  // graphs out path for debug
  for(let i = 0;i<path.length-1;i++){
    createTile(path[i].x,path[i].y,"#eeff00ff");
  }
}

function runSimulationDemo(){
  calculatePath();
  simulationOn = true;
  game_started = true;
}


/*
notes:
make astar account for tail moving out of the way
make it not trap itself
*/



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
