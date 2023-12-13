/*** Imports ***/
const fs = require("fs");
const { parse } = require("path");
const readline = require("readline");

/*** Class, Constants & Configurations ***/

class Point {
  constructor(x, y, val) {
    this.x = x;
    this.y = y;
    this.val = val;
  }
}

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
    expand: [
      [".", "W", "."],
      [".", "W", "."],
      [".", "W", "."],
    ],
  },
  "-": {
    up: false,
    down: false,
    left: true,
    right: true,
    expand: [
      [".", ".", "."],
      ["W", "W", "W"],
      [".", ".", "."],
    ],
  },
  L: {
    up: true,
    down: false,
    left: false,
    right: true,
    expand: [
      [".", "W", "."],
      [".", "W", "W"],
      [".", ".", "."],
    ],
  },
  J: {
    up: true,
    down: false,
    left: true,
    right: false,
    expand: [
      [".", "W", "."],
      ["W", "W", "."],
      [".", ".", "."],
    ],
  },
  7: {
    up: false,
    down: true,
    left: true,
    right: false,
    expand: [
      [".", ".", "."],
      ["W", "W", "."],
      [".", "W", "."],
    ],
  },
  F: {
    up: false,
    down: true,
    left: false,
    right: true,
    expand: [
      [".", ".", "."],
      [".", "W", "W"],
      [".", "W", "."],
    ],
  },
  ".": {
    up: false,
    down: false,
    left: false,
    right: false,
    expand: [
      [".", ".", "."],
      [".", ".", "."],
      [".", ".", "."],
    ],
  },
  S: {
    up: true,
    down: true,
    left: true,
    right: true,
    expand: [
      [".", ".", "."],
      [".", "W", "W"],
      [".", "W", "."],
    ],
  },
};

/*** Utilities and Helper Functions */
function logMap(parsedWall) {
  for (let line of parsedWall) {
    let str = "";
    for (let char of line) {
      str += char;
    }
    console.log(str);
  }
}

function checkPathExistence(path, point) {
  return path.some((p) => p.x === point.x && p.y === point.y);
}

function getPath(path, point) {
  for (let pipe of path) {
    if (pipe.x === point.x && pipe.y === point.y) return pipe;
  }
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

function findNext(map, path) {
  // console.log("PATH:", path);

  let curr = path[path.length - 1];
  let currConnection = PIPES_TYPE[curr.val];

  if (currConnection.left === true && curr.x !== 0) {
    let left = new Point(curr.x - 1, curr.y, map[curr.y][curr.x - 1]);
    // console.log("Left: ", left);
    if (!checkPathExistence(path, left) && PIPES_TYPE[left.val].right == true)
      return left;
  }

  //Check Top
  if (currConnection.up === true && curr.y !== 0) {
    let top = new Point(curr.x, curr.y - 1, map[curr.y - 1][curr.x]);
    // console.log("Top: ", top);
    if (!checkPathExistence(path, top) && PIPES_TYPE[top.val].down == true)
      return top;
  }

  // Check Right
  if (currConnection.right === true && curr.x !== map[0].length - 1) {
    let right = new Point(curr.x + 1, curr.y, map[curr.y][curr.x + 1]);
    // console.log("Right: ", right);
    // Check is travelable and not in path
    if (!checkPathExistence(path, right) && PIPES_TYPE[right.val].left == true)
      return right;
  }
  // Check Bottom
  if (currConnection.down === true && curr.y !== map.length - 1) {
    let bottom = new Point(curr.x, curr.y + 1, map[curr.y + 1][curr.x]);
    // console.log("Bottom: ", bottom);
    // Check is travelable and not in path
    if (!checkPathExistence(path, bottom) && PIPES_TYPE[bottom.val].up == true)
      return bottom;
  }
}

function travel(starting, map) {
  let path = [];
  path.push(starting);
  let next;
  do {
    next = findNext(map, path);
    if (next) path.push(next);
  } while (next);
  path.push(starting);
  return path;
}

function markDirections(path) {
  for (let i = 0; i < path.length - 1; i++) {
    let flowDirection;
    let towardsDirection;
    path[i + 1].directions = [];

    // Determine coming flow
    if (path[i].x < path[i + 1].x && path[i].y === path[i + 1].y)
      flowDirection = "to-right";
    else if (path[i].x > path[i + 1].x && path[i].y === path[i + 1].y)
      flowDirection = "to-left";
    else if (path[i].x === path[i + 1].x && path[i].y < path[i + 1].y)
      flowDirection = "to-bottom";
    else if (path[i].x === path[i + 1].x && path[i].y > path[i + 1].y)
      flowDirection = "to-top";
    path[i + 1].directions.push(flowDirection);

    // Determine towards flow
    let from = i + 1;
    let to = i + 2 == path.length ? 0 : i + 2;
    if (path[from].x < path[to].x && path[from].y === path[to].y)
      towardsDirection = "to-right";
    else if (path[from].x > path[to].x && path[from].y === path[to].y)
      towardsDirection = "to-left";
    else if (path[from].x === path[to].x && path[from].y < path[to].y)
      towardsDirection = "to-bottom";
    else if (path[from].x === path[to].x && path[from].y > path[to].y)
      towardsDirection = "to-top";
    if (path[from].val === "S") console.log();
    path[from].directions.push(towardsDirection);
  }
  path[0].directions[1] = path[1].directions[0];
  return path;
}

function findCircled(path, map) {
  let sum = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      // Create new point
      let point = new Point(j, i, map[i][j]);
      // Check is wall, skip to next loop
      if (checkPathExistence(path, point)) continue;
      // console.log(point);
      // Look right
      let k = j;
      while (k !== map[0].length) {
        let lookRightPoint = new Point(k, i, map[i][k]);
        if (checkPathExistence(path, lookRightPoint)) {
          let pipe = getPath(path, lookRightPoint);
          if (pipe.directions.includes("to-bottom")) {
            console.log("\nStarting: ", i, j);
            console.log("Check here: ", pipe);
            sum++;
          }
          break;
        }
        k++;
      }
    }
  }
  console.log(sum);
}

/*** Logics ***/
function processInput(linesArray) {
  // Extract map from lines
  let map = extractMap(linesArray);
  console.log("Parsed map: \n");
  logMap(map);

  // Get S Position
  let starting = getSPosition(map);

  // Travel down the path
  let path = travel(starting, map);
  path = markDirections(path);
  console.log(path);

  // Determine inside or outside the loop
  findCircled(path, map);
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
