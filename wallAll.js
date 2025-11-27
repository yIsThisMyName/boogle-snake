window.wallAll = {};
window.wallAll.runCodeBefore = function() {
  window.walls = [];
}
window.wallAll.alterSnakeCode = function(code) {

  // c is the list of blocked wall spawns
  // b is the wall spawn
  code = assertReplace(
    code,
    /;const\s+c=\[(?:new\s+_\.\s*Bl\(b\.x[+-]?\d?,b\.y[+-]?\d?\))(?:,\s*new\s+_\.\s*Bl\(b\.x[+-]?\d?,b\.y[+-]?\d?\)){7}\];/,
    ";window.walls.push([b.x,b.y]);let cTemp=[new _.Bl(b.x-1,b.y-1),new _.Bl(b.x,b.y-1),new _.Bl(b.x+1,b.y-1),new _.Bl(b.x-1,b.y),new _.Bl(b.x+1,b.y),new _.Bl(b.x-1,b.y+1),new _.Bl(b.x,b.y+1),new _.Bl(b.x+1,b.y+1)];if(b.y===a.Ba.length-2||b.y===1){cTemp.push(new _.Bl(b.x-2,b.y));cTemp.push(new _.Bl(b.x+2,b.y));}if(b.x===a.Ba[0].length-2||b.x===1){cTemp.push(new _.Bl(b.x,b.y-2));cTemp.push(new _.Bl(b.x,b.y+2));}if((b.x===a.Ba[0].length-1)&&(b.y===a.Ba.length-1)){cTemp.push(new _.Bl(b.x-3,b.y-1));cTemp.push(new _.Bl(b.x-1,b.y-3));}if((b.x===a.Ba[0].length-4)&&(b.y===a.Ba.length-2)){cTemp.push(new _.Bl(b.x+3,b.y+1));}if((b.x===a.Ba[0].length-2)&&(b.y===a.Ba.length-4)){cTemp.push(new _.Bl(b.x+1,b.y+3));}if((b.x===0)&&(b.y===a.Ba.length-1)){cTemp.push(new _.Bl(b.x+3,b.y-1));cTemp.push(new _.Bl(b.x+1,b.y-3));}if((b.x===3)&&(b.y===a.Ba.length-2)){cTemp.push(new _.Bl(0,b.y+1));}if((b.x===1)&&(b.y===a.Ba.length-4)){cTemp.push(new _.Bl(0,b.y+3));}if((b.x===0)&&(b.y===0)){cTemp.push(new _.Bl(b.x+3,b.y+1));cTemp.push(new _.Bl(b.x+1,b.y+3));}if((b.x===3)&&(b.y===1)){cTemp.push(new _.Bl(0,0));}if((b.x===1)&&(b.y===3)){cTemp.push(new _.Bl(0,0));}if((b.x===a.Ba[0].length-1)&&(b.y===0)){cTemp.push(new _.Bl(b.x-3,b.y+1));cTemp.push(new _.Bl(b.x-1,b.y+3));}if((b.x===a.Ba[0].length-4)&&(b.y===1)){cTemp.push(new _.Bl(b.x+3,0));}if((b.x===a.Ba[0].length-2)&&(b.y===3)){cTemp.push(new _.Bl(b.x+1,0));}if((b.y===a.Ba.length-1)&&((window.walls.some(a=>a[0]===b.x+2&&a[1]===b.y-2))||(window.walls.some(a=>a[0]===b.x-2&&a[1]===b.y-2)))){cTemp.push(new _.Bl(b.x,b.y-2));}if((b.y===a.Ba.length-3)&&(window.walls.some(a=>a[0]===b.x+2&&a[1]===b.y+2))){cTemp.push(new _.Bl(b.x+2,b.y));}if((b.y===a.Ba.length-3)&&(window.walls.some(a=>a[0]===b.x-2&&a[1]===b.y+2))){cTemp.push(new _.Bl(b.x-2,b.y));}if((b.x===0)&&((window.walls.some(a=>a[0]===b.x+2&&a[1]===b.y+2))||(window.walls.some(a=>a[0]===b.x+2&&a[1]===b.y-2)))){cTemp.push(new _.Bl(b.x+2,b.y));}if((b.x===2)&&(window.walls.some(a=>a[0]===b.x-2&&a[1]===b.y-2))){cTemp.push(new _.Bl(b.x,b.y-2));}if((b.x===2)&&(window.walls.some(a=>a[0]===b.x-2&&a[1]===b.y+2))){cTemp.push(new _.Bl(b.x,b.y+2));}if((b.x===a.Ba[0].length-1)&&((window.walls.some(a=>a[0]===b.x-2&&a[1]===b.y-2))||(window.walls.some(a=>a[0]===b.x-2&&a[1]===b.y+2)))){cTemp.push(new _.Bl(b.x-2,b.y));}if((b.x===a.Ba[0].length-3)&&(window.walls.some(a=>a[0]===b.x+2&&a[1]===b.y+2))){cTemp.push(new _.Bl(b.x,b.y+2));}if((b.x===a.Ba[0].length-3)&&(window.walls.some(a=>a[0]===b.x+2&&a[1]===b.y-2))){cTemp.push(new _.Bl(b.x,b.y-2));}if((b.y===0)&&((window.walls.some(a=>a[0]===b.x+2&&a[1]===b.y+2))||(window.walls.some(a=>a[0]===b.x-2&&a[1]===b.y+2)))){cTemp.push(new _.Bl(b.x,b.y+2));}if((b.y===2)&&(window.walls.some(a=>a[0]===b.x-2&&a[1]===b.y-2))){cTemp.push(new _.Bl(b.x-2,b.y));}if((b.y===2)&&(window.walls.some(a=>a[0]===b.x+2&&a[1]===b.y-2))){cTemp.push(new _.Bl(b.x+2,b.y));}if((b.y===a.Ba.length-3)&&(window.walls.some(a=>a[0]===b.x&&a[1]===b.y+2))){cTemp.push(new _.Bl(b.x+2,b.y));cTemp.push(new _.Bl(b.x-2,b.y));}if((b.y===a.Ba.length-1)&&(window.walls.some(a=>a[0]===b.x&&a[1]===b.y-2))){cTemp.push(new _.Bl(b.x+2,b.y-2));cTemp.push(new _.Bl(b.x-2,b.y-2));}if((b.x===a.Ba.length[0]-3)&&(window.walls.some(a=>a[0]===b.x+2&&a[1]===b.y))){cTemp.push(new _.Bl(b.x,b.y-2));cTemp.push(new _.Bl(b.x,b.y+2));}if((b.x===a.Ba.length[0]-1)&&(window.walls.some(a=>a[0]===b.x-2&&a[1]===b.y))){cTemp.push(new _.Bl(b.x-2,b.y-2));cTemp.push(new _.Bl(b.x-2,b.y+2));}if((b.x===2)&&(window.walls.some(a=>a[0]===b.x-2&&a[1]===b.y))){cTemp.push(new _.Bl(b.x,b.y-2));cTemp.push(new _.Bl(b.x,b.y+2));}if((b.x===0)&&(window.walls.some(a=>a[0]===b.x+2&&a[1]===b.y))){cTemp.push(new _.Bl(b.x+2,b.y-2));cTemp.push(new _.Bl(b.x+2,b.y+2));}if((b.y===0)&&(window.walls.some(a=>a[0]===b.x&&a[1]===b.y+2))){cTemp.push(new _.Bl(b.x-2,b.y+2));cTemp.push(new _.Bl(b.x+2,b.y+2));}if((b.y===2)&&(window.walls.some(a=>a[0]===b.x&&a[1]===b.y-2))){cTemp.push(new _.Bl(b.x+2,b.y));cTemp.push(new _.Bl(b.x-2,b.y));}if((b.y===a.Ba.length-3)&&(window.walls.some(a=>a[0]===b.x-2&&a[1]===b.y))){cTemp.push(new _.Bl(b.x,b.y+2));cTemp.push(new _.Bl(b.x-2,b.y+2));}if((b.y===a.Ba.length-3)&&(window.walls.some(a=>a[0]===b.x+2&&a[1]===b.y))){cTemp.push(new _.Bl(b.x,b.y+2));cTemp.push(new _.Bl(b.x+2,b.y+2));}if((b.x===a.Ba[0].length-3)&&(window.walls.some(a=>a[0]===b.x&&a[1]===b.y-2))){cTemp.push(new _.Bl(b.x+2,b.y-2));cTemp.push(new _.Bl(b.x+2,b.y));}if((b.x===a.Ba[0].length-3)&&(window.walls.some(a=>a[0]===b.x&&a[1]===b.y+2))){cTemp.push(new _.Bl(b.x+2,b.y+2));cTemp.push(new _.Bl(b.x+2,b.y));}if((b.x===2)&&(window.walls.some(a=>a[0]===b.x&&a[1]===b.y-2))){cTemp.push(new _.Bl(b.x-2,b.y-2));cTemp.push(new _.Bl(b.x-2,b.y));}if((b.x===2)&&(window.walls.some(a=>a[0]===b.x&&a[1]===b.y+2))){cTemp.push(new _.Bl(b.x-2,b.y+2));cTemp.push(new _.Bl(b.x-2,b.y));}if((b.y===2)&&(window.walls.some(a=>a[0]===b.x+2&&a[1]===b.y))){cTemp.push(new _.Bl(b.x+2,b.y-2));cTemp.push(new _.Bl(b.x,b.y-2));}if((b.y===2)&&(window.walls.some(a=>a[0]===b.x-2&&a[1]===b.y))){cTemp.push(new _.Bl(b.x-2,b.y-2));cTemp.push(new _.Bl(b.x,b.y-2));}const c=cTemp;"
  );

  return code;
}
window.wallAll.runCodeAfter = function() {



/*
  // for typing out code
  window.walls.push([b.x,b.y]);
  let cTemp=[new _.Bl(b.x-1,b.y-1),new _.Bl(b.x,b.y-1),new _.Bl(b.x+1,b.y-1),new _.Bl(b.x-1,b.y),new _.Bl(b.x+1,b.y),new _.Bl(b.x-1,b.y+1),new _.Bl(b.x,b.y+1),new _.Bl(b.x+1,b.y+1)];
  // gets rid of 1 gap pairs next to walls (bad pattern #1)
  if(b.y===a.Ba.length-2||b.y===1){
      cTemp.push(new _.Bl(b.x-2,b.y));
      cTemp.push(new _.Bl(b.x+2,b.y));
  }
  if(b.x===a.Ba[0].length-2||b.x===1){
      cTemp.push(new _.Bl(b.x,b.y-2));
      cTemp.push(new _.Bl(b.x,b.y+2));
  }
  //gets rid of bad pattern #2
  if((b.x===a.Ba[0].length-1)&&(b.y===a.Ba.length-1)){
    cTemp.push(new _.Bl(b.x-3,b.y-1));
    cTemp.push(new _.Bl(b.x-1,b.y-3));
  }
  if((b.x===a.Ba[0].length-4)&&(b.y===a.Ba.length-2)){
    cTemp.push(new _.Bl(b.x+3,b.y+1));
  }
  if((b.x===a.Ba[0].length-2)&&(b.y===a.Ba.length-4)){
    cTemp.push(new _.Bl(b.x+1,b.y+3));
  }
  if((b.x===0)&&(b.y===a.Ba.length-1)){
    cTemp.push(new _.Bl(b.x+3,b.y-1));
    cTemp.push(new _.Bl(b.x+1,b.y-3));
  }
  if((b.x===3)&&(b.y===a.Ba.length-2)){
    cTemp.push(new _.Bl(0,b.y+1));
  }
  if((b.x===1)&&(b.y===a.Ba.length-4)){
    cTemp.push(new _.Bl(0,b.y+3));
  }
  if((b.x===0)&&(b.y===0)){
    cTemp.push(new _.Bl(b.x+3,b.y+1));
    cTemp.push(new _.Bl(b.x+1,b.y+3));
  }
  if((b.x===3)&&(b.y===1)){
    cTemp.push(new _.Bl(0,0));
  }
  if((b.x===1)&&(b.y===3)){
    cTemp.push(new _.Bl(0,0));
  }
  if((b.x===a.Ba[0].length-1)&&(b.y===0)){
    cTemp.push(new _.Bl(b.x-3,b.y+1));
    cTemp.push(new _.Bl(b.x-1,b.y+3));
  }
  if((b.x===a.Ba[0].length-4)&&(b.y===1)){
    cTemp.push(new _.Bl(b.x+3,0));
  }
  if((b.x===a.Ba[0].length-2)&&(b.y===3)){
    cTemp.push(new _.Bl(b.x+1,0));
  }
  // gets rid of fishhook (pattern 3)
  // case 1 & 4
  if((b.y===a.Ba.length-1)&&((window.walls.some(a=>a[0]===b.x+2&&a[1]===b.y-2))||(window.walls.some(a=>a[0]===b.x-2&&a[1]===b.y-2)))){
    cTemp.push(new _.Bl(b.x,b.y-2));
  }
  // case 3
  if((b.y===a.Ba.length-3)&&(window.walls.some(a=>a[0]===b.x+2&&a[1]===b.y+2))){
    cTemp.push(new _.Bl(b.x+2,b.y));
  }
  // case 2
  if((b.y===a.Ba.length-3)&&(window.walls.some(a=>a[0]===b.x-2&&a[1]===b.y+2))){
    cTemp.push(new _.Bl(b.x-2,b.y));
  }
  // case 5 & 8
  if((b.x===0)&&((window.walls.some(a=>a[0]===b.x+2&&a[1]===b.y+2))||(window.walls.some(a=>a[0]===b.x+2&&a[1]===b.y-2)))){
    cTemp.push(new _.Bl(b.x+2,b.y));
  }
  // case 6
  if((b.x===2)&&(window.walls.some(a=>a[0]===b.x-2&&a[1]===b.y-2))){
    cTemp.push(new _.Bl(b.x,b.y-2));
  }
  // case 7
  if((b.x===2)&&(window.walls.some(a=>a[0]===b.x-2&&a[1]===b.y+2))){
    cTemp.push(new _.Bl(b.x,b.y+2));
  }
  // case 9 & 12
  if((b.x===a.Ba[0].length-1)&&((window.walls.some(a=>a[0]===b.x-2&&a[1]===b.y-2))||(window.walls.some(a=>a[0]===b.x-2&&a[1]===b.y+2)))){
    cTemp.push(new _.Bl(b.x-2,b.y));
  }
  // case 10
  if((b.x===a.Ba[0].length-3)&&(window.walls.some(a=>a[0]===b.x+2&&a[1]===b.y+2))){
    cTemp.push(new _.Bl(b.x,b.y+2));
  }
  // case 11
  if((b.x===a.Ba[0].length-3)&&(window.walls.some(a=>a[0]===b.x+2&&a[1]===b.y-2))){
    cTemp.push(new _.Bl(b.x,b.y-2));
  }
  // case 14 & 16
  if((b.y===0)&&((window.walls.some(a=>a[0]===b.x+2&&a[1]===b.y+2))||(window.walls.some(a=>a[0]===b.x-2&&a[1]===b.y+2)))){
    cTemp.push(new _.Bl(b.x,b.y+2));
  }
  // case 13
  if((b.y===2)&&(window.walls.some(a=>a[0]===b.x-2&&a[1]===b.y-2))){
    cTemp.push(new _.Bl(b.x-2,b.y));
  }
  // case 15
  if((b.y===2)&&(window.walls.some(a=>a[0]===b.x+2&&a[1]===b.y-2))){
    cTemp.push(new _.Bl(b.x+2,b.y));
  }
  // case 17
  if((b.y===a.Ba.length-3)&&(window.walls.some(a=>a[0]===b.x&&a[1]===b.y+2))){
    cTemp.push(new _.Bl(b.x+2,b.y));
    cTemp.push(new _.Bl(b.x-2,b.y));
  }
  // case 18
  if((b.y===a.Ba.length-1)&&(window.walls.some(a=>a[0]===b.x&&a[1]===b.y-2))){
    cTemp.push(new _.Bl(b.x+2,b.y-2));
    cTemp.push(new _.Bl(b.x-2,b.y-2));
  }
  // case 19
  if((b.x===a.Ba.length[0]-3)&&(window.walls.some(a=>a[0]===b.x+2&&a[1]===b.y))){
    cTemp.push(new _.Bl(b.x,b.y-2));
    cTemp.push(new _.Bl(b.x,b.y+2));
  }
  // case 20
  if((b.x===a.Ba.length[0]-1)&&(window.walls.some(a=>a[0]===b.x-2&&a[1]===b.y))){
    cTemp.push(new _.Bl(b.x-2,b.y-2));
    cTemp.push(new _.Bl(b.x-2,b.y+2));
  }
  // case 21
  if((b.x===2)&&(window.walls.some(a=>a[0]===b.x-2&&a[1]===b.y))){
    cTemp.push(new _.Bl(b.x,b.y-2));
    cTemp.push(new _.Bl(b.x,b.y+2));
  }
  // case 22
  if((b.x===0)&&(window.walls.some(a=>a[0]===b.x+2&&a[1]===b.y))){
    cTemp.push(new _.Bl(b.x+2,b.y-2));
    cTemp.push(new _.Bl(b.x+2,b.y+2));
  }
  // case 23
  if((b.y===0)&&(window.walls.some(a=>a[0]===b.x&&a[1]===b.y+2))){
    cTemp.push(new _.Bl(b.x-2,b.y+2));
    cTemp.push(new _.Bl(b.x+2,b.y+2));
  }
  // case 24
  if((b.y===2)&&(window.walls.some(a=>a[0]===b.x&&a[1]===b.y-2))){
    cTemp.push(new _.Bl(b.x+2,b.y));
    cTemp.push(new _.Bl(b.x-2,b.y));
  }
  // case 25
  if((b.y===a.Ba.length-3)&&(window.walls.some(a=>a[0]===b.x-2&&a[1]===b.y))){
    cTemp.push(new _.Bl(b.x,b.y+2));
    cTemp.push(new _.Bl(b.x-2,b.y+2));
  }
  // case 26
  if((b.y===a.Ba.length-3)&&(window.walls.some(a=>a[0]===b.x+2&&a[1]===b.y))){
    cTemp.push(new _.Bl(b.x,b.y+2));
    cTemp.push(new _.Bl(b.x+2,b.y+2));
  }
  // case 27
  if((b.x===a.Ba[0].length-3)&&(window.walls.some(a=>a[0]===b.x&&a[1]===b.y-2))){
    cTemp.push(new _.Bl(b.x+2,b.y-2));
    cTemp.push(new _.Bl(b.x+2,b.y));
  }
  // case 28
  if((b.x===a.Ba[0].length-3)&&(window.walls.some(a=>a[0]===b.x&&a[1]===b.y+2))){
    cTemp.push(new _.Bl(b.x+2,b.y+2));
    cTemp.push(new _.Bl(b.x+2,b.y));
  }
  // case 29
  if((b.x===2)&&(window.walls.some(a=>a[0]===b.x&&a[1]===b.y-2))){
    cTemp.push(new _.Bl(b.x-2,b.y-2));
    cTemp.push(new _.Bl(b.x-2,b.y));
  }
  // case 30
  if((b.x===2)&&(window.walls.some(a=>a[0]===b.x&&a[1]===b.y+2))){
    cTemp.push(new _.Bl(b.x-2,b.y+2));
    cTemp.push(new _.Bl(b.x-2,b.y));
  }
  // case 31
  if((b.y===2)&&(window.walls.some(a=>a[0]===b.x+2&&a[1]===b.y))){
    cTemp.push(new _.Bl(b.x+2,b.y-2));
    cTemp.push(new _.Bl(b.x,b.y-2));
  }
  // case 32
  if((b.y===2)&&(window.walls.some(a=>a[0]===b.x-2&&a[1]===b.y))){
    cTemp.push(new _.Bl(b.x-2,b.y-2));
    cTemp.push(new _.Bl(b.x,b.y-2));
  }
  const c=cTemp;
*/

}