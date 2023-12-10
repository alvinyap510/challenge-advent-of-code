/*** Imports ***/
const fs = require("fs");
const readline = require("readline");

/*** Class, Constants & Configurations ***/

// | is a vertical pipe connecting north and south.
// - is a horizontal pipe connecting east and west.
// L is a 90-degree bend connecting north and east.
// J is a 90-degree bend connecting north and west.
// 7 is a 90-degree bend connecting south and west.
// F is a 90-degree bend connecting south and east.
// . is ground; there is no pipe in this tile.

const PIPES_TYPE = {
  "|": {
    up: true,
    down: true,
    left: false,
    right: false,
  },
  "-": {
    up: false,
    down: false,
    left: true,
    right: true,
  },
  L: {
    up: true,
    down: false,
    left: false,
    right: true,
  },
  J: {
    up: true,
    down: false,
    left: true,
    right: false,
  },
  7: {
    up: false,
    down: true,
    left: true,
    right: false,
  },
  F: {
    up: false,
    down: true,
    left: false,
    right: true,
  },
  ".": {
    up: false,
    down: false,
    left: false,
    right: false,
  },
  S: {
    up: true,
    down: true,
    left: true,
    right: true,
  },
};

class Point {
  constructor(x, y, val) {
    this.x = x;
    this.y = y;
    this.val = val;
  }
}

/*** Utilities and Helper Functions */

function comparePoints(pointOne, pointTwo) {
  if (
    pointOne.x === pointTwo.x &&
    pointOne.y === pointTwo.y &&
    pointOne.val === pointTwo.val
  )
    return true;
  return false;
}

/*** Sub Logics ***/
function extractMap(linesArray) {
  let map = [];
  for (let line of linesArray) {
    map.push(line.split(""));
  }
  return map;
}

function getSPosition(map) {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] == "S") return new Point(j, i, "S");
    }
  }
}

function checkPathExistence(path, point) {
  return path.some(
    (p) => p.x === point.x && p.y === point.y && p.val === point.val
  );
}

function findNext(map, path) {
  console.log("PATH:", path);

  let curr = path[path.length - 1];
  let currConnection = PIPES_TYPE[curr.val];

  if (currConnection.left === true && curr.x !== 0) {
    let left = new Point(curr.x - 1, curr.y, map[curr.y][curr.x - 1]);
    console.log("Left: ", left);
    if (!checkPathExistence(path, left) && PIPES_TYPE[left.val].right == true)
      return left;
  }

  //Check Top
  if (currConnection.up === true && curr.y !== 0) {
    let top = new Point(curr.x, curr.y - 1, map[curr.y - 1][curr.x]);
    console.log("Top: ", top);
    if (!checkPathExistence(path, top) && PIPES_TYPE[top.val].down == true)
      return top;
  }

  // Check Right
  if (currConnection.right === true && curr.x !== map[0].length - 1) {
    let right = new Point(curr.x + 1, curr.y, map[curr.y][curr.x + 1]);
    console.log("Right: ", right);
    // Check is travelable and not in path
    if (!checkPathExistence(path, right) && PIPES_TYPE[right.val].left == true)
      return right;
  }
  // Check Bottom
  if (currConnection.down === true && curr.y !== map.length - 1) {
    let bottom = new Point(curr.x, curr.y + 1, map[curr.y + 1][curr.x]);
    console.log("Bottom: ", bottom);
    // Check is travelable and not in path
    if (!checkPathExistence(path, bottom) && PIPES_TYPE[bottom.val].up == true)
      return bottom;
  }
}

function travel(starting, map) {
  let path = [];
  path.push(starting);
  do {
    next = findNext(map, path);
    if (next) path.push(next);
  } while (next);
  path.push(starting);
  console.log("Final Path: ", path);
  let farthest =
    path.length % 2 == 1 ? Math.floor(path.length / 2) : path.length / 2 - 1;
  console.log("Farthest: ", farthest);
}

/*** Logics ***/
function processInput(linesArray) {
  // Extract map from lines
  let map = extractMap(linesArray);
  console.log("Parsed map: ", map);
  // Get S Position
  let starting = getSPosition(map);
  // console.log(starting);
  // Travel
  let path = travel(starting, map);
}

/*** Main ***/

async function main() {
  /* Create readstream */
  const fileStream = fs.createReadStream("input.txt");
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  // Line Array
  let linesArray = [];

  // Asynchronous
  rl.on("line", (line) => {
    linesArray.push(line);
  });

  // After read line event has finished
  rl.on("close", () => {
    console.log("Input: \n");
    for (let line of linesArray) console.log(line);
    console.log("\n");

    processInput(linesArray);
  });
}

main();

// function testMain() {
//   let pointA = { x: 1, y: 1, val: "S" };
//   let pointB = { x: 1, y: 1, val: "S" };
//   let x = new Point(1, 1, "S");
//   let y = new Point(1, 1, "S");

//   console.log(pointA === pointB);
//   console.log(comparePoints(pointA, pointB));
//   console.log(x === y);
//   console.log(comparePoints(x, y));
// }
// testMain();

// PATH: [
//   Point { x: 1, y: 1, val: 'S' },
//   Point { x: 2, y: 1, val: '-' },
//   Point { x: 3, y: 1, val: '7' },
//   Point { x: 3, y: 2, val: '|' },
//   Point { x: 3, y: 3, val: 'J' },
//   Point { x: 2, y: 3, val: '-' },
//   Point { x: 1, y: 3, val: 'L' },
//   Point { x: 1, y: 2, val: '|' }
// ]

// Point { x: 1, y: 1, val: 'S' }, 0
// Point { x: 2, y: 1, val: '-' }, 1
// Point { x: 3, y: 1, val: '7' }, 2
// Point { x: 3, y: 2, val: '|' }, 3
// Point { x: 3, y: 3, val: 'J' }, 3
// Point { x: 2, y: 3, val: '-' }, 2
// Point { x: 1, y: 3, val: 'L' }, 1
// Point { x: 1, y: 1, val: 'S' } 0
